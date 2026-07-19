# TKD Coach BOL

Aplicación móvil de evaluación asistida por IA para atletas de Taekwondo (modalidad Poomsae) en Bolivia. Un atleta graba o sube un video de su ejecución, el backend extrae la pose corporal frame a frame con **MediaPipe Pose**, un modelo de **Machine Learning** entrenado sobre esos datos le asigna un puntaje (0–10) y retroalimentación segmentada, y la app además gestiona competidores, llaves de competencia y ranking nacional.

Este documento es la referencia técnica oficial del proyecto (arquitectura, instalación, API y pruebas), y es el documento referenciado desde el Anexo técnico de la tesis asociada.

---

## Tabla de contenido

1. [Stack tecnológico](#stack-tecnológico)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Prerequisitos e instalación](#prerequisitos-e-instalación)
4. [Variables de entorno](#variables-de-entorno)
5. [Módulo de análisis de movimiento](#módulo-de-análisis-de-movimiento-analyze)
6. [Endpoints de la API](#endpoints-de-la-api)
7. [Documentación interactiva](#documentación-interactiva)
8. [Pruebas](#pruebas)
9. [Estado de seguridad](#estado-de-seguridad)
10. [Limitaciones conocidas](#limitaciones-conocidas)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend móvil | React Native 0.81 + Expo SDK 54, TypeScript 5.8, React Navigation 7 (stack + bottom tabs) |
| Backend / API | FastAPI 0.139, Uvicorn (ASGI), SQLAlchemy 2.0, Pydantic 2.9 |
| Base de datos | PostgreSQL 16, contenedor Docker (`docker-compose.yml`) |
| IA — visión | MediaPipe Pose (33 keypoints 3D por frame) + OpenCV |
| IA — scoring | scikit-learn `GradientBoostingRegressor` (200 estimadores, profundidad 5) entrenado sobre un dataset propio de 29 videos etiquetados |
| Pruebas backend | pytest + pytest-cov, Locust (rendimiento), pip-audit (seguridad) |
| Pruebas frontend | Jest + `jest-expo` + React Native Testing Library |

## Estructura del proyecto

```
TKD-Coach-BOL/
├── backend/
│   ├── app/
│   │   ├── api/            # Routers: auth, competidores, ranking, scanner
│   │   ├── core/           # database.py (engine, sesión SQLAlchemy)
│   │   ├── models/         # Modelos ORM (models.py)
│   │   ├── schemas/        # Esquemas Pydantic de respuesta (schemas.py)
│   │   └── main.py         # Punto de entrada de FastAPI
│   ├── tests/               # Suite de pytest (unitarios + integración)
│   ├── locustfile.py        # Escenarios de prueba de carga
│   ├── requirements.txt     # Dependencias de producción
│   ├── requirements-dev.txt # + pytest, locust, pip-audit
│   └── .env.example
├── mobile/
│   └── src/
│       ├── screens/         # 17 pantallas (Login, Ranking, LlaveCompetencia, Analysis, ...)
│       ├── components/      # BottomNavBar, MiniCalendar
│       ├── navigation/      # AppNavigator.tsx (React Navigation)
│       ├── services/        # analysisService.ts, videoService.ts (ver Limitaciones)
│       ├── theme/           # colors.ts, typography.ts
│       └── utils/           # Lógica de negocio pura y testeada (bracket, ranking, análisis, validación, video)
├── ai/
│   ├── data/
│   │   ├── samples/         # Videos de muestra (.mkv)
│   │   └── dataset/         # labels.csv (keypoints + score por frame)
│   ├── models/               # poomsae_scorer.pkl, label_encoder.pkl (modelo entrenado)
│   └── src/
│       ├── preprocessing/    # extracción/limpieza de keypoints
│       ├── training/         # train_model.py
│       └── inference/
├── database/
│   ├── schema/               # DDL inicial (montado en el contenedor de Postgres)
│   └── migrations/
├── docker-compose.yml         # Servicio de PostgreSQL
└── start.ps1                  # Script de arranque todo-en-uno (Windows)
```

## Prerequisitos e instalación

- Docker Desktop
- Python 3.11+
- Node.js 18+ y npm
- Expo Go (o un build de desarrollo) en el celular, o un emulador Android/iOS

### 1. Base de datos (PostgreSQL vía Docker)

```bash
docker-compose up -d
```

Levanta Postgres 16 en `localhost:5432`, base `tkd_coach_bol`, y ejecuta automáticamente el DDL de `database/schema/` en el primer arranque.

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt -r requirements-dev.txt
copy .env.example .env         # y completar DATABASE_URL si es necesario
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

El modelo de IA ya entrenado (`ai/models/poomsae_scorer.pkl` + `label_encoder.pkl`) se carga automáticamente al iniciar el servidor.

### 3. Frontend móvil

```bash
cd mobile
npm install
npx expo start --clear
```

La app apunta al backend en `http://10.0.2.2:8000` (alias del emulador Android hacia el `localhost` de la máquina host). Si se usa un dispositivo físico por USB, exponer el puerto con:

```bash
adb reverse tcp:8000 tcp:8000
```

### Todo junto (Windows)

`start.ps1` en la raíz automatiza los 3 pasos anteriores (Docker, backend con `--reload`, Expo) y además configura `adb reverse` y abre la app en el celular conectado.

## Variables de entorno

| Variable | Dónde | Descripción | Ejemplo |
|---|---|---|---|
| `DATABASE_URL` | `backend/.env` | Cadena de conexión SQLAlchemy a PostgreSQL | `postgresql://tkduser:tkd1234@localhost:5432/tkd_coach_bol` |

Plantilla disponible en `backend/.env.example`.

El frontend **no usa variables de entorno**: la URL del backend está *hardcodeada* como `const BACKEND_URL = 'http://10.0.2.2:8000'` de forma duplicada en 6 pantallas (`LoginScreen`, `RegisterScreen`, `ListaCompetidoresScreen`, `LlaveCompetenciaScreen`, `RankingTablaScreen`, `UploadVideoScreen`). Ver [Limitaciones conocidas](#limitaciones-conocidas).

## Módulo de análisis de movimiento (`/analyze`)

Flujo real implementado en `backend/app/api/scanner.py`:

1. El cliente sube un video (`multipart/form-data`) y el nombre del poomsae a `POST /analyze`.
2. El backend guarda el video en un archivo temporal y lo abre con OpenCV.
3. Frame a frame (a la resolución/FPS original del video), corre **MediaPipe Pose** (`model_complexity=1`) y extrae 33 keypoints `(x, y, z, visibility)` por frame con detección; los frames sin detección quedan con `keypoints: []`.
4. Con todos los frames procesados, `_calcular_score()` arma un vector de 133 features (33 keypoints × 4 valores + el poomsae codificado) por frame y lo pasa al `GradientBoostingRegressor` entrenado, prediciendo un score por frame.
5. Los scores por frame se promedian para el score final (0–10, redondeado a 2 decimales) y se dividen en 4 segmentos iguales (**Inicio, Desarrollo 1, Desarrollo 2, Cierre**) con su propio promedio y una observación textual (Excelente / Bien / Aceptable / A mejorar).
6. La respuesta JSON incluye: `fps`, `total_frames`, `width`, `height`, `connections` (35 pares de índices para dibujar el esqueleto), `frames` (array completo de keypoints por frame), `score`, `detalles` (los 4 segmentos) y `mensaje`.
7. El frontend (`AnalysisScreen.tsx`) reproduce el video y dibuja el esqueleto sobre un `<Svg>` sincronizado al frame actual según la posición de reproducción.

Si el modelo (`.pkl`) no está disponible en disco, el backend cae a un score fijo de 7.0 sin detalles, en vez de fallar.

## Endpoints de la API

### Auth — `/auth` (`app/api/auth.py`)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | `{correo, contrasena}` → datos del usuario + rol. 401 si no existe o la contraseña es incorrecta. |
| POST | `/auth/register` | `{nombre, apellido, correo, contrasena}` → crea el usuario (rol `atleta` por defecto). 400 si el correo ya existe. |

### Competidores — `/competidores` (`app/api/competidores.py`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/competidores/` | Lista de competidores (opcional `?modalidad=`), con club y ciudad. |
| GET | `/competidores/por-peso` | Filtra por `?peso=` y `?sexo=` (para armar llaves de Kyorugi). |

### Ranking — `/ranking` (`app/api/ranking.py`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ranking/` | Tabla de posiciones. `?categoria=` filtra; `?modalidad=Pareja` devuelve ranking de parejas en vez de individual. |
| GET | `/ranking/poomsae` | Catálogo de poomsaes (id, nombre, nivel). |
| POST | `/ranking/actualizar` | `{primero, segundo, terceros[], categoria}` → suma puntaje acumulado (+3 / +2 / +1) tras cerrar una llave. |

### Scanner / IA — sin prefijo (`app/api/scanner.py`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | `{"status": "healthy"}` — healthcheck. |
| POST | `/analyze` | Sube un video + poomsae, devuelve el análisis completo (ver sección anterior). |

### Raíz (`app/main.py`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | `{"status": "TKD Coach BO API running"}` |
| GET | `/health` | *(definido pero inalcanzable — ver Limitaciones conocidas)* |

### Módulo de administración (clubes, atletas, eventos, resultados)

**No implementado todavía.** El modelo de datos (`app/models/models.py`) ya define las tablas `Club` y `Evento` (y `Evaluacion`/`DetalleEvaluacion` para resultados detallados), pero no existen routers ni endpoints CRUD para administrarlas, y el frontend no tiene pantallas de administración. Queda como trabajo futuro sobre una base de datos que ya está preparada para soportarlo.

## Documentación interactiva

Con el backend corriendo, FastAPI expone automáticamente:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI (JSON):** http://localhost:8000/openapi.json

## Pruebas

### Backend — pytest

```bash
cd backend
python -m pytest --cov=app --cov-branch --cov-report=term-missing --cov-report=html:htmlcov
```

Estado real verificado: **20 tests, 100% passed**, cobertura total **79%** (354 statements, 44 ramas). Desglose por módulo:

| Módulo | Cobertura |
|---|---|
| `api/auth.py` | 100% |
| `api/competidores.py` | 100% |
| `core/database.py` | 100% |
| `models/models.py` | 100% |
| `main.py` | 90% |
| `api/ranking.py` | 68% (`POST /ranking/actualizar` sin tests automatizados) |
| `api/scanner.py` | 53% (el pipeline de `/analyze` se valida manualmente contra videos reales, no en la suite automatizada) |

### Frontend — Jest

```bash
cd mobile
npm run test:coverage
```

Estado real verificado: **60 tests, 100% passed**, sobre `mobile/src/utils/` (la lógica de negocio pura extraída de las pantallas: llaves de competencia, ranking, deducciones de puntaje, validación de formularios y cálculos de reproducción de video): **100% statements / 100% functions / 100% lines / 95.06% branch**. Las pantallas (`screens/`) y componentes visuales aún no tienen pruebas automatizadas — ver Limitaciones conocidas.

### Rendimiento — Locust

```bash
cd backend
locust -f locustfile.py --host=http://127.0.0.1:8000
```

Abre la interfaz web de Locust en `http://localhost:8089` para configurar usuarios concurrentes y duración contra los endpoints de `/competidores/`, `/ranking/` y `/health`.

## Estado de seguridad

Auditado con `pip-audit` (backend) y `npm audit` (frontend):

- **Backend, dependencias de producción** (`requirements.txt`): **0 vulnerabilidades conocidas**, incluyendo FastAPI y Starlette actualizados.
- **Backend, dependencias de desarrollo** (`requirements-dev.txt`): 1 vulnerabilidad de severidad baja en `pytest` 8.3.3 (herramienta de testing, no se despliega en producción; corregida en pytest 9.0.3).
- **Frontend** (`npm audit`): **0 vulnerabilidades críticas o altas**. 17 vulnerabilidades de severidad **moderada**, todas originadas en la cadena de herramientas de Expo (`@expo/config-plugins` → `xcode` → `uuid`), no en dependencias de la app en sí. La corrección requiere `npm audit fix --force`, que actualiza a Expo 57 (cambio disruptivo respecto al SDK 54 usado actualmente) — pendiente de evaluar en una migración de SDK aparte.

## Limitaciones conocidas

- **Autenticación sin JWT:** el login (`/auth/login`) valida el hash SHA-256 de la contraseña y devuelve directamente los datos del usuario, sin emitir un token de sesión ni JWT. No hay expiración de sesión ni verificación de identidad en las siguientes peticiones. Mejora pendiente antes de un despliegue en producción.
- **Dataset de IA reducido:** el modelo se entrenó sobre 29 videos etiquetados (`ai/data/dataset/labels.csv`), cubriendo Taegeuk Yuk/Chil/Pal Jang, Koryo, Keumgang, Taebaek, Pyongwon y Sipjin. Es un dataset inicial, ampliable a futuro para mejorar la generalización del modelo.
- **`GET /health` duplicado y parcialmente inalcanzable:** existe tanto en `scanner.py` (`{"status": "healthy"}`) como en `main.py` (`{"status": "ok"}`). Como el router de `scanner` se registra primero en `main.py`, FastAPI siempre resuelve `/health` a la versión de `scanner`; la definida en `main.py` es código muerto.
- **URL del backend hardcodeada en el frontend:** `BACKEND_URL` está repetida como literal en 6 pantallas en vez de centralizada en una variable de entorno o config compartida — cambiar de entorno (dev/prod) requiere editar cada archivo.
- **`mobile/src/services/`** (`analysisService.ts`, `videoService.ts`) existen como archivos vacíos (0 bytes): la lógica de llamadas a la API vive directamente en las pantallas, no en una capa de servicio separada.
- **Módulo de administración no implementado:** ver sección de Endpoints — el modelo de datos está listo (`Club`, `Evento`) pero faltan endpoints y pantallas de administración.
- **Pantallas sin pruebas automatizadas:** la cobertura de Jest del frontend es real y alta (95–100%) sobre `mobile/src/utils/`, pero 0% sobre `screens/`, `components/` y `navigation/`, que requieren mocks de React Navigation, `fetch`, `AsyncStorage` y módulos nativos de Expo para poder testearse — no cubierto en esta iteración.

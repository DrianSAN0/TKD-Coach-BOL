-- ══════════════════════════════════════════════════════
-- TKD Coach BOL — Schema PostgreSQL
-- Basado en Modelo Entidad-Relación oficial
-- Adrian Sanchez Nina | Código: 69546
-- ══════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── MÓDULO DE USUARIOS ─────────────────────────────────

CREATE TABLE usuario (
    id_usuario        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    correo            VARCHAR(150) UNIQUE NOT NULL,
    contrasena_hash   VARCHAR(255) NOT NULL,
    rol               VARCHAR(20) CHECK (rol IN ('atleta', 'entrenador', 'administrador')) NOT NULL,
    estado            VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE club (
    id_club           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_club       VARCHAR(150) NOT NULL,
    ciudad            VARCHAR(100),
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE grado (
    id_grado          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_grado      VARCHAR(100) NOT NULL,
    color_cinturon    VARCHAR(50),
    nivel             INTEGER NOT NULL
);

CREATE TABLE atleta (
    id_atleta         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario        UUID NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    fecha_nacimiento  DATE,
    sexo              VARCHAR(10) CHECK (sexo IN ('masculino', 'femenino')),
    peso              FLOAT,
    categoria         VARCHAR(50),
    id_club           UUID REFERENCES club(id_club),
    grado_actual_id   UUID REFERENCES grado(id_grado),
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE entrenador (
    id_entrenador     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario        UUID NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_club           UUID REFERENCES club(id_club),
    especialidad      VARCHAR(150),
    certificacion     VARCHAR(150),
    created_at        TIMESTAMP DEFAULT NOW()
);

-- ── MÓDULO RECONOCIMIENTO BIOMÉTRICO ───────────────────

CREATE TABLE poomsae (
    id_poomsae        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre            VARCHAR(100) NOT NULL,
    nivel             INTEGER,
    descripcion       TEXT
);

CREATE TABLE evaluacion (
    id_evaluacion     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_atleta         UUID NOT NULL REFERENCES atleta(id_atleta) ON DELETE CASCADE,
    id_poomsae        UUID NOT NULL REFERENCES poomsae(id_poomsae),
    fecha_evaluacion  DATE DEFAULT CURRENT_DATE,
    tipo_evaluacion   VARCHAR(20) CHECK (tipo_evaluacion IN ('IA', 'manual', 'ascenso_grado')),
    puntaje_total     FLOAT CHECK (puntaje_total >= 0 AND puntaje_total <= 10),
    resultado         VARCHAR(20) DEFAULT 'pendiente' CHECK (resultado IN ('aprobado', 'reprobado', 'pendiente')),
    observaciones     TEXT,
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE detalle_evaluacion (
    id_detalle        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_evaluacion     UUID NOT NULL REFERENCES evaluacion(id_evaluacion) ON DELETE CASCADE,
    criterio          VARCHAR(100) NOT NULL,
    puntaje           FLOAT,
    observacion       TEXT
);

CREATE TABLE archivo_analisis (
    id_archivo        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_evaluacion     UUID NOT NULL REFERENCES evaluacion(id_evaluacion) ON DELETE CASCADE,
    url_archivo       VARCHAR(255),
    modelo_usado      VARCHAR(100),
    fecha_subida      TIMESTAMP DEFAULT NOW()
);

-- ── MÓDULOS COMPLEMENTARIOS ────────────────────────────

CREATE TABLE evento (
    id_evento         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_evento     VARCHAR(150) NOT NULL,
    tipo_evento       VARCHAR(30) CHECK (tipo_evento IN ('competencia', 'torneo', 'seminario', 'actividad')),
    fecha_inicio      DATE NOT NULL,
    fecha_fin         DATE,
    lugar             VARCHAR(200),
    descripcion       TEXT,
    estado            VARCHAR(20) DEFAULT 'programado' CHECK (estado IN ('programado', 'en curso', 'finalizado', 'cancelado')),
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ranking (
    id_ranking            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_atleta             UUID NOT NULL REFERENCES atleta(id_atleta) ON DELETE CASCADE,
    categoria             VARCHAR(50),
    puntaje_acumulado     FLOAT DEFAULT 0,
    posicion              INTEGER,
    fecha_actualizacion   TIMESTAMP DEFAULT NOW()
);

-- ── SEEDS — Datos iniciales ────────────────────────────

INSERT INTO grado (nombre_grado, color_cinturon, nivel) VALUES
('Keup 10', 'Blanco',        1),
('Keup 9',  'Amarillo',      2),
('Keup 8',  'Amarillo punta',3),
('Keup 7',  'Verde',         4),
('Keup 6',  'Verde punta',   5),
('Keup 5',  'Azul',          6),
('Keup 4',  'Azul punta',    7),
('Keup 3',  'Rojo',          8),
('Keup 2',  'Rojo punta',    9),
('Keup 1',  'Rojo doble',    10),
('Dan 1',   'Negro',         11),
('Dan 2',   'Negro',         12),
('Dan 3',   'Negro',         13);

INSERT INTO club (nombre_club, ciudad) VALUES
('Club Kundo Kwang', 'La Paz'),
('Club Olimpia',     'La Paz'),
('Club Taejo',       'La Paz'),
('Club Dragón',      'Cochabamba');

INSERT INTO poomsae (nombre, nivel, descripcion) VALUES
('Taegeuk Il Jang',  1, 'Primer Taegeuk — simboliza el cielo y la luz'),
('Taegeuk Ee Jang',  2, 'Segundo Taegeuk — simboliza el gozo interior'),
('Taegeuk Sam Jang', 3, 'Tercer Taegeuk — simboliza el fuego y el sol'),
('Taegeuk Sa Jang',  4, 'Cuarto Taegeuk — simboliza el trueno'),
('Taegeuk Oh Jang',  5, 'Quinto Taegeuk — simboliza el viento'),
('Taegeuk Yuk Jang', 6, 'Sexto Taegeuk — simboliza el agua'),
('Taegeuk Chil Jang',7, 'Séptimo Taegeuk — simboliza la montaña'),
('Taegeuk Pal Jang', 8, 'Octavo Taegeuk — simboliza la tierra'),
('Koryo',            9, '1er Dan — simboliza la antigua Corea'),
('Keumgang',         10,'2do Dan — simboliza el diamante');
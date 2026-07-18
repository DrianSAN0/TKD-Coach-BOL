import os
import cv2
import pickle
import tempfile
import numpy as np
import mediapipe as mp
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

# Cargar modelo entrenado
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
MODEL_PATH   = os.path.join(ROOT_DIR, "ai", "models", "poomsae_scorer.pkl")
ENCODER_PATH = os.path.join(ROOT_DIR, "ai", "models", "label_encoder.pkl")

modelo = None
encoder = None

def cargar_modelo():
    global modelo, encoder
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        with open(MODEL_PATH, "rb") as f:
            modelo = pickle.load(f)
        with open(ENCODER_PATH, "rb") as f:
            encoder = pickle.load(f)
        print("[TKD] Modelo cargado correctamente")
    else:
        print("[TKD] Modelo no encontrado, usando score básico")

cargar_modelo()

POSE_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 7),
    (0, 4), (4, 5), (5, 6), (6, 8),
    (9, 10),
    (11, 12),
    (11, 13), (13, 15), (15, 17), (15, 19), (15, 21), (17, 19),
    (12, 14), (14, 16), (16, 18), (16, 20), (16, 22), (18, 20),
    (11, 23), (12, 24), (23, 24),
    (23, 25), (25, 27), (27, 29), (29, 31), (27, 31),
    (24, 26), (26, 28), (28, 30), (30, 32), (28, 32),
]

POOMSAE_MAP = {
    "Taegeuk Yuk Jang":  "Taegeuk_Yuk_Jang",
    "Taegeuk Chil Jang": "Taegeuk_Chil_Jang",
    "Taegeuk Pal Jang":  "Taegeuk_Pal_Jang",
    "Koryo":             "Koryo",
    "Keumgang":          "Keumgang",
    "Taebaek":           "Taebaek",
    "Pyongwon":          "Pyongwon",
    "Sipjin":            "Sipjin",
}

@router.get("/health")
def health():
    return {"status": "healthy"}

@router.post("/analyze")
async def analyze_video(
    video: UploadFile = File(...),
    poomsae: str = "Koryo"
):
    suffix = os.path.splitext(video.filename or "video.mp4")[-1] or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await video.read()
        tmp.write(content)
        tmp_path = tmp.name
    try:
        result = _process_video(tmp_path, poomsae)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando video: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

def _calcular_score(frames_data: list, poomsae: str) -> dict:
    """Calcula score usando el modelo entrenado."""
    if modelo is None or encoder is None:
        return {"score": 7.0, "detalles": [], "mensaje": "Modelo no disponible"}

    poomsae_key = POOMSAE_MAP.get(poomsae, "Koryo")

    # Verificar que el poomsae esté en el encoder
    if poomsae_key not in encoder.classes_:
        poomsae_key = encoder.classes_[0]

    poomsae_enc = encoder.transform([poomsae_key])[0]

    scores_por_frame = []
    for frame in frames_data:
        kps = frame.get("keypoints", [])
        if not kps:
            continue

        # Construir vector de keypoints
        vec = []
        for kp in kps:
            vec.extend([kp.get("x", 0), kp.get("y", 0), kp.get("z", 0), kp.get("visibility", 0)])

        if len(vec) != 33 * 4:
            continue

        vec.append(poomsae_enc)
        pred = modelo.predict([vec])[0]
        scores_por_frame.append(pred)

    if not scores_por_frame:
        return {"score": 5.0, "detalles": [], "mensaje": "No se detectó cuerpo en el video"}

    score_final = float(np.mean(scores_por_frame))
    score_final = round(min(10.0, max(0.0, score_final)), 2)

    # Detalles por segmento
    n = len(scores_por_frame)
    seg = n // 4
    segmentos = ["Inicio", "Desarrollo 1", "Desarrollo 2", "Cierre"]
    detalles = []
    for i, nombre in enumerate(segmentos):
        start = i * seg
        end = start + seg if i < 3 else n
        seg_scores = scores_por_frame[start:end]
        seg_score = round(float(np.mean(seg_scores)), 2) if seg_scores else 0.0
        obs = "Excelente" if seg_score >= 8.5 else "Bien" if seg_score >= 7.0 else "Aceptable" if seg_score >= 5.0 else "A mejorar"
        detalles.append({"segmento": nombre, "puntuacion": seg_score, "observacion": obs})

    if score_final >= 8.5:
        mensaje = "¡Excelente ejecución! Técnica muy precisa."
    elif score_final >= 7.0:
        mensaje = "Buena ejecución. Hay pequeñas áreas de mejora."
    elif score_final >= 5.0:
        mensaje = "Ejecución aceptable. Practica los movimientos débiles."
    else:
        mensaje = "Necesitas más práctica. Revisa la técnica base."

    return {"score": score_final, "detalles": detalles, "mensaje": mensaje}

def _process_video(video_path: str, poomsae: str = "Koryo") -> dict:
    mp_pose = mp.solutions.pose
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"No se pudo abrir el video: {video_path}")

    fps    = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total  = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"[TKD] {width}x{height} | {fps:.1f} fps | ~{total} frames")

    frames_data = []
    with mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ) as pose:
        idx = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            rgb     = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb)
            keypoints = []
            if results.pose_landmarks:
                for lm in results.pose_landmarks.landmark:
                    keypoints.append({
                        "x":          round(lm.x, 5),
                        "y":          round(lm.y, 5),
                        "z":          round(lm.z, 5),
                        "visibility": round(lm.visibility, 4),
                    })
            frames_data.append({"frame": idx, "keypoints": keypoints})
            idx += 1
            if idx % 30 == 0:
                print(f"[TKD] {idx}/{total} frames...")

    cap.release()
    print(f"[TKD] Listo — {idx} frames procesados")

    # Calcular score con modelo
    scoring = _calcular_score(frames_data, poomsae)

    return {
        "fps":          fps,
        "total_frames": idx,
        "width":        width,
        "height":       height,
        "connections":  [list(c) for c in POSE_CONNECTIONS],
        "frames":       frames_data,
        "score":        scoring["score"],
        "detalles":     scoring["detalles"],
        "mensaje":      scoring["mensaje"],
    }
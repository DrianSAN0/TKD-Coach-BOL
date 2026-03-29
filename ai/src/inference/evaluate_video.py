# ai/src/inference/evaluate_video.py

import os
import sys
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
sys.path.insert(0, os.path.join(ROOT_DIR, "ai", "src"))

from preprocessing.extract_keypoints import process_video
from training.compare_sequences import compare_sequences


def evaluate_video(test_video_path: str, reference_video_path: str) -> dict:
    """
    Pipeline completo:
    1. Extrae keypoints del video de prueba
    2. Extrae keypoints del video de referencia
    3. Compara secuencias y retorna score
    """

    # Rutas temporales para los keypoints
    test_kp_path = os.path.join(ROOT_DIR, "ai", "data", "processed", "_tmp_test_kp.json")
    ref_kp_path  = os.path.join(ROOT_DIR, "ai", "data", "processed", "_tmp_ref_kp.json")

    print("[INFO] Extrayendo keypoints del video de prueba...")
    process_video(test_video_path, test_kp_path)

    print("[INFO] Extrayendo keypoints del video de referencia...")
    process_video(reference_video_path, ref_kp_path)

    print("[INFO] Comparando secuencias...")
    score, detalles = compare_sequences(test_kp_path, ref_kp_path)

    # Limpiar temporales
    for p in [test_kp_path, ref_kp_path]:
        if os.path.exists(p):
            os.remove(p)

    # Mensaje según score
    if score >= 8.5:
        mensaje = "¡Excelente ejecución! Técnica muy precisa."
    elif score >= 7.0:
        mensaje = "Buena ejecución. Hay pequeñas áreas de mejora."
    elif score >= 5.0:
        mensaje = "Ejecución aceptable. Practica los movimientos débiles."
    else:
        mensaje = "Necesitas más práctica. Revisa la técnica base."

    return {
        "score": round(score, 2),
        "detalles": detalles,
        "mensaje": mensaje
    }


if __name__ == "__main__":
    test_path = os.path.join(ROOT_DIR, "ai", "data", "samples", "video_prueba.mp4")
    ref_path  = os.path.join(ROOT_DIR, "ai", "data", "samples", "video_referencia.mp4")
    result = evaluate_video(test_path, ref_path)
    print(f"\n✅ Score final: {result['score']}")
    print(f"💬 {result['mensaje']}")
# ai/src/training/compare_sequences.py

import json
import numpy as np
from typing import Tuple, List


def load_keypoints(path: str) -> List[dict]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def frame_to_vector(keypoints: list) -> np.ndarray:
    """Convierte keypoints de un frame a vector numpy plano."""
    if not keypoints:
        return np.zeros(33 * 3)
    coords = []
    for kp in keypoints:
        coords.extend([kp.get("x", 0), kp.get("y", 0), kp.get("z", 0)])
    return np.array(coords)


def normalize_sequence(seq: List[np.ndarray]) -> List[np.ndarray]:
    """Normaliza cada frame por la longitud del torso."""
    normalized = []
    for vec in seq:
        norm = np.linalg.norm(vec)
        normalized.append(vec / norm if norm > 0 else vec)
    return normalized


def dtw_distance(seq1: List[np.ndarray], seq2: List[np.ndarray]) -> float:
    """Dynamic Time Warping entre dos secuencias."""
    n, m = len(seq1), len(seq2)
    dtw = np.full((n + 1, m + 1), np.inf)
    dtw[0][0] = 0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = np.linalg.norm(seq1[i-1] - seq2[j-1])
            dtw[i][j] = cost + min(dtw[i-1][j], dtw[i][j-1], dtw[i-1][j-1])

    return dtw[n][m]


def compare_sequences(test_path: str, reference_path: str) -> Tuple[float, List[dict]]:
    """
    Compara dos videos frame a frame usando DTW.
    Retorna (score 0-10, lista de detalles por segmento).
    """
    test_data = load_keypoints(test_path)
    ref_data  = load_keypoints(reference_path)

    # Convertir a vectores
    test_seq = [frame_to_vector(f["keypoints"]) for f in test_data]
    ref_seq  = [frame_to_vector(f["keypoints"]) for f in ref_data]

    # Normalizar
    test_seq = normalize_sequence(test_seq)
    ref_seq  = normalize_sequence(ref_seq)

    # Calcular distancia DTW global
    distance = dtw_distance(test_seq, ref_seq)

    # Normalizar a score 0-10
    # A menor distancia = mejor score
    max_expected_distance = len(test_seq) * 5.0
    score = max(0, 10 - (distance / max_expected_distance) * 10)
    score = min(10, score)

    # Detalles por segmentos (divide en 4 partes)
    segment_size = len(test_seq) // 4
    detalles = []
    segmentos = ["Inicio", "Desarrollo 1", "Desarrollo 2", "Cierre"]

    for i, nombre in enumerate(segmentos):
        start = i * segment_size
        end = start + segment_size if i < 3 else len(test_seq)
        t_seg = test_seq[start:end]
        r_seg = ref_seq[start:end]

        if len(t_seg) > 0 and len(r_seg) > 0:
            seg_dist = dtw_distance(t_seg, r_seg)
            seg_score = max(0, min(10, 10 - (seg_dist / (segment_size * 5.0)) * 10))
        else:
            seg_score = 0

        detalles.append({
            "segmento": nombre,
            "puntuacion": round(seg_score, 2),
            "observacion": _observacion(seg_score)
        })

    return round(score, 2), detalles


def _observacion(score: float) -> str:
    if score >= 8.5: return "Excelente"
    if score >= 7.0: return "Bien"
    if score >= 5.0: return "Aceptable"
    return "A mejorar"
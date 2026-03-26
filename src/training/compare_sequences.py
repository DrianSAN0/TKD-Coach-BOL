import pandas as pd
import numpy as np


def load_csv(path):
    return pd.read_csv(path)


def get_numeric_matrix(df):
    numeric_df = df.drop(columns=["frame"], errors="ignore")
    return numeric_df.to_numpy(dtype=float)


def resize_to_min_length(a, b):
    min_len = min(len(a), len(b))
    return a[:min_len], b[:min_len]


def classify_similarity(similarity):
    if similarity >= 90:
        return "Alta"
    elif similarity >= 75:
        return "Media"
    else:
        return "Baja"


def generate_observation(similarity):
    if similarity >= 95:
        return "Ejecución sobresaliente, muy cercana a la referencia."
    elif similarity >= 90:
        return "Ejecución correcta, con pequeñas diferencias respecto a la referencia."
    elif similarity >= 80:
        return "Buena ejecución, pero requiere ajustes técnicos."
    elif similarity >= 70:
        return "Ejecución aceptable, con varios aspectos por corregir."
    else:
        return "Ejecución deficiente respecto a la referencia esperada."


def calculate_score(similarity):
    score = similarity / 10
    return round(score, 2)


def compare_sequences(path_a, path_b):
    df_a = load_csv(path_a)
    df_b = load_csv(path_b)

    seq_a = get_numeric_matrix(df_a)
    seq_b = get_numeric_matrix(df_b)

    seq_a, seq_b = resize_to_min_length(seq_a, seq_b)

    diff = np.abs(seq_a - seq_b)
    mean_diff = np.mean(diff)

    similarity = max(0, 100 - (mean_diff * 100))
    level = classify_similarity(similarity)
    observation = generate_observation(similarity)
    score = calculate_score(similarity)

    print(f"Frames comparados: {len(seq_a)}")
    print(f"Diferencia media: {mean_diff:.6f}")
    print(f"Similitud estimada: {similarity:.2f}%")
    print(f"Nivel de similitud: {level}")
    print(f"Puntaje final: {score}/10")
    print(f"Observación: {observation}")


if __name__ == "__main__":
    path_a = "data/processed/keypoints_referencia.csv"
    path_b = "data/processed/keypoints_prueba.csv"

    compare_sequences(path_a, path_b)
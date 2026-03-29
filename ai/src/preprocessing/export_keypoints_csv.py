import json
import csv
import os


def load_data(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def flatten_frame(frame_data):
    row = {"frame": frame_data["frame"]}
    keypoints = frame_data["keypoints"]

    for i, kp in enumerate(keypoints):
        row[f"kp_{i}_x"] = kp["x"]
        row[f"kp_{i}_y"] = kp["y"]
        row[f"kp_{i}_z"] = kp["z"]
        row[f"kp_{i}_visibility"] = kp["visibility"]

    return row


def export_to_csv(data, output_path):
    rows = [flatten_frame(frame) for frame in data]

    if not rows:
        print(f"[ERROR] No hay datos para exportar en {output_path}")
        return

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    fieldnames = rows[0].keys()

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"[INFO] CSV guardado en: {output_path}")
    print(f"[INFO] Total de filas exportadas: {len(rows)}")


if __name__ == "__main__":
    archivos = [
        ("data/processed/keypoints_referencia_clean.json", "data/processed/keypoints_referencia.csv"),
        ("data/processed/keypoints_prueba_clean.json", "data/processed/keypoints_prueba.csv"),
    ]

    for input_path, output_path in archivos:
        data = load_data(input_path)
        export_to_csv(data, output_path)
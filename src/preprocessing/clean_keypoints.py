import json


def load_data(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def clean_data(data):
    return [frame for frame in data if len(frame["keypoints"]) > 0]


def save_data(data, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    archivos = [
        ("data/processed/keypoints_referencia.json", "data/processed/keypoints_referencia_clean.json"),
        ("data/processed/keypoints_prueba.json", "data/processed/keypoints_prueba_clean.json"),
    ]

    for input_path, output_path in archivos:
        data = load_data(input_path)
        cleaned = clean_data(data)

        print(f"\nArchivo: {input_path}")
        print(f"Frames originales: {len(data)}")
        print(f"Frames limpios: {len(cleaned)}")

        save_data(cleaned, output_path)
        print(f"[INFO] Guardado en: {output_path}")
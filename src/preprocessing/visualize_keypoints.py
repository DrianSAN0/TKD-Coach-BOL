import json


def load_keypoints(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def inspect_data(data):
    total_frames = len(data)
    frames_with_keypoints = [f for f in data if len(f["keypoints"]) > 0]
    empty_frames = total_frames - len(frames_with_keypoints)

    print(f"Total de frames: {total_frames}")
    print(f"Frames con keypoints: {len(frames_with_keypoints)}")
    print(f"Frames vacíos: {empty_frames}")

    if not frames_with_keypoints:
        print("\n[ERROR] Ningún frame tiene keypoints.")
        return

    first_valid = frames_with_keypoints[0]

    print("\nPrimer frame válido:")
    print(f"Frame #: {first_valid['frame']}")
    print(f"Cantidad de keypoints: {len(first_valid['keypoints'])}")

    print("\nPrimeros 5 puntos:")
    for i, kp in enumerate(first_valid["keypoints"][:5]):
        print(f"Punto {i}: {kp}")


if __name__ == "__main__":
    path = "data/processed/keypoints.json"
    data = load_keypoints(path)
    inspect_data(data)
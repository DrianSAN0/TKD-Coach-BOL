# ai/src/dataset/build_dataset.py
import os
import sys
import cv2
import csv
import mediapipe as mp

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
SAMPLES_DIR = os.path.join(ROOT_DIR, "ai", "data", "samples")
DATASET_DIR = os.path.join(ROOT_DIR, "ai", "data", "dataset")
IMAGENES_DIR = os.path.join(DATASET_DIR, "imagenes")
LABELS_CSV = os.path.join(DATASET_DIR, "labels.csv")

# Mapeo de nombres a poomsae
POOMSAE_MAP = {
    "6": "Taegeuk_Yuk_Jang",
    "7": "Taegeuk_Chil_Jang",
    "8": "Taegeuk_Pal_Jang",
    "Koryo": "Koryo",
    "Keumgang": "Keumgang",
    "Taebaek": "Taebaek",
    "Pyongwon": "Pyongwon",
    "Sipjin": "Sipjin",
    "Sipgin": "Sipjin",  # typo en el archivo
}

mp_pose = mp.solutions.pose

def parse_filename(filename):
    """Extrae poomsae y score del nombre del archivo."""
    name = os.path.splitext(filename)[0]
    parts = name.split("_", 1)
    if len(parts) != 2:
        return None, None
    prefix = parts[0]
    try:
        score = float(parts[1])
    except ValueError:
        return None, None
    poomsae = POOMSAE_MAP.get(prefix)
    if not poomsae:
        return None, None
    return poomsae, score

def extract_frames(video_path, poomsae, score):
    """Extrae frames del video y guarda imágenes + keypoints."""
    filename = os.path.basename(video_path)
    name = os.path.splitext(filename)[0]

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"[ERROR] No se pudo abrir: {video_path}")
        return []

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"[INFO] Procesando {filename} — {total} frames")

    rows = []
    frame_idx = 0

    with mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ) as pose:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Guardar imagen
            img_name = f"{name}_frame_{frame_idx:05d}.jpg"
            img_path = os.path.join(IMAGENES_DIR, img_name)
            cv2.imwrite(img_path, frame)

            # Extraer keypoints
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb)

            keypoints_flat = []
            if results.pose_landmarks:
                for lm in results.pose_landmarks.landmark:
                    keypoints_flat.extend([
                        round(lm.x, 5),
                        round(lm.y, 5),
                        round(lm.z, 5),
                        round(lm.visibility, 4),
                    ])
            else:
                keypoints_flat = [0.0] * (33 * 4)

            row = [img_name, poomsae, score, frame_idx] + keypoints_flat
            rows.append(row)

            frame_idx += 1
            if frame_idx % 100 == 0:
                print(f"[INFO] Procesados {frame_idx}/{total} frames...")

    cap.release()
    print(f"[OK] {frame_idx} frames extraídos de {filename}")
    return rows

def build_dataset():
    os.makedirs(IMAGENES_DIR, exist_ok=True)

    # Header del CSV
    kp_headers = []
    for i in range(33):
        kp_headers += [f"kp{i}_x", f"kp{i}_y", f"kp{i}_z", f"kp{i}_vis"]
    header = ["imagen", "poomsae", "score", "frame"] + kp_headers

    videos = [f for f in os.listdir(SAMPLES_DIR)
              if f.endswith((".mkv", ".mp4"))
              and not f.startswith("video_")]  # excluir video_prueba y video_referencia

    print(f"[INFO] Videos encontrados: {len(videos)}")

    with open(LABELS_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)

        for video_file in videos:
            poomsae, score = parse_filename(video_file)
            if not poomsae:
                print(f"[SKIP] No se pudo parsear: {video_file}")
                continue

            video_path = os.path.join(SAMPLES_DIR, video_file)
            rows = extract_frames(video_path, poomsae, score)
            writer.writerows(rows)

    print(f"\n✅ Dataset generado en: {DATASET_DIR}")
    print(f"📊 Labels CSV: {LABELS_CSV}")

if __name__ == "__main__":
    build_dataset()
import os
import cv2
import mediapipe as mp
import json


def process_video(video_path: str, output_path: str) -> None:
    if not os.path.exists(video_path):
        print(f"[ERROR] No se encontró el video: {video_path}")
        return

    mp_pose = mp.solutions.pose
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print(f"[ERROR] No se pudo abrir el video: {video_path}")
        return

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"[INFO] Video encontrado: {video_path}")
    print(f"[INFO] Total de frames estimados: {total_frames}")

    keypoints_data = []

    with mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as pose:
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)

            frame_keypoints = []

            if results.pose_landmarks:
                for landmark in results.pose_landmarks.landmark:
                    frame_keypoints.append({
                        "x": landmark.x,
                        "y": landmark.y,
                        "z": landmark.z,
                        "visibility": landmark.visibility
                    })

            keypoints_data.append({
                "frame": frame_count,
                "keypoints": frame_keypoints
            })

            frame_count += 1

            if frame_count % 30 == 0:
                print(f"[INFO] Procesados {frame_count}/{total_frames} frames...")

    cap.release()

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(keypoints_data, f, indent=2)

    print(f"[INFO] Proceso terminado.")
    print(f"[INFO] Frames procesados: {frame_count}")
    print(f"[INFO] Keypoints guardados en: {output_path}")


if __name__ == "__main__":
    video_path = "data/samples/video_prueba.mp4"
    output_path = "data/processed/keypoints_prueba.json"
    process_video(video_path, output_path)
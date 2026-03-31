import os
import cv2
import tempfile
import mediapipe as mp
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

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


@router.get("/health")
def health():
    return {"status": "healthy"}


@router.post("/analyze")
async def analyze_video(video: UploadFile = File(...)):
    suffix = os.path.splitext(video.filename or "video.mp4")[-1] or ".mp4"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await video.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = _process_video(tmp_path)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando video: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def _process_video(video_path: str) -> dict:
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

    return {
        "fps":          fps,
        "total_frames": idx,
        "width":        width,
        "height":       height,
        "connections":  [list(c) for c in POSE_CONNECTIONS],
        "frames":       frames_data,
    }
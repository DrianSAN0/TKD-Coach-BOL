import cv2
import mediapipe as mp
import sys

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Cambiá esta ruta al video que quieras visualizar
VIDEO_PATH = r"C:\Users\PC\Videos\7_8.32.mkv"

cap = cv2.VideoCapture(VIDEO_PATH)

with mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(
                    color=(0, 0, 255), thickness=4, circle_radius=4
                ),
                connection_drawing_spec=mp_drawing.DrawingSpec(
                    color=(255, 255, 255), thickness=2
                )
            )

        cv2.imshow('TKD KeyPoints', frame)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
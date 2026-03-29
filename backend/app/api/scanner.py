# backend/app/api/scanner.py

import os
import sys
import json
import shutil
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

# Apunta al módulo ai/ desde la raíz del proyecto
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
AI_SRC = os.path.join(ROOT_DIR, "ai", "src")
sys.path.insert(0, AI_SRC)

from inference.evaluate_video import evaluate_video  # tu script existente

router = APIRouter(prefix="/api/scanner", tags=["scanner"])


@router.post("/analyze")
async def analyze_video(video: UploadFile = File(...)):
    """
    Recibe un video grabado desde el móvil,
    corre MediaPipe + compare_sequences y devuelve el score.
    """
    # Validar extensión
    if not video.filename.endswith((".mp4", ".mov", ".avi")):
        raise HTTPException(status_code=400, detail="Formato de video no soportado")

    # Guardar video en archivo temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        shutil.copyfileobj(video.file, tmp)
        tmp_path = tmp.name

    try:
        # Ruta del video de referencia
        reference_path = os.path.join(ROOT_DIR, "ai", "data", "samples", "video_referencia.mp4")

        # Correr evaluación
        result = evaluate_video(tmp_path, reference_path)

        return JSONResponse(content={
            "success": True,
            "score": result["score"],
            "detalles": result.get("detalles", []),
            "mensaje": result.get("mensaje", "")
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis: {str(e)}")

    finally:
        # Limpiar archivo temporal
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter(prefix="/resultados", tags=["Resultados"])

class ResultadoCreate(BaseModel):
    id_evento: str
    id_atleta: str
    modalidad: str
    categoria: str
    peso: Optional[str] = None
    posicion_final: int
    puntos_ganados: float
    es_ganador: Optional[bool] = False

class ResultadoResponse(BaseModel):
    id_resultado: str
    id_evento: str
    id_atleta: str
    modalidad: str
    categoria: str
    posicion_final: int
    puntos_ganados: float
    es_ganador: bool

@router.post("/", response_model=ResultadoResponse)
def registrar_resultado(data: ResultadoCreate, db: Session = Depends(get_db)):
    query = text("""
        INSERT INTO competencia_resultado
            (id_evento, id_atleta, modalidad, categoria, peso, posicion_final, puntos_ganados, es_ganador)
        VALUES
            (:id_evento::uuid, :id_atleta::uuid, :modalidad, :categoria, :peso, :posicion_final, :puntos_ganados, :es_ganador)
        RETURNING id_resultado::text, id_evento::text, id_atleta::text,
                  modalidad, categoria, posicion_final, puntos_ganados, es_ganador
    """)
    row = db.execute(query, {
        "id_evento":      data.id_evento,
        "id_atleta":      data.id_atleta,
        "modalidad":      data.modalidad,
        "categoria":      data.categoria,
        "peso":           data.peso,
        "posicion_final": data.posicion_final,
        "puntos_ganados": data.puntos_ganados,
        "es_ganador":     data.es_ganador,
    }).fetchone()
    db.commit()
    return ResultadoResponse(
        id_resultado=row.id_resultado,
        id_evento=row.id_evento,
        id_atleta=row.id_atleta,
        modalidad=row.modalidad,
        categoria=row.categoria,
        posicion_final=row.posicion_final,
        puntos_ganados=row.puntos_ganados,
        es_ganador=row.es_ganador,
    )

@router.get("/evento/{id_evento}")
def get_resultados_evento(id_evento: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT
            cr.posicion_final,
            cr.puntos_ganados,
            cr.es_ganador,
            cr.modalidad,
            cr.categoria,
            cr.peso,
            u.nombre,
            u.apellido
        FROM competencia_resultado cr
        JOIN atleta a ON cr.id_atleta = a.id_atleta
        JOIN usuario u ON a.id_usuario = u.id_usuario
        WHERE cr.id_evento = :id_evento::uuid
        ORDER BY cr.posicion_final
    """)
    rows = db.execute(query, {"id_evento": id_evento}).fetchall()
    return [
        {
            "posicion": r.posicion_final,
            "nombre": f"{r.nombre} {r.apellido}",
            "modalidad": r.modalidad,
            "categoria": r.categoria,
            "peso": r.peso,
            "puntos": r.puntos_ganados,
            "ganador": r.es_ganador,
        }
        for r in rows
    ]
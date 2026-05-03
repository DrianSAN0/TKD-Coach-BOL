from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/competidores", tags=["Competidores"])

class CompetidorResponse(BaseModel):
    nombre: str
    apellido: str
    peso: Optional[float]
    edad: Optional[int]
    sexo: Optional[str]
    club: Optional[str]

    class Config:
        from_attributes = True

@router.get("/", response_model=List[CompetidorResponse])
def get_competidores(
    modalidad: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            u.nombre,
            u.apellido,
            a.peso,
            EXTRACT(YEAR FROM AGE(a.fecha_nacimiento))::int AS edad,
            a.sexo,
            c.nombre_club AS club
        FROM atleta a
        JOIN usuario u ON a.id_usuario = u.id_usuario
        LEFT JOIN club c ON a.id_club = c.id_club
        ORDER BY u.apellido
    """)
    rows = db.execute(query).fetchall()
    return [
        CompetidorResponse(
            nombre=r.nombre,
            apellido=r.apellido,
            peso=r.peso,
            edad=r.edad,
            sexo=r.sexo,
            club=r.club,
        )
        for r in rows
    ]
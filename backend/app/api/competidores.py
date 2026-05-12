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
    ciudad: Optional[str]
    categoria: Optional[str]
    departamento: Optional[str]

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
            a.categoria,
            c.nombre_club AS club,
            c.ciudad,
            c.ciudad AS departamento
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
            categoria=r.categoria,
            club=r.club,
            ciudad=r.ciudad,
            departamento=r.ciudad,
        )
        for r in rows
    ]
@router.get("/por-peso")
def get_competidores_por_peso(
    peso: Optional[float] = None,
    sexo: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            a.id_atleta,
            u.nombre,
            u.apellido,
            a.peso,
            a.sexo,
            c.nombre_club AS club,
            c.ciudad
        FROM atleta a
        JOIN usuario u ON a.id_usuario = u.id_usuario
        LEFT JOIN club c ON a.id_club = c.id_club
        WHERE (:peso IS NULL OR a.peso = :peso)
        AND (:sexo IS NULL OR LOWER(a.sexo) = LOWER(:sexo))
        ORDER BY u.apellido
    """)
    rows = db.execute(query, {'peso': peso, 'sexo': sexo}).fetchall()
    return [
        {
            'id_atleta': str(r.id_atleta),
            'nombre': r.nombre,
            'apellido': r.apellido,
            'peso': r.peso,
            'sexo': r.sexo,
            'club': r.club,
            'ciudad': r.ciudad,
        }
        for r in rows
    ]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.models.models import Evento
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime

router = APIRouter(prefix="/eventos", tags=["Eventos"])

class EventoCreate(BaseModel):
    nombre_evento: str
    tipo_evento: Optional[str] = 'competencia'
    fecha_inicio: date
    fecha_fin: Optional[date] = None
    lugar: Optional[str] = None
    descripcion: Optional[str] = None
    estado: Optional[str] = 'programado'

class EventoResponse(BaseModel):
    id_evento: str
    nombre_evento: str
    tipo_evento: Optional[str]
    fecha_inicio: date
    fecha_fin: Optional[date]
    lugar: Optional[str]
    descripcion: Optional[str]
    estado: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[EventoResponse])
def get_eventos(db: Session = Depends(get_db)):
    eventos = db.query(Evento).order_by(Evento.fecha_inicio).all()
    return [
        EventoResponse(
            id_evento=str(e.id_evento),
            nombre_evento=e.nombre_evento,
            tipo_evento=e.tipo_evento,
            fecha_inicio=e.fecha_inicio,
            fecha_fin=e.fecha_fin,
            lugar=e.lugar,
            descripcion=e.descripcion,
            estado=e.estado,
        )
        for e in eventos
    ]

@router.post("/", response_model=EventoResponse)
def create_evento(data: EventoCreate, db: Session = Depends(get_db)):
    nuevo = Evento(
        nombre_evento=data.nombre_evento,
        tipo_evento=data.tipo_evento,
        fecha_inicio=data.fecha_inicio,
        fecha_fin=data.fecha_fin,
        lugar=data.lugar,
        descripcion=data.descripcion,
        estado=data.estado,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return EventoResponse(
        id_evento=str(nuevo.id_evento),
        nombre_evento=nuevo.nombre_evento,
        tipo_evento=nuevo.tipo_evento,
        fecha_inicio=nuevo.fecha_inicio,
        fecha_fin=nuevo.fecha_fin,
        lugar=nuevo.lugar,
        descripcion=nuevo.descripcion,
        estado=nuevo.estado,
    )

@router.put("/{id_evento}/estado")
def update_estado(id_evento: str, estado: str, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id_evento == id_evento).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    evento.estado = estado
    db.commit()
    return {"mensaje": f"Estado actualizado a {estado}"}
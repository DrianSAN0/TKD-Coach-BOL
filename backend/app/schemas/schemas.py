from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime

# ── Competidor / Atleta ────────────────────────────────
class AtletaBase(BaseModel):
    sexo:      Optional[str]
    peso:      Optional[float]
    categoria: Optional[str]

class AtletaResponse(BaseModel):
    id_atleta:  UUID
    nombre:     str
    apellido:   str
    sexo:       Optional[str]
    peso:       Optional[float]
    categoria:  Optional[str]
    club:       Optional[str]
    grado:      Optional[str]

    class Config:
        from_attributes = True

# ── Ranking ────────────────────────────────────────────
class RankingResponse(BaseModel):
    posicion:           int
    nombre:             str
    apellido:           str
    club:               Optional[str]
    categoria:          Optional[str]
    puntaje_acumulado:  float

    class Config:
        from_attributes = True

# ── Evaluacion ─────────────────────────────────────────
class EvaluacionCreate(BaseModel):
    id_atleta:      UUID
    id_poomsae:     UUID
    tipo_evaluacion: str
    puntaje_total:  float
    resultado:      Optional[str] = 'pendiente'
    observaciones:  Optional[str]

class EvaluacionResponse(BaseModel):
    id_evaluacion:   UUID
    puntaje_total:   float
    resultado:       str
    fecha_evaluacion: date
    tipo_evaluacion: str

    class Config:
        from_attributes = True

# ── Evento ─────────────────────────────────────────────
class EventoResponse(BaseModel):
    id_evento:    UUID
    nombre_evento: str
    tipo_evento:  Optional[str]
    fecha_inicio: date
    fecha_fin:    Optional[date]
    lugar:        Optional[str]
    descripcion:  Optional[str]
    estado:       str

    class Config:
        from_attributes = True

# ── Poomsae ────────────────────────────────────────────
class PoomsaeResponse(BaseModel):
    id_poomsae:  UUID
    nombre:      str
    nivel:       Optional[int]
    descripcion: Optional[str]

    class Config:
        from_attributes = True
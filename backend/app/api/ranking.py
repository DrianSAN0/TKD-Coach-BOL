from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.models.models import Ranking, Atleta, Usuario, Club
from app.schemas.schemas import RankingResponse
from typing import List, Optional

router = APIRouter(prefix="/ranking", tags=["Ranking"])

@router.get("/", response_model=List[RankingResponse])
def get_ranking(
    categoria: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(
        Ranking.posicion,
        Usuario.nombre,
        Usuario.apellido,
        Club.nombre_club,
        Atleta.categoria,
        Ranking.puntaje_acumulado
    ).join(Atleta, Ranking.id_atleta == Atleta.id_atleta)\
     .join(Usuario, Atleta.id_usuario == Usuario.id_usuario)\
     .outerjoin(Club, Atleta.id_club == Club.id_club)

    if categoria:
        query = query.filter(Ranking.categoria == categoria)

    resultados = query.order_by(Ranking.posicion).all()

    return [
        RankingResponse(
            posicion=r.posicion,
            nombre=r.nombre,
            apellido=r.apellido,
            club=r.nombre_club,
            categoria=r.categoria,
            puntaje_acumulado=r.puntaje_acumulado
        )
        for r in resultados
    ]

@router.get("/poomsae")
def get_poomsae_list(db: Session = Depends(get_db)):
    from app.models.models import Poomsae
    poomsaes = db.query(Poomsae).order_by(Poomsae.nivel).all()
    return [{"id": str(p.id_poomsae), "nombre": p.nombre, "nivel": p.nivel} for p in poomsaes]
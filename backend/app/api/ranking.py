from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.models.models import Ranking, Atleta, Usuario, Club
from typing import List, Optional

router = APIRouter(prefix="/ranking", tags=["Ranking"])

@router.get("/")
def get_ranking(
    categoria: Optional[str] = None,
    modalidad: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if modalidad == 'Pareja':
        sql = text("""
            SELECT
                r.posicion,
                am.nombre || ' ' || am.apellido as nombre,
                af.nombre || ' ' || af.apellido as nombre_pareja,
                c.nombre_club as club,
                c.ciudad,
                r.categoria,
                r.puntaje_acumulado
            FROM pareja p
            JOIN atleta am ON p.id_atleta_masculino = am.id_atleta
            JOIN atleta af ON p.id_atleta_femenino = af.id_atleta
            LEFT JOIN club c ON p.id_club = c.id_club
            LEFT JOIN ranking r ON r.id_atleta = am.id_atleta
            WHERE (:categoria IS NULL OR r.categoria = :categoria)
            ORDER BY r.posicion
        """)
        resultados = db.execute(sql, {'categoria': categoria}).fetchall()
        return [
            {
                'posicion': r.posicion,
                'nombre': r.nombre,
                'apellido': '',
                'nombre_pareja': r.nombre_pareja,
                'club': r.club,
                'ciudad': r.ciudad,
                'categoria': r.categoria,
                'puntaje_acumulado': r.puntaje_acumulado,
            }
            for r in resultados
        ]

    # Individual
    sql = text("""
        SELECT
            r.posicion,
            a.nombre,
            a.apellido,
            c.nombre_club as club,
            c.ciudad,
            a.categoria,
            r.puntaje_acumulado
        FROM ranking r
        JOIN atleta a ON r.id_atleta = a.id_atleta
        LEFT JOIN club c ON a.id_club = c.id_club
        WHERE (:categoria IS NULL OR r.categoria = :categoria)
        ORDER BY r.posicion
    """)
    resultados = db.execute(sql, {'categoria': categoria}).fetchall()
    return [
        {
            'posicion': r.posicion,
            'nombre': r.nombre,
            'apellido': r.apellido,
            'nombre_pareja': None,
            'club': r.club,
            'ciudad': r.ciudad,
            'categoria': r.categoria,
            'puntaje_acumulado': r.puntaje_acumulado,
        }
        for r in resultados
    ]

@router.get("/poomsae")
def get_poomsae_list(db: Session = Depends(get_db)):
    from app.models.models import Poomsae
    poomsaes = db.query(Poomsae).order_by(Poomsae.nivel).all()
    return [{"id": str(p.id_poomsae), "nombre": p.nombre, "nivel": p.nivel} for p in poomsaes]
@router.post("/actualizar")
def actualizar_ranking(data: dict, db: Session = Depends(get_db)):
    try:
        # +3 al primero
        db.execute(text("""
            UPDATE ranking SET puntaje_acumulado = puntaje_acumulado + 3
            WHERE id_atleta = :id AND categoria = :cat
        """), {'id': data['primero'], 'cat': data['categoria']})

        # +2 al segundo
        db.execute(text("""
            UPDATE ranking SET puntaje_acumulado = puntaje_acumulado + 2
            WHERE id_atleta = :id AND categoria = :cat
        """), {'id': data['segundo'], 'cat': data['categoria']})

        # +1 a los terceros
        for tercero in data.get('terceros', []):
            db.execute(text("""
                UPDATE ranking SET puntaje_acumulado = puntaje_acumulado + 1
                WHERE id_atleta = :id AND categoria = :cat
            """), {'id': tercero, 'cat': data['categoria']})

        db.commit()
        return {"mensaje": "Ranking actualizado correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
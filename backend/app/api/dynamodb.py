from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

router = APIRouter(prefix="/dynamodb", tags=["DynamoDB - Ranking Tiempo Real"])

# Conectar a DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
tabla = dynamodb.Table('tkd-ranking-tiempo-real')

class RankingItem(BaseModel):
    id_atleta: str
    categoria: str
    nombre: str
    apellido: str
    puntaje: float
    posicion: Optional[int] = 0
    modalidad: Optional[str] = 'kyorugi'

@router.post("/ranking")
def agregar_ranking(item: RankingItem):
    try:
        tabla.put_item(Item={
            'id_atleta':  item.id_atleta,
            'categoria':  item.categoria,
            'nombre':     item.nombre,
            'apellido':   item.apellido,
            'puntaje':    str(item.puntaje),
            'posicion':   item.posicion,
            'modalidad':  item.modalidad,
            'updated_at': datetime.utcnow().isoformat(),
        })
        return {"mensaje": "Ranking actualizado en DynamoDB", "atleta": f"{item.nombre} {item.apellido}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ranking/{categoria}")
def get_ranking_categoria(categoria: str):
    try:
        response = tabla.query(
            IndexName='categoria-index',
            KeyConditionExpression=Key('categoria').eq(categoria)
        )
        items = sorted(response['Items'], key=lambda x: float(x['puntaje']), reverse=True)
        for i, item in enumerate(items):
            item['posicion'] = i + 1
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ranking")
def get_todo_ranking():
    try:
        response = tabla.scan()
        items = sorted(response['Items'], key=lambda x: float(x['puntaje']), reverse=True)
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/ranking/{id_atleta}/{categoria}/puntaje")
def actualizar_puntaje(id_atleta: str, categoria: str, puntaje: float):
    try:
        tabla.update_item(
            Key={'id_atleta': id_atleta, 'categoria': categoria},
            UpdateExpression='SET puntaje = :p, updated_at = :u',
            ExpressionAttributeValues={
                ':p': str(puntaje),
                ':u': datetime.utcnow().isoformat(),
            }
        )
        return {"mensaje": "Puntaje actualizado en tiempo real"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
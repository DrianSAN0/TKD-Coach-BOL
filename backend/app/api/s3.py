from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import boto3
from botocore.exceptions import ClientError
import uuid
from datetime import datetime

router = APIRouter(prefix="/s3", tags=["S3 - Almacenamiento de Videos"])

s3_client = boto3.client('s3', region_name='us-east-2')
BUCKET_NAME = 'tkd-coach-bol-videos'

class VideoUploadResponse(BaseModel):
    url: str
    key: str
    mensaje: str

@router.post("/upload-video", response_model=VideoUploadResponse)
async def upload_video(
    video: UploadFile = File(...),
    id_atleta: Optional[str] = None,
    poomsae: Optional[str] = None
):
    try:
        extension = video.filename.split('.')[-1] if '.' in video.filename else 'mp4'
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        key = f"videos/{id_atleta or 'unknown'}/{timestamp}_{poomsae or 'poomsae'}.{extension}"

        contenido = await video.read()
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=key,
            Body=contenido,
            ContentType=video.content_type or 'video/mp4',
        )

        url = f"https://{BUCKET_NAME}.s3.us-east-2.amazonaws.com/{key}"

        return VideoUploadResponse(
            url=url,
            key=key,
            mensaje="Video subido correctamente a S3"
        )
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/video-url/{key:path}")
def get_presigned_url(key: str, expiracion: int = 3600):
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': key},
            ExpiresIn=expiracion
        )
        return {"url": url, "expira_en": f"{expiracion} segundos"}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/videos/{id_atleta}")
def listar_videos_atleta(id_atleta: str):
    try:
        response = s3_client.list_objects_v2(
            Bucket=BUCKET_NAME,
            Prefix=f"videos/{id_atleta}/"
        )
        videos = []
        for obj in response.get('Contents', []):
            url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': obj['Key']},
                ExpiresIn=3600
            )
            videos.append({
                'key': obj['Key'],
                'url': url,
                'tamanio': obj['Size'],
                'fecha': obj['LastModified'].isoformat(),
            })
        return {"videos": videos, "total": len(videos)}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
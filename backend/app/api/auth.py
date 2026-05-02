from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Usuario
from pydantic import BaseModel
import hashlib

router = APIRouter(prefix="/auth", tags=["Auth"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class LoginRequest(BaseModel):
    correo: str
    contrasena: str

class RegisterRequest(BaseModel):
    nombre: str
    apellido: str
    correo: str
    contrasena: str

class AuthResponse(BaseModel):
    id_usuario: str
    nombre: str
    apellido: str
    correo: str
    rol: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo == data.correo).first()
    if not user:
        raise HTTPException(status_code=401, detail="Correo no encontrado")
    if user.contrasena_hash != hash_password(data.contrasena):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return {
        "id_usuario": str(user.id_usuario),
        "nombre": user.nombre,
        "apellido": user.apellido,
        "correo": user.correo,
        "rol": user.rol,
    }

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(Usuario).filter(Usuario.correo == data.correo).first()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    nuevo = Usuario(
        nombre=data.nombre,
        apellido=data.apellido,
        correo=data.correo,
        contrasena_hash=hash_password(data.contrasena),
        rol="atleta",
        estado="activo",
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"mensaje": "Cuenta creada exitosamente", "correo": nuevo.correo}
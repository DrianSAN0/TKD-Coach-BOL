from sqlalchemy import Column, String, Float, Integer, Date, Time, Text, TIMESTAMP, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Usuario(Base):
    __tablename__ = "usuario"
    id_usuario      = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre          = Column(String(100), nullable=False)
    apellido        = Column(String(100), nullable=False)
    correo          = Column(String(150), unique=True, nullable=False)
    contrasena_hash = Column(String(255), nullable=False)
    rol             = Column(String(20), nullable=False)
    estado          = Column(String(20), default='activo')
    created_at      = Column(TIMESTAMP, server_default=func.now())
    atleta          = relationship("Atleta", back_populates="usuario", uselist=False)
    entrenador      = relationship("Entrenador", back_populates="usuario", uselist=False)

class Club(Base):
    __tablename__ = "club"
    id_club     = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre_club = Column(String(150), nullable=False)
    ciudad      = Column(String(100))
    created_at  = Column(TIMESTAMP, server_default=func.now())
    atletas     = relationship("Atleta", back_populates="club")
    entrenadores= relationship("Entrenador", back_populates="club")

class Grado(Base):
    __tablename__ = "grado"
    id_grado        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre_grado    = Column(String(100), nullable=False)
    color_cinturon  = Column(String(50))
    nivel           = Column(Integer, nullable=False)
    atletas         = relationship("Atleta", back_populates="grado")

class Atleta(Base):
    __tablename__ = "atleta"
    id_atleta       = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_usuario      = Column(UUID(as_uuid=True), ForeignKey("usuario.id_usuario"), nullable=False)
    fecha_nacimiento= Column(Date)
    sexo            = Column(String(10))
    peso            = Column(Float)
    categoria       = Column(String(50))
    id_club         = Column(UUID(as_uuid=True), ForeignKey("club.id_club"))
    grado_actual_id = Column(UUID(as_uuid=True), ForeignKey("grado.id_grado"))
    created_at      = Column(TIMESTAMP, server_default=func.now())
    usuario         = relationship("Usuario", back_populates="atleta")
    club            = relationship("Club", back_populates="atletas")
    grado           = relationship("Grado", back_populates="atletas")
    evaluaciones    = relationship("Evaluacion", back_populates="atleta")
    rankings        = relationship("Ranking", back_populates="atleta")

class Entrenador(Base):
    __tablename__ = "entrenador"
    id_entrenador   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_usuario      = Column(UUID(as_uuid=True), ForeignKey("usuario.id_usuario"), nullable=False)
    id_club         = Column(UUID(as_uuid=True), ForeignKey("club.id_club"))
    especialidad    = Column(String(150))
    certificacion   = Column(String(150))
    created_at      = Column(TIMESTAMP, server_default=func.now())
    usuario         = relationship("Usuario", back_populates="entrenador")
    club            = relationship("Club", back_populates="entrenadores")

class Poomsae(Base):
    __tablename__ = "poomsae"
    id_poomsae  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre      = Column(String(100), nullable=False)
    nivel       = Column(Integer)
    descripcion = Column(Text)
    evaluaciones= relationship("Evaluacion", back_populates="poomsae")

class Evaluacion(Base):
    __tablename__ = "evaluacion"
    id_evaluacion   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_atleta       = Column(UUID(as_uuid=True), ForeignKey("atleta.id_atleta"), nullable=False)
    id_poomsae      = Column(UUID(as_uuid=True), ForeignKey("poomsae.id_poomsae"), nullable=False)
    fecha_evaluacion= Column(Date, server_default=func.current_date())
    tipo_evaluacion = Column(String(20))
    puntaje_total   = Column(Float)
    resultado       = Column(String(20), default='pendiente')
    observaciones   = Column(Text)
    created_at      = Column(TIMESTAMP, server_default=func.now())
    atleta          = relationship("Atleta", back_populates="evaluaciones")
    poomsae         = relationship("Poomsae", back_populates="evaluaciones")
    detalles        = relationship("DetalleEvaluacion", back_populates="evaluacion")
    archivos        = relationship("ArchivoAnalisis", back_populates="evaluacion")

class DetalleEvaluacion(Base):
    __tablename__ = "detalle_evaluacion"
    id_detalle      = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_evaluacion   = Column(UUID(as_uuid=True), ForeignKey("evaluacion.id_evaluacion"), nullable=False)
    criterio        = Column(String(100), nullable=False)
    puntaje         = Column(Float)
    observacion     = Column(Text)
    evaluacion      = relationship("Evaluacion", back_populates="detalles")

class ArchivoAnalisis(Base):
    __tablename__ = "archivo_analisis"
    id_archivo      = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_evaluacion   = Column(UUID(as_uuid=True), ForeignKey("evaluacion.id_evaluacion"), nullable=False)
    url_archivo     = Column(String(255))
    modelo_usado    = Column(String(100))
    fecha_subida    = Column(TIMESTAMP, server_default=func.now())
    evaluacion      = relationship("Evaluacion", back_populates="archivos")

class Evento(Base):
    __tablename__ = "evento"
    id_evento       = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre_evento   = Column(String(150), nullable=False)
    tipo_evento     = Column(String(30))
    fecha_inicio    = Column(Date, nullable=False)
    fecha_fin       = Column(Date)
    lugar           = Column(String(200))
    descripcion     = Column(Text)
    estado          = Column(String(20), default='programado')
    created_at      = Column(TIMESTAMP, server_default=func.now())

class Ranking(Base):
    __tablename__ = "ranking"
    id_ranking          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_atleta           = Column(UUID(as_uuid=True), ForeignKey("atleta.id_atleta"), nullable=False)
    categoria           = Column(String(50))
    puntaje_acumulado   = Column(Float, default=0)
    posicion            = Column(Integer)
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now())
    atleta              = relationship("Atleta", back_populates="rankings")
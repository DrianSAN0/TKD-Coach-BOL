from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import scanner
from app.api import ranking
from app.api import auth
from app.api import competidores
from app.core.database import engine
from app.models import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TKD Coach BO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scanner.router)
app.include_router(ranking.router)
app.include_router(auth.router)
app.include_router(competidores.router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"status": "TKD Coach BO API running"}
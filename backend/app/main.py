from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import scanner  # ← agrega esta línea

app = FastAPI(title="TKD Coach BO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scanner.router)  # ← agrega esta línea

@app.get("/")
def root():
    return {"status": "TKD Coach BO API running"}
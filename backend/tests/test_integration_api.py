import sys
import os
import uuid

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app.core.database import SessionLocal
from sqlalchemy import text


@pytest.fixture()
def correo_prueba():
    correo = f"pytest_{uuid.uuid4().hex[:10]}@test.local"
    yield correo
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM usuario WHERE correo = :correo"), {"correo": correo})
        db.commit()
    finally:
        db.close()


class TestHealth:
    def test_health_ok(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] in ("healthy", "ok")


class TestFlujoAutenticacion:
    def test_registro_exitoso(self, client, correo_prueba):
        resp = client.post("/auth/register", json={
            "nombre": "Pytest",
            "apellido": "Tester",
            "correo": correo_prueba,
            "contrasena": "clave_segura_123",
        })
        assert resp.status_code == 200
        body = resp.json()
        assert body["correo"] == correo_prueba
        assert "exitosamente" in body["mensaje"]

    def test_registro_duplicado_es_rechazado(self, client, correo_prueba):
        payload = {
            "nombre": "Pytest",
            "apellido": "Tester",
            "correo": correo_prueba,
            "contrasena": "clave_segura_123",
        }
        primero = client.post("/auth/register", json=payload)
        segundo = client.post("/auth/register", json=payload)
        assert primero.status_code == 200
        assert segundo.status_code == 400
        assert "ya est" in segundo.json()["detail"]

    def test_login_exitoso(self, client, correo_prueba):
        client.post("/auth/register", json={
            "nombre": "Pytest",
            "apellido": "Tester",
            "correo": correo_prueba,
            "contrasena": "clave_segura_123",
        })
        resp = client.post("/auth/login", json={
            "correo": correo_prueba,
            "contrasena": "clave_segura_123",
        })
        assert resp.status_code == 200
        body = resp.json()
        assert body["correo"] == correo_prueba
        assert body["rol"] == "atleta"

    def test_login_password_incorrecta(self, client, correo_prueba):
        client.post("/auth/register", json={
            "nombre": "Pytest",
            "apellido": "Tester",
            "correo": correo_prueba,
            "contrasena": "clave_segura_123",
        })
        resp = client.post("/auth/login", json={
            "correo": correo_prueba,
            "contrasena": "clave_incorrecta",
        })
        assert resp.status_code == 401

    def test_login_correo_inexistente(self, client):
        resp = client.post("/auth/login", json={
            "correo": f"no_existe_{uuid.uuid4().hex[:8]}@test.local",
            "contrasena": "cualquiera",
        })
        assert resp.status_code == 401
        assert "no encontrado" in resp.json()["detail"]


class TestCompetidoresYRanking:
    def test_lista_competidores(self, client):
        resp = client.get("/competidores/")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "nombre" in data[0] and "apellido" in data[0]

    def test_competidores_por_peso(self, client):
        resp = client.get("/competidores/por-peso")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_ranking_individual(self, client):
        resp = client.get("/ranking/")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        if data:
            assert "posicion" in data[0] and "nombre" in data[0]

    def test_ranking_pareja(self, client):
        resp = client.get("/ranking/?modalidad=Pareja")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_ranking_poomsae(self, client):
        resp = client.get("/ranking/poomsae")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "nombre" in data[0]

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.api.auth import hash_password
from app.api.scanner import _calcular_score, modelo, encoder


class TestHashPassword:
    def test_is_deterministic(self):
        assert hash_password("clave123") == hash_password("clave123")

    def test_different_inputs_produce_different_hashes(self):
        assert hash_password("clave123") != hash_password("clave124")

    def test_output_is_64_char_hex_sha256(self):
        digest = hash_password("clave123")
        assert len(digest) == 64
        int(digest, 16)  # lanza ValueError si no es hexadecimal valido

    def test_empty_password_does_not_crash(self):
        digest = hash_password("")
        assert len(digest) == 64


class TestCalcularScore:
    def test_modelo_esta_disponible(self):
        # Regresion: ROOT_DIR en scanner.py subia un nivel de mas y el
        # modelo entrenado nunca se cargaba (siempre caia al fallback
        # de "Modelo no disponible", score fijo 7.0). Corregido.
        assert modelo is not None, "El modelo entrenado no se cargo — revisar ROOT_DIR en scanner.py"
        assert encoder is not None, "El encoder no se cargo — revisar ROOT_DIR en scanner.py"

    def test_sin_frames_devuelve_score_neutro(self):
        resultado = _calcular_score([], "Koryo")
        assert resultado["score"] == 5.0
        assert resultado["detalles"] == []
        assert "No se detect" in resultado["mensaje"]

    def test_frame_sin_keypoints_es_ignorado(self):
        frames = [{"frame": 0, "keypoints": []}]
        resultado = _calcular_score(frames, "Koryo")
        assert resultado["score"] == 5.0

    def _frame_valido(self, idx):
        return {
            "frame": idx,
            "keypoints": [
                {"x": 0.5, "y": 0.5, "z": 0.0, "visibility": 0.9}
                for _ in range(33)
            ],
        }

    def test_frames_validos_devuelven_score_en_rango(self):
        if modelo is None or encoder is None:
            import pytest
            pytest.skip("Modelo no disponible en este entorno")

        frames = [self._frame_valido(i) for i in range(40)]
        resultado = _calcular_score(frames, "Koryo")
        assert 0.0 <= resultado["score"] <= 10.0
        assert len(resultado["detalles"]) == 4
        nombres_segmento = [d["segmento"] for d in resultado["detalles"]]
        assert nombres_segmento == ["Inicio", "Desarrollo 1", "Desarrollo 2", "Cierre"]
        assert resultado["mensaje"] != ""

    def test_poomsae_desconocido_usa_fallback_sin_crashear(self):
        if modelo is None or encoder is None:
            import pytest
            pytest.skip("Modelo no disponible en este entorno")

        frames = [self._frame_valido(i) for i in range(10)]
        resultado = _calcular_score(frames, "Poomsae_Que_No_Existe")
        assert 0.0 <= resultado["score"] <= 10.0

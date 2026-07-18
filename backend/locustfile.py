"""
Pruebas de rendimiento — TKD Coach BOL API
Uso:
  locust -f locustfile.py --host=http://127.0.0.1:8123 --headless \
         -u <usuarios> -r <spawn-rate> -t <duracion> --csv=resultados/nombre
"""
from locust import HttpUser, task, between


class TkdApiUser(HttpUser):
    wait_time = between(0.5, 2.0)

    @task(3)
    def listar_competidores(self):
        self.client.get("/competidores/", name="/competidores/")

    @task(3)
    def ver_ranking(self):
        self.client.get("/ranking/", name="/ranking/")

    @task(1)
    def health(self):
        self.client.get("/health", name="/health")

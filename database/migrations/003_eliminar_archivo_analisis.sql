-- ══════════════════════════════════════════════════════
-- Migración 003 — Eliminar archivo_analisis
-- El video analizado se procesa y se descarta al vuelo
-- (scanner.py borra el archivo temporal tras el análisis);
-- no hay funcionalidad de volver a ver el poomsae grabado,
-- así que no existe nada que esta tabla deba registrar.
-- ══════════════════════════════════════════════════════

DROP TABLE IF EXISTS archivo_analisis;

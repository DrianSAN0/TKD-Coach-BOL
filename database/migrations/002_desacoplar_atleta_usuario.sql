-- ══════════════════════════════════════════════════════
-- Migración 002 — Desacoplar atleta de usuario + eliminar entrenador
-- Un atleta (competidor de ranking/llaves) ya no requiere cuenta
-- de app: pasa a tener identidad propia (nombre, apellido, carnet).
-- id_usuario queda como vínculo opcional, sin auto-asignación.
-- ══════════════════════════════════════════════════════

-- 1. Eliminar tabla entrenador (sin uso en la app)
DROP TABLE IF EXISTS entrenador;

-- 2. atleta gana identidad propia
ALTER TABLE atleta ADD COLUMN IF NOT EXISTS nombre   VARCHAR(100);
ALTER TABLE atleta ADD COLUMN IF NOT EXISTS apellido VARCHAR(100);

UPDATE atleta a SET nombre = u.nombre, apellido = u.apellido
FROM usuario u
WHERE a.id_usuario = u.id_usuario
  AND a.nombre IS NULL;

ALTER TABLE atleta ALTER COLUMN nombre   SET NOT NULL;
ALTER TABLE atleta ALTER COLUMN apellido SET NOT NULL;
ALTER TABLE atleta ALTER COLUMN carnet   SET NOT NULL;

ALTER TABLE atleta ALTER COLUMN id_usuario DROP NOT NULL;
-- Nota: no se agrega UNIQUE(id_usuario) — datos de seed existentes tienen
-- 5 cuentas de usuario vinculadas a 2 filas de atleta cada una, y nada del
-- diseño actual depende de esa unicidad (no hay auto-vinculación por carnet).

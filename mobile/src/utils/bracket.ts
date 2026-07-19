// Lógica pura de llaves de competencia (bracket), extraída de LlaveCompetenciaScreen
// para poder probarla sin renderizar UI.

export type Competidor = {
  id_atleta: string;
  nombre: string;
  apellido: string;
  club: string | null;
  ciudad: string | null;
} | null;

export type Partido = { izq: Competidor; der: Competidor; ganador: Competidor };

/** Menor potencia de 2 mayor o igual a n. nextPow2(0) = 1. */
export function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/**
 * Construye la primera ronda + rondas vacías subsiguientes a partir de una
 * lista de competidores. Rellena con BYE (null) hasta la siguiente potencia
 * de 2. Un enfrentamiento contra BYE se resuelve automáticamente.
 */
export function crearBracket(comps: Competidor[]): Partido[][] {
  if (comps.length === 0) return [];

  const size = nextPow2(comps.length);
  const seeds: Competidor[] = [...comps, ...Array(size - comps.length).fill(null)];
  const partidos: Partido[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const izq = seeds[i];
    // seeds[i + 1] puede ser undefined (no null) cuando comps.length === 1,
    // el único caso en que nextPow2 no agrega BYEs (size === comps.length,
    // con seeds de longitud impar). Se normaliza a null para que el mismo
    // camino de "enfrentamiento contra BYE" se aplique también aquí.
    const der = seeds[i + 1] ?? null;
    const ganador = der === null ? izq : izq === null ? der : null;
    partidos.push({ izq, der, ganador });
  }

  const todasRondas: Partido[][] = [partidos];
  let n = partidos.length;
  while (n > 1) {
    n = Math.ceil(n / 2);
    todasRondas.push(Array(n).fill(null).map(() => ({ izq: null, der: null, ganador: null })));
  }
  return todasRondas;
}

/**
 * Aplica la selección de un ganador en rondas[rondaIdx][partidoIdx] y
 * propaga ese ganador a la ronda siguiente. Devuelve un nuevo array de
 * rondas (no muta el original).
 */
export function seleccionarGanador(
  rondas: Partido[][],
  rondaIdx: number,
  partidoIdx: number,
  ganador: Competidor
): Partido[][] {
  const nr = rondas.map(r => r.map(p => ({ ...p })));
  nr[rondaIdx][partidoIdx].ganador = ganador;
  if (rondaIdx + 1 < nr.length) {
    const sig = Math.floor(partidoIdx / 2);
    if (partidoIdx % 2 === 0) nr[rondaIdx + 1][sig].izq = ganador;
    else nr[rondaIdx + 1][sig].der = ganador;
    nr[rondaIdx + 1][sig].ganador = null;
  }
  return nr;
}

/** Etiqueta de una ronda según su distancia a la final. */
export function getRondaLabel(idx: number, total: number): string {
  const fromEnd = total - 1 - idx;
  if (fromEnd === 0) return 'Final';
  if (fromEnd === 1) return 'Semifinal';
  if (fromEnd === 2) return 'Cuartos';
  if (fromEnd === 3) return 'Octavos';
  return `Ronda ${idx + 1}`;
}

export type Podio = { campeon: Competidor; subcampeon: Competidor; terceros: NonNullable<Competidor>[] };

/** Deriva campeón, subcampeón y terceros (perdedores de semifinal) de las rondas actuales. */
export function calcularPodio(rondas: Partido[][]): Podio {
  if (rondas.length === 0) return { campeon: null, subcampeon: null, terceros: [] };

  const final = rondas[rondas.length - 1]?.[0];
  const campeon = final?.ganador ?? null;
  const subcampeon = final
    ? (final.izq === campeon ? final.der : final.izq)
    : null;

  const terceros = rondas.length >= 2
    ? rondas[rondas.length - 2]
        .map(p => (p.ganador === p.izq ? p.der : p.ganador === p.der ? p.izq : null))
        .filter((c): c is NonNullable<Competidor> => c !== null)
    : [];

  return { campeon, subcampeon, terceros };
}

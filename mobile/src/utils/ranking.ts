// Lógica pura de la tabla de ranking, extraída de RankingTablaScreen.

import { colors } from '../theme/colors';

/** Color de medalla según la posición en el ranking (oro/plata/bronce/resto). */
export function medalColor(pos: number): string {
  if (pos === 1) return '#FFD700';
  if (pos === 2) return '#C0C0C0';
  if (pos === 3) return '#CD7F32';
  return colors.textSecondary;
}

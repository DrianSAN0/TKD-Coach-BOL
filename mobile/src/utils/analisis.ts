// Lógica pura de interpretación de resultados de análisis de video,
// extraída de DetalleAnalisisScreen y ResultadosScreen.

const RED = '#E93735';
const TEAL = '#5BBEBB';

export type DetalleSegmento = { segmento: string; puntuacion: number; observacion?: string };

/** Color del score en la vista de detalle (4 niveles: excelente/bien/aceptable/a mejorar). */
export function getScoreColorDetalle(score: number): string {
  if (score >= 8.5) return '#4ADE80';
  if (score >= 7.0) return '#F0C040';
  if (score >= 5.0) return '#FB923C';
  return RED;
}

/** Color del score en la vista de resultados/historial (3 niveles). */
export function getScoreColorResultado(score: number): string {
  if (score >= 8.5) return TEAL;
  if (score >= 7) return '#F0C040';
  return RED;
}

/** Icono según la observación textual de un segmento. */
export function getIcon(obs: string): string {
  if (obs === 'Excelente') return 'checkmark-circle';
  if (obs === 'Bien') return 'checkmark-circle-outline';
  if (obs === 'Aceptable') return 'warning-outline';
  return 'close-circle';
}

export type Deducciones = { deducciones: DetalleSegmento[]; puntosDescontados: number };

/**
 * Calcula qué segmentos quedaron por debajo del umbral (7.0) y cuántos
 * puntos se descontaron en total (0.3 por cada punto bajo el umbral).
 */
export function calcularDeducciones(detalles: DetalleSegmento[]): Deducciones {
  const deducciones = detalles.filter(d => d.puntuacion < 7.0);
  const puntosDescontados = detalles.reduce((acc, d) => {
    return acc + (d.puntuacion < 7.0 ? (7.0 - d.puntuacion) * 0.3 : 0);
  }, 0);
  return { deducciones, puntosDescontados };
}

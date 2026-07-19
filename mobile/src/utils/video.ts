// Lógica pura de reproducción/estadísticas de video, extraída de AnalysisScreen.

export type FrameData = { keypoints: { visibility: number }[] };

/** Convierte la posición de reproducción (ms) al índice de frame correspondiente, acotado al último frame. */
export function calcularFrameActual(posMs: number, fps: number, totalFrames: number): number {
  const frameNum = Math.floor((posMs / 1000) * fps);
  return Math.min(Math.max(frameNum, 0), Math.max(totalFrames - 1, 0));
}

/** Porcentaje de frames con al menos un keypoint detectado. */
export function calcularTasaDeteccion(frames: FrameData[]): number {
  if (frames.length === 0) return 0;
  const detectados = frames.filter(f => f.keypoints.length > 0).length;
  return Math.round((detectados / frames.length) * 100);
}

/**
 * Calcula el tamaño de despliegue del video manteniendo el aspect ratio,
 * acotado al ancho de pantalla y a una altura máxima de área de video.
 */
export function calcularDisplaySize(
  videoW: number,
  videoH: number,
  screenW: number,
  maxAreaH: number
): { width: number; height: number } {
  const safeW = videoW || 1;
  const safeH = videoH || 1;
  const aspectRatio = safeW / safeH;
  let displayW = screenW;
  let displayH = screenW / aspectRatio;
  if (displayH > maxAreaH) {
    displayH = maxAreaH;
    displayW = maxAreaH * aspectRatio;
  }
  return { width: displayW, height: displayH };
}

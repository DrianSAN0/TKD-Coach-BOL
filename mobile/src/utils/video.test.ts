import { calcularFrameActual, calcularTasaDeteccion, calcularDisplaySize } from './video';

describe('calcularFrameActual', () => {
  it('convierte milisegundos a número de frame según el fps', () => {
    // 1000ms a 30fps -> frame 30
    expect(calcularFrameActual(1000, 30, 300)).toBe(30);
  });
  it('en la posición 0 devuelve el frame 0', () => {
    expect(calcularFrameActual(0, 30, 300)).toBe(0);
  });
  it('acota al último frame disponible si la posición excede la duración', () => {
    expect(calcularFrameActual(999999, 30, 300)).toBe(299);
  });
  it('nunca devuelve un índice negativo', () => {
    expect(calcularFrameActual(-500, 30, 300)).toBe(0);
  });
  it('con 0 frames totales no rompe (devuelve 0)', () => {
    expect(calcularFrameActual(500, 30, 0)).toBe(0);
  });
});

describe('calcularTasaDeteccion', () => {
  it('100% cuando todos los frames tienen keypoints', () => {
    const frames = Array.from({ length: 10 }, () => ({ keypoints: [{ visibility: 1 }] }));
    expect(calcularTasaDeteccion(frames)).toBe(100);
  });
  it('0% cuando ningún frame tiene keypoints', () => {
    const frames = Array.from({ length: 10 }, () => ({ keypoints: [] }));
    expect(calcularTasaDeteccion(frames)).toBe(0);
  });
  it('redondea al porcentaje más cercano (real: 98.54% en /analyze del backend)', () => {
    const frames = [
      ...Array.from({ length: 2842 }, () => ({ keypoints: [{ visibility: 1 }] })),
      ...Array.from({ length: 42 }, () => ({ keypoints: [] })),
    ];
    expect(calcularTasaDeteccion(frames)).toBe(99); // 2842/2884 = 98.54% -> redondea a 99
  });
  it('array vacío de frames no rompe (devuelve 0)', () => {
    expect(calcularTasaDeteccion([])).toBe(0);
  });
});

describe('calcularDisplaySize', () => {
  it('un video más ancho que alto se ajusta al ancho de pantalla completo', () => {
    // video 1920x1080 (16:9), pantalla 400 de ancho, área máx 300 de alto
    const r = calcularDisplaySize(1920, 1080, 400, 300);
    // 400 / (16/9) = 225, que es menor que 300 -> no se recorta por altura
    expect(r.width).toBe(400);
    expect(r.height).toBeCloseTo(225);
  });

  it('un video más alto que ancho (vertical) se acota por la altura máxima', () => {
    // video 1080x1920 (9:16), pantalla 400 de ancho, área máx 300 de alto
    const r = calcularDisplaySize(1080, 1920, 400, 300);
    // 400 / (9/16) = 711, excede 300 -> se acota a maxAreaH
    expect(r.height).toBe(300);
    expect(r.width).toBeCloseTo(300 * (1080 / 1920));
  });

  it('con ancho o alto de video en 0 no rompe (usa 1x1 como fallback, aspect ratio cuadrado)', () => {
    const r = calcularDisplaySize(0, 0, 400, 300);
    // fallback a 1x1 (cuadrado): al ancho de pantalla (400) le tocaría alto
    // 400, que excede maxAreaH (300), así que se acota por altura
    expect(r.height).toBe(300);
    expect(r.width).toBe(300);
    expect(Number.isFinite(r.width)).toBe(true);
    expect(Number.isFinite(r.height)).toBe(true);
  });
});

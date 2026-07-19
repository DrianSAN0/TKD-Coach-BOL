import { getScoreColorDetalle, getScoreColorResultado, getIcon, calcularDeducciones } from './analisis';

describe('getScoreColorDetalle', () => {
  it('verde para score excelente (>=8.5)', () => {
    expect(getScoreColorDetalle(8.5)).toBe('#4ADE80');
    expect(getScoreColorDetalle(9.2)).toBe('#4ADE80');
  });
  it('amarillo para score bien (7.0-8.49)', () => {
    expect(getScoreColorDetalle(7.0)).toBe('#F0C040');
    expect(getScoreColorDetalle(8.49)).toBe('#F0C040');
  });
  it('naranja para score aceptable (5.0-6.99)', () => {
    expect(getScoreColorDetalle(5.0)).toBe('#FB923C');
    expect(getScoreColorDetalle(6.99)).toBe('#FB923C');
  });
  it('rojo para score a mejorar (<5.0)', () => {
    expect(getScoreColorDetalle(4.99)).toBe('#E93735');
    expect(getScoreColorDetalle(0)).toBe('#E93735');
  });
});

describe('getScoreColorResultado', () => {
  it('teal para score >=8.5', () => {
    expect(getScoreColorResultado(8.5)).toBe('#5BBEBB');
  });
  it('amarillo para score entre 7 y 8.49', () => {
    expect(getScoreColorResultado(7)).toBe('#F0C040');
    expect(getScoreColorResultado(8.49)).toBe('#F0C040');
  });
  it('rojo para score menor a 7', () => {
    expect(getScoreColorResultado(6.99)).toBe('#E93735');
  });
  it('usa solo 3 niveles, a diferencia de getScoreColorDetalle que usa 4', () => {
    // en 6.0 difieren: detalle da naranja, resultado da rojo
    expect(getScoreColorDetalle(6.0)).toBe('#FB923C');
    expect(getScoreColorResultado(6.0)).toBe('#E93735');
  });
});

describe('getIcon', () => {
  it('mapea cada observación textual a su icono', () => {
    expect(getIcon('Excelente')).toBe('checkmark-circle');
    expect(getIcon('Bien')).toBe('checkmark-circle-outline');
    expect(getIcon('Aceptable')).toBe('warning-outline');
  });
  it('usa el icono de error para cualquier observación no reconocida', () => {
    expect(getIcon('A mejorar')).toBe('close-circle');
    expect(getIcon('')).toBe('close-circle');
    expect(getIcon('algo-inesperado')).toBe('close-circle');
  });
});

describe('calcularDeducciones', () => {
  it('sin segmentos por debajo del umbral, no hay deducción', () => {
    const r = calcularDeducciones([
      { segmento: 'Inicio', puntuacion: 8.7 },
      { segmento: 'Cierre', puntuacion: 9.0 },
    ]);
    expect(r.deducciones).toEqual([]);
    expect(r.puntosDescontados).toBeCloseTo(0);
  });

  it('calcula la deducción proporcional (0.3 por punto bajo 7.0) para segmentos débiles', () => {
    const r = calcularDeducciones([
      { segmento: 'Inicio', puntuacion: 6.0 },     // (7-6)*0.3 = 0.3
      { segmento: 'Desarrollo 1', puntuacion: 5.0 }, // (7-5)*0.3 = 0.6
      { segmento: 'Cierre', puntuacion: 9.0 },      // no deduce
    ]);
    expect(r.deducciones.length).toBe(2);
    expect(r.puntosDescontados).toBeCloseTo(0.9);
  });

  it('un segmento exactamente en 7.0 no cuenta como débil (umbral exclusivo)', () => {
    const r = calcularDeducciones([{ segmento: 'X', puntuacion: 7.0 }]);
    expect(r.deducciones).toEqual([]);
    expect(r.puntosDescontados).toBe(0);
  });

  it('lista vacía de detalles no rompe y no descuenta nada', () => {
    const r = calcularDeducciones([]);
    expect(r.deducciones).toEqual([]);
    expect(r.puntosDescontados).toBe(0);
  });
});

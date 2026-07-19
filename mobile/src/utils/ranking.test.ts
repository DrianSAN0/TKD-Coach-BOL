import { medalColor } from './ranking';
import { colors } from '../theme/colors';

describe('medalColor', () => {
  it('devuelve oro para el 1er puesto', () => {
    expect(medalColor(1)).toBe('#FFD700');
  });
  it('devuelve plata para el 2do puesto', () => {
    expect(medalColor(2)).toBe('#C0C0C0');
  });
  it('devuelve bronce para el 3er puesto', () => {
    expect(medalColor(3)).toBe('#CD7F32');
  });
  it('devuelve el color secundario del tema para el resto de posiciones', () => {
    expect(medalColor(4)).toBe(colors.textSecondary);
    expect(medalColor(15)).toBe(colors.textSecondary);
  });
});

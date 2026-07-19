import { nextPow2, crearBracket, seleccionarGanador, getRondaLabel, calcularPodio, Competidor } from './bracket';

const comp = (id: string): Competidor => ({
  id_atleta: id, nombre: `Nombre${id}`, apellido: `Apellido${id}`, club: null, ciudad: 'La Paz',
});

describe('nextPow2', () => {
  it('devuelve 1 para 0 competidores', () => {
    expect(nextPow2(0)).toBe(1);
  });
  it('devuelve la misma potencia si ya es potencia de 2', () => {
    expect(nextPow2(8)).toBe(8);
  });
  it('redondea hacia arriba a la siguiente potencia de 2', () => {
    expect(nextPow2(5)).toBe(8);
    expect(nextPow2(9)).toBe(16);
    expect(nextPow2(3)).toBe(4);
  });
  it('devuelve 1 para n=1', () => {
    expect(nextPow2(1)).toBe(1);
  });
});

describe('crearBracket', () => {
  it('devuelve array vacío si no hay competidores', () => {
    expect(crearBracket([])).toEqual([]);
  });

  it('con 2 competidores genera una sola ronda (la final)', () => {
    const rondas = crearBracket([comp('A'), comp('B')]);
    expect(rondas.length).toBe(1);
    expect(rondas[0].length).toBe(1);
    expect(rondas[0][0].izq?.id_atleta).toBe('A');
    expect(rondas[0][0].der?.id_atleta).toBe('B');
    expect(rondas[0][0].ganador).toBeNull();
  });

  it('con 3 competidores rellena con BYE y resuelve automáticamente el partido con BYE', () => {
    const rondas = crearBracket([comp('A'), comp('B'), comp('C')]);
    // nextPow2(3) = 4 -> 2 partidos en primera ronda, 1 en la siguiente
    expect(rondas.length).toBe(2);
    expect(rondas[0].length).toBe(2);
    // Partido 1: A vs B, sin ganador automático
    expect(rondas[0][0].ganador).toBeNull();
    // Partido 2: C vs BYE(null) -> gana C automáticamente
    expect(rondas[0][1].izq?.id_atleta).toBe('C');
    expect(rondas[0][1].der).toBeNull();
    expect(rondas[0][1].ganador?.id_atleta).toBe('C');
  });

  it('con 5 competidores genera 3 rondas (8 = siguiente potencia de 2)', () => {
    const rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D'), comp('E')]);
    expect(rondas.map(r => r.length)).toEqual([4, 2, 1]);
  });

  it('con 1 competidor no genera rondas (nextPow2(1)=1, sin rival)', () => {
    const rondas = crearBracket([comp('A')]);
    expect(rondas.length).toBe(1);
    expect(rondas[0][0].ganador?.id_atleta).toBe('A');
  });
});

describe('seleccionarGanador', () => {
  it('marca el ganador del partido y no muta el array original', () => {
    const rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D')]);
    const original = JSON.stringify(rondas);
    const nr = seleccionarGanador(rondas, 0, 0, rondas[0][0].izq);
    expect(JSON.stringify(rondas)).toBe(original); // inmutable
    expect(nr[0][0].ganador?.id_atleta).toBe('A');
  });

  it('propaga el ganador del partido 0 (par) al lado izquierdo de la ronda siguiente', () => {
    const rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D')]);
    const nr = seleccionarGanador(rondas, 0, 0, comp('A'));
    expect(nr[1][0].izq?.id_atleta).toBe('A');
    expect(nr[1][0].der).toBeNull();
  });

  it('propaga el ganador del partido 1 (impar) al lado derecho de la ronda siguiente', () => {
    const rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D')]);
    const nr = seleccionarGanador(rondas, 0, 1, comp('C'));
    expect(nr[1][0].der?.id_atleta).toBe('C');
  });

  it('resetea el ganador de la ronda siguiente al cambiar un ganador previo', () => {
    let rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D')]);
    rondas = seleccionarGanador(rondas, 0, 0, comp('A'));
    rondas = seleccionarGanador(rondas, 0, 1, comp('C'));
    rondas = seleccionarGanador(rondas, 1, 0, comp('A')); // final: gana A
    expect(rondas[1][0].ganador?.id_atleta).toBe('A');
    // Se cambia de opinión en semifinal 1: ahora gana B en vez de A
    rondas = seleccionarGanador(rondas, 0, 0, comp('B'));
    expect(rondas[1][0].izq?.id_atleta).toBe('B');
    expect(rondas[1][0].ganador).toBeNull(); // el resultado de la final se invalida
  });
});

describe('getRondaLabel', () => {
  it('la última ronda siempre es Final', () => {
    expect(getRondaLabel(3, 4)).toBe('Final');
  });
  it('identifica Semifinal, Cuartos y Octavos por distancia al final', () => {
    expect(getRondaLabel(2, 4)).toBe('Semifinal');
    expect(getRondaLabel(1, 4)).toBe('Cuartos');
    expect(getRondaLabel(0, 4)).toBe('Octavos');
  });
  it('rondas más lejanas usan el rótulo genérico "Ronda N"', () => {
    expect(getRondaLabel(0, 5)).toBe('Ronda 1');
  });
});

describe('calcularPodio', () => {
  it('sin rondas no hay podio', () => {
    expect(calcularPodio([])).toEqual({ campeon: null, subcampeon: null, terceros: [] });
  });

  it('deriva campeón, subcampeón y terceros de un bracket de 4 completo', () => {
    let rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D')]);
    // calcularPodio compara por referencia (igual que la pantalla real, que
    // siempre pasa partido.izq/partido.der al seleccionar un ganador), así
    // que hay que reusar las referencias que ya viven dentro del bracket
    // en vez de crear objetos nuevos con el mismo id_atleta.
    const a = rondas[0][0].izq;
    const c = rondas[0][1].izq;
    rondas = seleccionarGanador(rondas, 0, 0, a); // A vence a B
    rondas = seleccionarGanador(rondas, 0, 1, c); // C vence a D
    rondas = seleccionarGanador(rondas, 1, 0, a); // A vence a C en la final

    const podio = calcularPodio(rondas);
    expect(podio.campeon?.id_atleta).toBe('A');
    expect(podio.subcampeon?.id_atleta).toBe('C');
    expect(podio.terceros.map(t => t.id_atleta).sort()).toEqual(['B', 'D']);
  });

  it('con objetos "iguales" por id pero de distinta referencia, NO reconoce el subcampeón (limitación conocida)', () => {
    // Documenta el comportamiento real de calcularPodio: usa === (referencia),
    // no compara por id_atleta. Si el ganador pasado no es la misma
    // instancia que quedó guardada en el partido, el cálculo de subcampeón
    // falla silenciosamente. En la app real esto no ocurre porque el ganador
    // siempre se pasa como partido.izq/partido.der (misma referencia).
    let rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D')]);
    rondas = seleccionarGanador(rondas, 0, 0, comp('A')); // objeto distinto, mismo id
    rondas = seleccionarGanador(rondas, 0, 1, comp('C'));
    rondas = seleccionarGanador(rondas, 1, 0, comp('A')); // otro objeto distinto

    const podio = calcularPodio(rondas);
    expect(podio.campeon?.id_atleta).toBe('A');
    // subcampeon debería ser 'C', pero la comparación por referencia falla:
    expect(podio.subcampeon?.id_atleta).not.toBe('C');
  });

  it('sin ganador de la final aún, no hay campeón', () => {
    const rondas = crearBracket([comp('A'), comp('B'), comp('C'), comp('D')]);
    const podio = calcularPodio(rondas);
    expect(podio.campeon).toBeNull();
  });

  it('si alguna semifinal ya tiene a sus dos participantes pero aún no ganador, no aparece como tercer lugar', () => {
    // Bracket de 8: ronda 0 = cuartos, ronda 1 = semifinal, ronda 2 = final.
    const rondas = crearBracket([
      comp('A'), comp('B'), comp('C'), comp('D'),
      comp('E'), comp('F'), comp('G'), comp('H'),
    ]);
    const a = rondas[0][0].izq, c = rondas[0][1].izq;
    const e = rondas[0][2].izq, g = rondas[0][3].izq;
    let r = seleccionarGanador(rondas, 0, 0, a); // A vence a B -> alimenta semifinal 1
    r = seleccionarGanador(r, 0, 1, c);           // C vence a D -> alimenta semifinal 1
    r = seleccionarGanador(r, 0, 2, e);           // E vence a F -> alimenta semifinal 2
    r = seleccionarGanador(r, 0, 3, g);           // G vence a H -> alimenta semifinal 2
    r = seleccionarGanador(r, 1, 0, a);           // se decide la semifinal 1: A vence a C
    // La semifinal 2 (E vs G) ya tiene ambos participantes pero nadie la decidió.

    const podio = calcularPodio(r);
    // El perdedor de la semifinal 1 (C) sí cuenta; la semifinal 2, al no
    // tener ganador aún, no puede identificar un "perdedor" y se filtra.
    expect(podio.terceros.map(t => t.id_atleta)).toEqual(['C']);
  });
});

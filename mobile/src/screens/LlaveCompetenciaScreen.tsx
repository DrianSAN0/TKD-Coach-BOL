import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

const BACKEND_URL = 'http://10.0.2.2:8000';
const TEAL = '#5BBEBB';
const AZUL = '#1A237E';
const LINEA = '#444';
const CARD_H = 42;
const CARD_W = 150;
const GAP = 8;

const nextPow2 = (n: number) => { let p = 1; while (p < n) p *= 2; return p; };

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LlaveCompetencia'>;
  route: RouteProp<RootStackParamList, 'LlaveCompetencia'>;
};

type Comp = { id_atleta: string; nombre: string; apellido: string; club: string | null; ciudad: string | null; } | null;
type Partido = { izq: Comp; der: Comp; ganador: Comp };

const MODALIDADES = ['Kyorugi', 'Poomsae'];
const GENEROS_KYO = ['Masculino', 'Femenino'];
const CATEGORIAS_POOMSAE = ['Cadete', 'Junior', 'Senior'];
const PESOS_KYO: Record<string, string[]> = {
  Masculino: ['-54', '-58', '-63', '-68', '-74', '-80', '-87', '+87'],
  Femenino:  ['-46', '-49', '-53', '-57', '-62', '-67', '-73', '+73'],
};

function Tarjeta({ comp, ganador, onPress, disabled, esIzq }: {
  comp: Comp; ganador: boolean; onPress: () => void; disabled: boolean; esIzq: boolean;
}) {
  if (!comp) return (
    <View style={[t.tarjeta, t.bye]}>
      <Text style={t.byeText}>BYE</Text>
    </View>
  );
  return (
    <TouchableOpacity style={[t.tarjeta, ganador && t.ganador]} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
      <View style={[t.colorBar, { backgroundColor: ganador ? TEAL : esIzq ? AZUL : colors.primary }]} />
      <View style={t.info}>
        <Text style={t.nombre} numberOfLines={1}>{comp.nombre} {comp.apellido}</Text>
        <Text style={t.club} numberOfLines={1}>{comp.club ?? comp.ciudad ?? '-'}</Text>
      </View>
      {ganador && <Ionicons name="checkmark-circle" size={14} color={TEAL} style={{ marginRight: 4 }} />}
    </TouchableOpacity>
  );
}

function Selector({ label, opciones, seleccionado, onSelect }: {
  label: string; opciones: string[]; seleccionado: string | null; onSelect: (v: string) => void;
}) {
  return (
    <View style={sel.wrap}>
      <Text style={sel.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sel.row}>
        {opciones.map(op => (
          <TouchableOpacity
            key={op}
            style={[sel.btn, seleccionado === op && sel.btnActivo]}
            onPress={() => onSelect(op)}
          >
            <Text style={[sel.txt, seleccionado === op && sel.txtActivo]}>{op}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function LlaveCompetenciaScreen({ navigation, route }: Props) {
  const [modalidad, setModalidad] = useState<string>('Kyorugi');
  const [genero, setGenero] = useState<string>('Masculino');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [peso, setPeso] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [competidores, setCompetidores] = useState<Comp[]>([]);
  const [rondas, setRondas] = useState<Partido[][]>([]);
  const [tercero, setTercero] = useState<Comp>(null);

  const esKyorugi = modalidad === 'Kyorugi';
  const listo = esKyorugi ? (genero !== null && peso !== null) : (categoria !== null);

  useEffect(() => {
    setPeso(null);
    setCategoria(null);
    setRondas([]);
    setCompetidores([]);
  }, [modalidad, genero]);

  useEffect(() => {
    if (listo) fetchCompetidores();
  }, [peso, categoria]);

  const fetchCompetidores = async () => {
    try {
      setLoading(true);
      let url = '';
      if (esKyorugi) {
        url = `${BACKEND_URL}/competidores/por-peso?peso=${peso?.replace(/[^0-9]/g, '')}&sexo=${genero}`;
      } else {
        url = `${BACKEND_URL}/competidores/?modalidad=Poomsae`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCompetidores(data);
      inicializarBracket(data);
    } catch {
      inicializarBracket([]);
    } finally {
      setLoading(false);
    }
  };

  const inicializarBracket = (comps: Comp[]) => {
    if (comps.length === 0) { setRondas([]); return; }
    const size = nextPow2(comps.length);
    const seeds = [...comps, ...Array(size - comps.length).fill(null)];
    const partidos: Partido[] = [];
    for (let i = 0; i < seeds.length; i += 2) {
      const izq = seeds[i], der = seeds[i + 1];
      const ganador = der === null ? izq : izq === null ? der : null;
      partidos.push({ izq, der, ganador });
    }
    const todasRondas: Partido[][] = [partidos];
    let n = partidos.length;
    while (n > 1) {
      n = Math.ceil(n / 2);
      todasRondas.push(Array(n).fill(null).map(() => ({ izq: null, der: null, ganador: null })));
    }
    setRondas(todasRondas);
  };

  const seleccionarGanador = (rondaIdx: number, partidoIdx: number, ganador: Comp) => {
    const nr = rondas.map(r => r.map(p => ({ ...p })));
    const perdedor = nr[rondaIdx][partidoIdx].izq === ganador
      ? nr[rondaIdx][partidoIdx].der
      : nr[rondaIdx][partidoIdx].izq;

    // Detectar semifinal (penúltima ronda) para 3er lugar
    if (rondaIdx === rondas.length - 2) {
      setTercero(null); // reset al cambiar semi
    }

    nr[rondaIdx][partidoIdx].ganador = ganador;
    if (rondaIdx + 1 < nr.length) {
      const sig = Math.floor(partidoIdx / 2);
      if (partidoIdx % 2 === 0) nr[rondaIdx + 1][sig].izq = ganador;
      else nr[rondaIdx + 1][sig].der = ganador;
      nr[rondaIdx + 1][sig].ganador = null;
    }
    setRondas(nr);
  };

  const getRondaLabel = (idx: number, total: number) => {
    const fromEnd = total - 1 - idx;
    if (fromEnd === 0) return 'Final';
    if (fromEnd === 1) return 'Semifinal';
    if (fromEnd === 2) return 'Cuartos';
    if (fromEnd === 3) return 'Octavos';
    return `Ronda ${idx + 1}`;
  };

  const campeon = rondas.length > 0 ? rondas[rondas.length - 1]?.[0]?.ganador : null;
  const subcampeon = rondas.length > 0
    ? (rondas[rondas.length - 1]?.[0]?.izq === campeon
      ? rondas[rondas.length - 1]?.[0]?.der
      : rondas[rondas.length - 1]?.[0]?.izq)
    : null;

  // Perdedores de semifinal = 3er lugar
  const perdedoresSemi = rondas.length >= 2
    ? rondas[rondas.length - 2].map(p =>
        p.ganador === p.izq ? p.der : p.ganador === p.der ? p.izq : null
      ).filter(Boolean)
    : [];

  const actualizarRanking = async () => {
    if (!campeon || !subcampeon) return;
    try {
      await fetch(`${BACKEND_URL}/ranking/actualizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primero: campeon?.id_atleta,
          segundo: subcampeon?.id_atleta,
          terceros: perdedoresSemi.map((p: any) => p?.id_atleta),
          categoria: esKyorugi ? 'Senior' : categoria,
        }),
      });
      alert('¡Ranking actualizado!');
    } catch {
      alert('Error actualizando ranking');
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={s.titulo}>Llave de Competencia</Text>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Selectores */}
      <View style={s.selectoresWrap}>
        <Selector label="Modalidad" opciones={MODALIDADES} seleccionado={modalidad} onSelect={setModalidad} />
        {esKyorugi && (
          <Selector label="Género" opciones={GENEROS_KYO} seleccionado={genero} onSelect={setGenero} />
        )}
        {esKyorugi && genero && (
          <Selector label="Peso" opciones={PESOS_KYO[genero]} seleccionado={peso} onSelect={setPeso} />
        )}
        {!esKyorugi && (
          <Selector label="Categoría" opciones={CATEGORIAS_POOMSAE} seleccionado={categoria} onSelect={setCategoria} />
        )}
      </View>

      {!listo ? (
        <View style={s.center}>
          <Ionicons name="options-outline" size={40} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary }}>Seleccioná las opciones arriba</Text>
        </View>
      ) : loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={TEAL} />
          <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Cargando bracket...</Text>
        </View>
      ) : rondas.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="people-outline" size={40} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary }}>No hay competidores</Text>
        </View>
      ) : (
        <>
          <Text style={s.hint}>{competidores.length} competidores</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={s.bracket}>
              <View style={s.bracketRow}>
                {rondas.map((partidos, rondaIdx) => {
                  const hayRondaSiguiente = rondaIdx + 1 < rondas.length;
                  const espaciado = Math.pow(2, rondaIdx) * 12;
                  return (
                    <View key={rondaIdx} style={{ alignItems: 'flex-start' }}>
                      <Text style={s.rondaLabel}>{getRondaLabel(rondaIdx, rondas.length)}</Text>
                      <View style={{ gap: espaciado }}>
                        {partidos.map((partido, partidoIdx) => {
                          const bloqueado = !partido.izq && !partido.der;
                          const partidoH = CARD_H * 2 + GAP;
                          return (
                            <View key={partidoIdx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <View style={{ gap: GAP }}>
                                <Tarjeta comp={partido.izq} ganador={partido.ganador !== null && partido.ganador === partido.izq} onPress={() => seleccionarGanador(rondaIdx, partidoIdx, partido.izq)} disabled={bloqueado || partido.izq === null} esIzq={true} />
                                <Tarjeta comp={partido.der} ganador={partido.ganador !== null && partido.ganador === partido.der} onPress={() => seleccionarGanador(rondaIdx, partidoIdx, partido.der)} disabled={bloqueado || partido.der === null} esIzq={false} />
                              </View>
                              {hayRondaSiguiente && (
                                <View style={{ width: 24, height: partidoH }}>
                                  <View style={{ position: 'absolute', left: 0, top: CARD_H / 2, width: 1, height: CARD_H + GAP, backgroundColor: LINEA }} />
                                  <View style={{ position: 'absolute', left: 0, top: CARD_H + GAP / 2, width: 24, height: 1, backgroundColor: LINEA }} />
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}

                {campeon && (
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 8 }}>
                    <Text style={s.rondaLabel}>🏆 Resultados</Text>
                    <View style={s.campeonCard}>
                      <Text style={s.medalla}>🥇</Text>
                      <Text style={s.campeonNombre}>{campeon.nombre} {campeon.apellido}</Text>
                      {subcampeon && <><Text style={s.medalla}>🥈</Text><Text style={s.campeonNombre}>{subcampeon.nombre} {subcampeon.apellido}</Text></>}
                      {perdedoresSemi.map((p: any, i) => p && (
                        <View key={i}><Text style={s.medalla}>🥉</Text><Text style={s.campeonNombre}>{p.nombre} {p.apellido}</Text></View>
                      ))}
                      <TouchableOpacity style={s.rankBtn} onPress={actualizarRanking}>
                        <Text style={s.rankBtnText}>Actualizar Ranking</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </ScrollView>
        </>
      )}

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0D0D0D' },
  center:         { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  titulo:         { color: TEAL, fontSize: 20, fontWeight: '700' },
  selectoresWrap: { paddingHorizontal: 16, paddingBottom: 8, gap: 6 },
  hint:           { color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginBottom: 4 },
  bracket:        { padding: 16 },
  bracketRow:     { flexDirection: 'row', gap: 0, alignItems: 'flex-start' },
  rondaLabel:     { color: TEAL, fontSize: 11, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  campeonCard:    { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#F5C518', minWidth: 160 },
  medalla:        { fontSize: 20 },
  campeonNombre:  { color: colors.white, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  rankBtn:        { marginTop: 8, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  rankBtnText:    { color: colors.white, fontSize: 13, fontWeight: '700' },
});

const sel = StyleSheet.create({
  wrap:     { gap: 4 },
  label:    { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  row:      { gap: 6, flexDirection: 'row' },
  btn:      { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A' },
  btnActivo:{ backgroundColor: TEAL, borderColor: TEAL },
  txt:      { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  txtActivo:{ color: '#1E1E1E', fontWeight: '700' },
});

const t = StyleSheet.create({
  tarjeta:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 6, width: CARD_W, height: CARD_H, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A' },
  ganador:  { borderColor: TEAL, borderWidth: 2 },
  bye:      { backgroundColor: '#111', borderColor: '#222', justifyContent: 'center', alignItems: 'center' },
  byeText:  { color: '#444', fontSize: 12, fontWeight: '700' },
  colorBar: { width: 5, height: '100%' },
  info:     { flex: 1, paddingHorizontal: 6 },
  nombre:   { color: colors.white, fontSize: 11, fontWeight: '700' },
  club:     { color: colors.textSecondary, fontSize: 9 },
});
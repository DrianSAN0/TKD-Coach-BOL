import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const DIAS_SEMANA = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const DOT_COLORS = ['#E93735', '#F5C518', '#2E8B57', '#5BBEBB', '#A855F7'];

export const EVENTOS: { fecha: string; nombre: string; hora: string }[] = [
  { fecha: '2026-05-16', nombre: '2do ranking nacional tarija', hora: '08:00' },
  { fecha: '2026-05-02', nombre: 'Torneo Regional La Paz',       hora: '09:00' },
  { fecha: '2026-05-12', nombre: 'Competencia de prueba hoy',    hora: '10:00' },
  { fecha: '2026-05-13', nombre: 'Competencia mañana',           hora: '09:00' },
  { fecha: '2026-05-16', nombre: '2do ranking nacional tarija', hora: '08:00' },
  { fecha: '2026-05-02', nombre: 'Torneo Regional La Paz',       hora: '09:00' },
  { fecha: '2026-05-18', nombre: 'Competencia Nacional 2026',    hora: '09:00' },
];

type Props = {
  onDiaPress?: (dia: number, mes: number, anio: number, eventos: typeof EVENTOS) => void;
};

export default function MiniCalendar({ onDiaPress }: Props) {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(hoy.getDate());

  const year  = mesActual.getFullYear();
  const month = mesActual.getMonth();
  const diasEnMes = new Date(year, month + 1, 0).getDate();
  const primerDiaRaw = new Date(year, month, 1).getDay();
  const primerDia = primerDiaRaw === 0 ? 6 : primerDiaRaw - 1;

  const cambiarMes = (dir: number) => {
    setMesActual(new Date(year, month + dir, 1));
    setDiaSeleccionado(null);
  };

  const eventosEnDia = (dia: number) =>
    EVENTOS.filter(e => {
      const [y, m, d] = e.fecha.split('-').map(Number);
      return y === year && m - 1 === month && d === dia;
    });

  const esHoy = (dia: number) =>
    dia === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear();

  return (
    <View>
      <View style={s.mesNav}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={s.mesTexto}>{MESES[month]} {year}</Text>
        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <Ionicons name="chevron-forward" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={s.cabeceraDias}>
        {DIAS_SEMANA.map(d => (
          <Text key={d} style={s.cabeceraTexto}>{d}</Text>
        ))}
      </View>

      <View style={s.grid}>
        {Array.from({ length: primerDia }).map((_, i) => (
          <View key={`e${i}`} style={s.diaBox} />
        ))}
        {Array.from({ length: diasEnMes }).map((_, i) => {
          const dia = i + 1;
          const eventos = eventosEnDia(dia);
          const tieneEvento = eventos.length > 0;
          const seleccionado = diaSeleccionado === dia;
          const hoyFlag = esHoy(dia);

          return (
            <TouchableOpacity
              key={dia}
              style={s.diaBox}
              onPress={() => {
                setDiaSeleccionado(dia);
                onDiaPress?.(dia, month, year, eventos);
              }}
            >
              <View style={[
                s.diaInner,
                hoyFlag && s.diaHoy,
                seleccionado && !hoyFlag && s.diaSeleccionado,
              ]}>
                <Text style={[
                  s.diaNum,
                  tieneEvento && s.diaNumEvento,
                  hoyFlag && s.diaNumHoyText,
                  seleccionado && !hoyFlag && s.diaNumSel,
                ]}>
                  {dia}
                </Text>
                <View style={s.eventoDots}>
                  {tieneEvento
                    ? eventos.slice(0, 3).map((_, idx) => (
                        <View key={idx} style={[s.dot, { backgroundColor: DOT_COLORS[idx % DOT_COLORS.length] }]} />
                      ))
                    : <View style={[s.dot, { backgroundColor: 'transparent' }]} />
                  }
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  mesNav:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  mesTexto:        { color: colors.success, fontSize: 18, fontWeight: '700' },
  cabeceraDias:    { flexDirection: 'row', marginBottom: 4 },
  cabeceraTexto:   { flex: 1, textAlign: 'center', color: colors.success, fontSize: 11, fontWeight: '700' },
  grid:            { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  diaBox:          { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  diaInner:        { alignItems: 'center', justifyContent: 'center', width: '90%', aspectRatio: 1, borderRadius: 999 },
  diaHoy:          { backgroundColor: colors.primary },
  diaSeleccionado: { backgroundColor: '#2A2A2A' },
  diaNum:          { color: colors.white, fontSize: 13 },
  diaNumEvento:    { color: colors.success, fontWeight: '700' },
  diaNumHoyText:   { color: colors.white, fontWeight: '800' },
  diaNumSel:       { fontWeight: '700' },
  eventoDots:      { flexDirection: 'row', gap: 1, marginTop: 1 },
  dot:             { width: 4, height: 4, borderRadius: 2 },
});
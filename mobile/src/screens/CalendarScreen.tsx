import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Calendar'>;
};

const DIAS_SEMANA = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA_FULL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

// Eventos de competencia — el admin los irá agregando
const EVENTOS: { fecha: string; nombre: string; hora: string }[] = [
  { fecha: '2026-05-16', nombre: '2do ranking nacional tarija', hora: '08:00' },
  { fecha: '2026-05-02', nombre: 'Torneo Regional La Paz',       hora: '09:00' },
];

// Verifica si hoy es 1 día antes o el mismo día de la competencia
const puedeVerLista = (fechaEvento: string) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const evento = new Date(fechaEvento);
  evento.setHours(0, 0, 0, 0);
  const diff = (evento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 1;
};

const esDiaCompetencia = (fechaEvento: string) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const evento = new Date(fechaEvento);
  evento.setHours(0, 0, 0, 0);
  return hoy.getTime() === evento.getTime();
};

export default function CalendarScreen({ navigation }: Props) {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(hoy.getDate());

  const year = mesActual.getFullYear();
  const month = mesActual.getMonth();
  const diasEnMes = new Date(year, month + 1, 0).getDate();

  // Primer día del mes (0=Dom, ajustamos a LUN=0)
  const primerDiaRaw = new Date(year, month, 1).getDay();
  const primerDia = primerDiaRaw === 0 ? 6 : primerDiaRaw - 1;

  const cambiarMes = (dir: number) => {
    setMesActual(new Date(year, month + dir, 1));
    setDiaSeleccionado(null);
  };

  const tieneFecha = (fechaStr: string) => {
    const [y, m, d] = fechaStr.split('-').map(Number);
    return y === year && m - 1 === month;
  };

  const eventosEnDia = (dia: number) =>
    EVENTOS.filter(e => {
      const [y, m, d] = e.fecha.split('-').map(Number);
      return y === year && m - 1 === month && d === dia;
    });

  const eventosSeleccionados = diaSeleccionado ? eventosEnDia(diaSeleccionado) : [];

  const esHoy = (dia: number) =>
    dia === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear();

  const diaSelecStr = diaSeleccionado
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(diaSeleccionado).padStart(2, '0')}`
    : '';

  const diasSemanaSelec = diaSeleccionado
    ? DIAS_SEMANA_FULL[(new Date(year, month, diaSeleccionado).getDay() + 6) % 7]
    : '';

  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.titulo}>Calendario</Text>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Navegación mes ── */}
        <View style={s.mesNav}>
          <TouchableOpacity onPress={() => cambiarMes(-1)}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={s.mesTexto}>{MESES[month]} {year}</Text>
          <TouchableOpacity onPress={() => cambiarMes(1)}>
            <Ionicons name="chevron-forward" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* ── Cabecera días ── */}
        <View style={s.cabeceraDias}>
          {DIAS_SEMANA.map(d => (
            <Text key={d} style={s.cabeceraTexto}>{d}</Text>
          ))}
        </View>

        {/* ── Grid días ── */}
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
                onPress={() => setDiaSeleccionado(dia)}
              >
                <View style={[
                  s.diaInner,
                  seleccionado && s.diaSeleccionado,
                ]}>
                  <Text style={[
                    s.diaNum,
                    tieneEvento && s.diaNumEvento,
                    hoyFlag && !seleccionado && s.diaNumHoy,
                    seleccionado && s.diaNumSel,
                  ]}>
                    {dia}
                  </Text>
                  {tieneEvento && (
                    <View style={s.eventoDots}>
                      <View style={[s.dot, { backgroundColor: '#E93735' }]} />
                      <View style={[s.dot, { backgroundColor: '#F5C518' }]} />
                      <View style={[s.dot, { backgroundColor: '#2E8B57' }]} />
                    </View>
                  )}
                  {!tieneEvento && (
                    <View style={s.eventoDots}>
                      <View style={[s.dot, { backgroundColor: 'transparent' }]} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Día seleccionado ── */}
        <View style={s.diaInfoRow}>
          <Text style={s.diaInfoTexto}>
            {diaSeleccionado
              ? `${diasSemanaSelec} ${diaSeleccionado} de ${MESES[month]}`
              : 'Seleccioná un día'}
          </Text>
          <TouchableOpacity style={s.addBtn}>
            <Text style={s.addBtnLabel}>AUGUST</Text>
            <Ionicons name="add-circle" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Eventos del día ── */}
        {eventosSeleccionados.length === 0 ? (
          <Text style={s.sinEventos}>No hay eventos hoy</Text>
        ) : (
          eventosSeleccionados.map((ev, i) => (
            <View key={i} style={s.eventoItem}>
              <View style={s.eventoIndicador} />
              <Text style={s.eventoNombre}>{ev.nombre}</Text>
              <Text style={s.eventoHora}>{ev.hora}</Text>
            </View>
          ))
        )}

        {/* ── Lista de competidores ── */}
        <Text style={s.seccionTitulo}>Lista de competidores</Text>

        {eventosSeleccionados.length > 0 ? (
          <>
            {['Poomsae', 'Kyorugui'].map(tipo => {
              const habilitado = puedeVerLista(eventosSeleccionados[0].fecha);
              return (
                <TouchableOpacity
                  key={tipo}
                  style={[s.listaBtn, !habilitado && s.listaBtnDisabled]}
                  disabled={!habilitado}
                  onPress={() => navigation.navigate('ListaCompetidores', { modalidad: tipo })}
                >
                  <Text style={[s.listaBtnText, !habilitado && s.listaBtnTextDisabled]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <>
            <TouchableOpacity style={[s.listaBtn, s.listaBtnDisabled]} disabled>
              <Text style={[s.listaBtnText, s.listaBtnTextDisabled]}>Poomsae</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.listaBtn, s.listaBtnDisabled]} disabled>
              <Text style={[s.listaBtnText, s.listaBtnTextDisabled]}>Kyorugui</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Llave de competidores ── */}
        <View style={s.llaveCard}>
          <Text style={s.llaveTitulo}>Llave de competidores</Text>
          {eventosSeleccionados.length > 0 && esDiaCompetencia(eventosSeleccionados[0].fecha) ? (
            <TouchableOpacity style={s.llaveBtn} onPress={() => Alert.alert('Llaves', 'Ver llaves')}>
              <Text style={s.llaveBtnText}>Ver Llaves</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={s.alertaCirculo}>
                <Ionicons name="alert-circle" size={36} color={colors.primary} />
              </View>
              <Text style={s.llaveDesc}>
                Este botón se activará únicamente el día de la competencia. Hasta ese momento,
                permanecerá deshabilitado. Una vez habilitado, podrás acceder a la información
                correspondiente.
              </Text>
              <TouchableOpacity style={[s.llaveBtn, s.llaveBtnDisabled]} disabled>
                <Text style={[s.llaveBtnText, s.llaveBtnTextDisabled]}>Ver Llaves</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:            { flex: 1, backgroundColor: '#1E1E1E' },
  scroll:               { paddingHorizontal: 16, paddingTop: 4 },
  header:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  titulo:               { color: colors.white, fontSize: 22, fontWeight: '700' },
  mesNav:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  mesTexto:             { color: colors.success, fontSize: 18, fontWeight: '700' },
  cabeceraDias:         { flexDirection: 'row', marginBottom: 4 },
  cabeceraTexto:        { flex: 1, textAlign: 'center', color: colors.success, fontSize: 11, fontWeight: '700' },
  grid:                 { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  diaBox:               { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  diaInner:             { alignItems: 'center', justifyContent: 'center', width: '90%', aspectRatio: 1, borderRadius: 999 },
  diaSeleccionado:      { backgroundColor: '#2A2A2A' },
  diaNum:               { color: colors.white, fontSize: 13 },
  diaNumEvento:         { color: colors.success, fontWeight: '700' },
  diaNumHoy:            { color: colors.primary, fontWeight: '700' },
  diaNumSel:            { fontWeight: '700' },
  eventoDots:           { flexDirection: 'row', gap: 1, marginTop: 1 },
  dot:                  { width: 4, height: 4, borderRadius: 2 },
  diaInfoRow:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  diaInfoTexto:         { color: colors.white, fontSize: 14, fontWeight: '600' },
  addBtn:               { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnLabel:          { color: colors.white, fontSize: 12 },
  sinEventos:           { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: 12 },
  eventoItem:           { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  eventoIndicador:      { width: 4, height: 20, backgroundColor: colors.primary, borderRadius: 2 },
  eventoNombre:         { flex: 1, color: colors.white, fontSize: 13 },
  eventoHora:           { color: colors.primary, fontSize: 12, fontWeight: '700' },
  seccionTitulo:        { color: colors.primary, fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 10 },
  listaBtn:             { backgroundColor: colors.success, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  listaBtnDisabled:     { backgroundColor: '#2A2A2A', opacity: 0.5 },
  listaBtnText:         { color: '#1E1E1E', fontSize: 15, fontWeight: '700' },
  listaBtnTextDisabled: { color: colors.textSecondary },
  llaveCard:            { backgroundColor: '#2A2A2A', borderRadius: 16, padding: 20, marginTop: 8, alignItems: 'center', gap: 12 },
  llaveTitulo:          { color: colors.white, fontSize: 16, fontWeight: '700' },
  alertaCirculo:        { marginVertical: 4 },
  llaveDesc:            { color: colors.textSecondary, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  llaveBtn:             { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32, alignItems: 'center', width: '100%' },
  llaveBtnDisabled:     { backgroundColor: '#3A3A3A' },
  llaveBtnText:         { color: colors.white, fontSize: 15, fontWeight: '700' },
  llaveBtnTextDisabled: { color: '#666' },
});
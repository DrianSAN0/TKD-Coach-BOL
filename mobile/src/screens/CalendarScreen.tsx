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
import MiniCalendar, { EVENTOS } from '../components/MiniCalendar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Calendar'>;
};

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA_FULL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

const diasHastaEvento = (fechaEvento: string) => {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const evento = new Date(fechaEvento); evento.setHours(0,0,0,0);
  return (evento.getTime() - hoy.getTime()) / (1000*60*60*24);
};

const puedeVerLista  = (fecha: string) => diasHastaEvento(fecha) <= 1;
const esDiaCompetencia = (fecha: string) => diasHastaEvento(fecha) === 0;

export default function CalendarScreen({ navigation }: Props) {
  const hoy = new Date();
  const [diaSeleccionado, setDiaSeleccionado]   = useState<number | null>(hoy.getDate());
  const [mesSeleccionado, setMesSeleccionado]   = useState(hoy.getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear());
  const [eventosSeleccionados, setEventosSeleccionados] = useState<typeof EVENTOS>(
    EVENTOS.filter(e => {
      const [y, m, d] = e.fecha.split('-').map(Number);
      return y === hoy.getFullYear() && m - 1 === hoy.getMonth() && d === hoy.getDate();
    })
  );

  const diasSemanaSelec = diaSeleccionado
    ? DIAS_SEMANA_FULL[(new Date(anioSeleccionado, mesSeleccionado, diaSeleccionado).getDay() + 6) % 7]
    : '';

  const eventoActivo = eventosSeleccionados[0];
  const listaHabilitada = eventoActivo ? puedeVerLista(eventoActivo.fecha) : false;
  const llaveHabilitada = eventoActivo ? esDiaCompetencia(eventoActivo.fecha) : false;

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.titulo}>Calendario</Text>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <MiniCalendar
          onDiaPress={(dia, mes, anio, eventos) => {
            setDiaSeleccionado(dia);
            setMesSeleccionado(mes);
            setAnioSeleccionado(anio);
            setEventosSeleccionados(eventos);
          }}
        />

        {/* Día seleccionado */}
        <View style={s.diaInfoRow}>
          <Text style={s.diaInfoTexto}>
            {diaSeleccionado
              ? `${diasSemanaSelec} ${diaSeleccionado} de ${MESES[mesSeleccionado]}`
              : 'Seleccioná un día'}
          </Text>
        </View>

        {/* Eventos del día */}
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

        {/* Lista de competidores */}
        <Text style={s.seccionTitulo}>Lista de competidores</Text>

        {['Poomsae', 'Kyorugui'].map(tipo => (
          <TouchableOpacity
            key={tipo}
            style={[s.listaBtn, !listaHabilitada && s.listaBtnDisabled]}
            disabled={!listaHabilitada}
            onPress={() => navigation.navigate('ListaCompetidores', { modalidad: tipo })}
          >
            <Text style={[s.listaBtnText, !listaHabilitada && s.listaBtnTextDisabled]}>
              {tipo}
            </Text>
          </TouchableOpacity>
        ))}

        {!listaHabilitada && eventoActivo && (
          <Text style={s.infoText}>
            Se habilitará el {new Date(new Date(eventoActivo.fecha).getTime() - 86400000).toLocaleDateString('es-BO', { day: 'numeric', month: 'long' })}
          </Text>
        )}

        {/* Llave de competidores */}
        <View style={s.llaveCard}>
          <Text style={s.llaveTitulo}>Llave de competidores</Text>
          {llaveHabilitada ? (
            <TouchableOpacity style={s.llaveBtn} onPress={() => navigation.navigate('LlaveCompetencia', { categoria: '-58kg', genero: 'Masculino' })}>
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
  diaInfoRow:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  diaInfoTexto:         { color: colors.white, fontSize: 14, fontWeight: '600' },
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
  infoText:             { color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginBottom: 10 },
  llaveCard:            { backgroundColor: '#2A2A2A', borderRadius: 16, padding: 20, marginTop: 8, alignItems: 'center', gap: 12 },
  llaveTitulo:          { color: colors.white, fontSize: 16, fontWeight: '700' },
  alertaCirculo:        { marginVertical: 4 },
  llaveDesc:            { color: colors.textSecondary, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  llaveBtn:             { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32, alignItems: 'center', width: '100%' },
  llaveBtnDisabled:     { backgroundColor: '#3A3A3A' },
  llaveBtnText:         { color: colors.white, fontSize: 15, fontWeight: '700' },
  llaveBtnTextDisabled: { color: '#666' },
});
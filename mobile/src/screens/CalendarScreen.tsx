import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '555829732320-nqajp3fjb6aeditl4587ht2k0mi27iq4.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Calendar'>;
};

type CalendarEvent = {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
};

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export default function CalendarScreen({ navigation }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(new Date().getDate());

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri,
      responseType: 'token',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);
      fetchEvents(access_token);
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
    }
  }, [response]);

  const fetchEvents = async (accessToken: string) => {
    setLoading(true);
    try {
      const now = new Date();
      const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=50`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      setEvents(data.items || []);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los eventos.');
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers de calendario ──────────────────────────────────────────────────
  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).getDay();

  const eventosDelDia = (dia: number) => {
    return events.filter(e => {
      const fecha = e.start.dateTime || e.start.date || '';
      const d = new Date(fecha);
      return d.getDate() === dia &&
        d.getMonth() === mesActual.getMonth() &&
        d.getFullYear() === mesActual.getFullYear();
    });
  };

  const eventosDiaSeleccionado = diaSeleccionado ? eventosDelDia(diaSeleccionado) : [];

  const formatHora = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
  };

  const cambiarMes = (dir: number) => {
    const nuevo = new Date(mesActual.getFullYear(), mesActual.getMonth() + dir, 1);
    setMesActual(nuevo);
    setDiaSeleccionado(null);
  };

  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.title}>Calendario</Text>
        <TouchableOpacity onPress={() => token ? fetchEvents(token) : promptAsync()}>
          <Ionicons
            name={token ? 'refresh-outline' : 'logo-google'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Sin sesión ── */}
        {!token && (
          <TouchableOpacity style={s.loginBtn} onPress={() => promptAsync()}>
            <Ionicons name="logo-google" size={20} color={colors.white} />
            <Text style={s.loginBtnText}>Conectar Google Calendar</Text>
          </TouchableOpacity>
        )}

        {/* ── Navegación de mes ── */}
        <View style={s.mesNav}>
          <TouchableOpacity onPress={() => cambiarMes(-1)}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={s.mesText}>
            {MESES[mesActual.getMonth()]} {mesActual.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => cambiarMes(1)}>
            <Ionicons name="chevron-forward" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* ── Días de la semana ── */}
        <View style={s.diasSemana}>
          {DIAS.map(d => (
            <Text key={d} style={s.diaSemanaText}>{d}</Text>
          ))}
        </View>

        {/* ── Grid del mes ── */}
        <View style={s.grid}>
          {Array.from({ length: primerDia }).map((_, i) => (
            <View key={`empty-${i}`} style={s.diaBox} />
          ))}
          {Array.from({ length: diasEnMes }).map((_, i) => {
            const dia = i + 1;
            const tieneEvento = eventosDelDia(dia).length > 0;
            const seleccionado = diaSeleccionado === dia;
            const hoy = new Date().getDate() === dia &&
              new Date().getMonth() === mesActual.getMonth() &&
              new Date().getFullYear() === mesActual.getFullYear();

            return (
              <TouchableOpacity
                key={dia}
                style={[
                  s.diaBox,
                  seleccionado && s.diaSeleccionado,
                  hoy && !seleccionado && s.diaHoy,
                ]}
                onPress={() => setDiaSeleccionado(dia)}
              >
                <Text style={[
                  s.diaNum,
                  seleccionado && s.diaNumSeleccionado,
                  hoy && !seleccionado && s.diaNumHoy,
                ]}>
                  {dia}
                </Text>
                {tieneEvento && (
                  <View style={[s.eventoDot, seleccionado && s.eventoDotSeleccionado]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Eventos del día seleccionado ── */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
        ) : (
          <View style={s.eventosSection}>
            <Text style={s.eventosSectionTitle}>
              {diaSeleccionado
                ? `${diaSeleccionado} de ${MESES[mesActual.getMonth()]}`
                : 'Seleccioná un día'}
            </Text>

            {eventosDiaSeleccionado.length === 0 ? (
              <View style={s.sinEventos}>
                <Ionicons name="calendar-outline" size={36} color={colors.border} />
                <Text style={s.sinEventosText}>
                  {token ? 'Sin eventos este día' : 'Conectá Google Calendar para ver tus eventos'}
                </Text>
              </View>
            ) : (
              eventosDiaSeleccionado.map(evento => (
                <View key={evento.id} style={s.eventoCard}>
                  <View style={s.eventoIndicador} />
                  <View style={s.eventoInfo}>
                    <Text style={s.eventoTitulo}>{evento.summary}</Text>
                    {evento.start.dateTime && (
                      <Text style={s.eventoHora}>
                        {formatHora(evento.start.dateTime)} — {formatHora(evento.end.dateTime)}
                      </Text>
                    )}
                    {evento.location && (
                      <Text style={s.eventoLugar} numberOfLines={1}>
                        📍 {evento.location}
                      </Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:              { flex: 1, backgroundColor: colors.background },
  scroll:                 { paddingHorizontal: 16, paddingTop: 8 },
  header:                 { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title:                  { color: colors.white, fontSize: 22, fontWeight: '700' },
  loginBtn:               { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 },
  loginBtnText:           { color: colors.white, fontSize: 15, fontWeight: '700' },
  mesNav:                 { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  mesText:                { color: colors.white, fontSize: 16, fontWeight: '700' },
  diasSemana:             { flexDirection: 'row', marginBottom: 6 },
  diaSemanaText:          { flex: 1, textAlign: 'center', color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  grid:                   { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  diaBox:                 { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  diaSeleccionado:        { backgroundColor: colors.primary, borderRadius: 20 },
  diaHoy:                 { borderWidth: 1, borderColor: colors.primary, borderRadius: 20 },
  diaNum:                 { color: colors.white, fontSize: 13 },
  diaNumSeleccionado:     { color: colors.white, fontWeight: '700' },
  diaNumHoy:              { color: colors.primary, fontWeight: '700' },
  eventoDot:              { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary },
  eventoDotSeleccionado:  { backgroundColor: colors.white },
  eventosSection:         { gap: 10 },
  eventosSectionTitle:    { color: colors.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sinEventos:             { alignItems: 'center', paddingVertical: 32, gap: 10 },
  sinEventosText:         { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },
  eventoCard:             { backgroundColor: colors.cardDark, borderRadius: 12, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  eventoIndicador:        { width: 4, backgroundColor: colors.primary },
  eventoInfo:             { flex: 1, padding: 12, gap: 4 },
  eventoTitulo:           { color: colors.white, fontSize: 14, fontWeight: '600' },
  eventoHora:             { color: colors.textSecondary, fontSize: 12 },
  eventoLugar:            { color: colors.textSecondary, fontSize: 12 },
});
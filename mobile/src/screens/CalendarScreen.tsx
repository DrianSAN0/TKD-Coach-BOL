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

const CLIENT_ID = '555829732320-l63dohg6qd5jusjt3i7j40ufbj5cto8c.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const DIAS  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Calendar'>;
};

type CalendarEvent = {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end:   { dateTime?: string; date?: string };
  location?: string;
};

export default function CalendarScreen({ navigation }: Props) {
  const [token,            setToken]            = useState<string | null>(null);
  const [events,           setEvents]           = useState<CalendarEvent[]>([]);
  const [loading,          setLoading]          = useState(false);
  const [mesActual,        setMesActual]        = useState(new Date());
  const [diaSeleccionado,  setDiaSeleccionado]  = useState<number | null>(new Date().getDate());

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'tkd-coach-bol' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId:     CLIENT_ID,
      scopes:       SCOPES,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams:  { access_type: 'online' },
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      exchangeCode(response.params.code);
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
    }
  }, [response]);

  const exchangeCode = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id:    CLIENT_ID,
          redirect_uri: redirectUri,
          grant_type:   'authorization_code',
        }).toString(),
      });
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        fetchEvents(data.access_token);
      } else {
        Alert.alert('Error', 'No se pudo obtener el token.');
      }
    } catch {
      Alert.alert('Error', 'Error al autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (accessToken: string) => {
    setLoading(true);
    try {
      const timeMin = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).toISOString();
      const timeMax = new Date(mesActual.getFullYear(), mesActual.getMonth() + 2, 0).toISOString();
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

  // ── Helpers calendario ─────────────────────────────────────────────────────
  const diasEnMes  = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const primerDia  = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).getDay();

  const eventosDelDia = (dia: number) =>
    events.filter(e => {
      const d = new Date(e.start.dateTime || e.start.date || '');
      return d.getDate() === dia &&
        d.getMonth()     === mesActual.getMonth() &&
        d.getFullYear()  === mesActual.getFullYear();
    });

  const eventosDiaSeleccionado = diaSeleccionado ? eventosDelDia(diaSeleccionado) : [];

  const formatHora = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
  };

  const cambiarMes = (dir: number) => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + dir, 1));
    setDiaSeleccionado(null);
  };

  const hoy = new Date();

  return (
    <SafeAreaView style={s.container}>

  {/* ── Header ── */}
<View style={s.header}>
  <Text style={s.title}>Calendario</Text>
  {token && (
    <TouchableOpacity onPress={() => fetchEvents(token)}>
      <Ionicons name="refresh-outline" size={22} color={colors.primary} />
    </TouchableOpacity>
  )}
</View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Navegación de mes ── */}
        <View style={s.mesNav}>
          <TouchableOpacity onPress={() => cambiarMes(-1)} style={s.mesBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={s.mesText}>
            {MESES[mesActual.getMonth()]} {mesActual.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => cambiarMes(1)} style={s.mesBtn}>
            <Ionicons name="chevron-forward" size={20} color={colors.white} />
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
            const dia         = i + 1;
            const tieneEvento = eventosDelDia(dia).length > 0;
            const seleccionado = diaSeleccionado === dia;
            const esHoy       = hoy.getDate() === dia &&
              hoy.getMonth()    === mesActual.getMonth() &&
              hoy.getFullYear() === mesActual.getFullYear();

            return (
              <TouchableOpacity
                key={dia}
                style={[s.diaBox, seleccionado && s.diaSeleccionado, esHoy && !seleccionado && s.diaHoy]}
                onPress={() => setDiaSeleccionado(dia)}
              >
                <Text style={[s.diaNum, seleccionado && s.diaNumSel, esHoy && !seleccionado && s.diaNumHoy]}>
                  {dia}
                </Text>
                {tieneEvento && (
                  <View style={[s.dot, seleccionado && s.dotSel]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Eventos del día ── */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
        ) : (
          <View style={s.eventosSection}>

            <Text style={s.eventosFecha}>
              {diaSeleccionado
                ? `${diaSeleccionado} de ${MESES[mesActual.getMonth()]}`
                : 'Seleccioná un día'}
            </Text>

            {eventosDiaSeleccionado.length === 0 ? (
              <View style={s.sinEventos}>
                {!token ? (
                  <>
                    <Ionicons name="logo-google" size={40} color={colors.border} />
                    <Text style={s.sinEventosText}>Conectá Google Calendar{'\n'}para ver tus eventos</Text>
                    <TouchableOpacity style={s.conectarBtnGrande} onPress={() => promptAsync()}>
                      <Ionicons name="logo-google" size={18} color={colors.white} />
                      <Text style={s.conectarBtnGrandeText}>Conectar Google Calendar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Ionicons name="calendar-outline" size={36} color={colors.border} />
                    <Text style={s.sinEventosText}>Sin eventos este día</Text>
                  </>
                )}
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
                      <Text style={s.eventoLugar} numberOfLines={1}>📍 {evento.location}</Text>
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
  container:            { flex: 1, backgroundColor: colors.background },
  scroll:               { paddingHorizontal: 16, paddingTop: 4 },
  header:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title:                { color: colors.white, fontSize: 22, fontWeight: '700' },
  headerRight:          { flexDirection: 'row', alignItems: 'center' },
  conectarBtn:          { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  conectarBtnText:      { color: colors.white, fontSize: 13, fontWeight: '600' },
  mesNav:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  mesBtn:               { padding: 4 },
  mesText:              { color: colors.white, fontSize: 16, fontWeight: '700' },
  diasSemana:           { flexDirection: 'row', marginBottom: 4 },
  diaSemanaText:        { flex: 1, textAlign: 'center', color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  grid:                 { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  diaBox:               { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  diaSeleccionado:      { backgroundColor: colors.primary, borderRadius: 999 },
  diaHoy:               { borderWidth: 1, borderColor: colors.primary, borderRadius: 999 },
  diaNum:               { color: colors.white, fontSize: 13 },
  diaNumSel:            { fontWeight: '700' },
  diaNumHoy:            { color: colors.primary, fontWeight: '700' },
  dot:                  { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary },
  dotSel:               { backgroundColor: colors.white },
  eventosSection:       { gap: 10 },
  eventosFecha:         { color: colors.white, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  sinEventos:           { alignItems: 'center', paddingVertical: 28, gap: 12 },
  sinEventosText:       { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  conectarBtnGrande:    { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, marginTop: 4 },
  conectarBtnGrandeText:{ color: colors.white, fontSize: 14, fontWeight: '700' },
  eventoCard:           { backgroundColor: colors.cardDark, borderRadius: 12, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  eventoIndicador:      { width: 4, backgroundColor: colors.primary },
  eventoInfo:           { flex: 1, padding: 12, gap: 4 },
  eventoTitulo:         { color: colors.white, fontSize: 14, fontWeight: '600' },
  eventoHora:           { color: colors.textSecondary, fontSize: 12 },
  eventoLugar:          { color: colors.textSecondary, fontSize: 12 },
});
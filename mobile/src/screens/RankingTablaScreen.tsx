import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

const BACKEND_URL = 'http://127.0.0.1:8000';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RankingTabla'>;
  route: RouteProp<RootStackParamList, 'RankingTabla'>;
};

type Competidor = {
  posicion:          number;
  nombre:            string;
  apellido:          string;
  club:              string | null;
  categoria:         string | null;
  puntaje_acumulado: number;
};

const medalColor = (pos: number) => {
  if (pos === 1) return '#FFD700';
  if (pos === 2) return '#C0C0C0';
  if (pos === 3) return '#CD7F32';
  return colors.textSecondary;
};

export default function RankingTablaScreen({ navigation, route }: Props) {
  const { categoria, genero, peso } = route.params;
  const [competidores, setCompetidores] = useState<Competidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/ranking/?categoria=${categoria}`);
      if (!res.ok) throw new Error('Error al cargar ranking');
      const data = await res.json();
      setCompetidores(data);
    } catch (e: any) {
      setError('No se pudo cargar el ranking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Ranking Nacional</Text>
          <Text style={s.subtitle}>{categoria} · {genero} · {peso}</Text>
        </View>
        <TouchableOpacity onPress={fetchRanking}>
          <Ionicons name="refresh-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Tabla ── */}
      <View style={s.tableHeader}>
        <Text style={[s.colHeader, { width: 50, textAlign: 'center' }]}>Pos.</Text>
        <Text style={[s.colHeader, { flex: 1 }]}>Nombre</Text>
        <Text style={[s.colHeader, { width: 80, textAlign: 'center' }]}>Club</Text>
        <Text style={[s.colHeader, { width: 60, textAlign: 'center' }]}>Score</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>Cargando ranking...</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.primary} />
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchRanking}>
            <Text style={s.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
          {competidores.map((c, i) => (
            <View key={i} style={[s.fila, i % 2 === 0 && s.filaAlterna]}>
              <Text style={[s.posText, { width: 50, textAlign: 'center', color: medalColor(c.posicion) }]}>
                {c.posicion}
              </Text>
              <Text style={[s.nombreText, { flex: 1 }]} numberOfLines={1}>
                {c.nombre} {c.apellido}
              </Text>
              <Text style={[s.clubText, { width: 80 }]} numberOfLines={1}>
                {c.club || '-'}
              </Text>
              <Text style={[s.puntajeText, { width: 60, textAlign: 'center' }]}>
                {c.puntaje_acumulado}
              </Text>
            </View>
          ))}
          <View style={{ height: 16 }} />
        </ScrollView>
      )}

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerCenter: { flex: 1, paddingHorizontal: 10 },
  title:        { color: colors.primary, fontSize: 20, fontWeight: '700' },
  subtitle:     { color: colors.textSecondary, fontSize: 12 },
  scroll:       { flex: 1, paddingHorizontal: 16 },
  tableHeader:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#2A2A2A', marginHorizontal: 16, borderRadius: 10, marginBottom: 6 },
  colHeader:    { color: colors.primary, fontSize: 12, fontWeight: '700' },
  fila:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8 },
  filaAlterna:  { backgroundColor: '#222222' },
  posText:      { fontSize: 14, fontWeight: '700' },
  nombreText:   { color: colors.white, fontSize: 13, paddingRight: 4 },
  clubText:     { color: colors.textSecondary, fontSize: 11, textAlign: 'center' },
  puntajeText:  { color: colors.white, fontSize: 14, fontWeight: '700' },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:  { color: colors.textSecondary, fontSize: 14 },
  errorText:    { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  retryBtn:     { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 24 },
  retryText:    { color: colors.white, fontSize: 14, fontWeight: '700' },
});
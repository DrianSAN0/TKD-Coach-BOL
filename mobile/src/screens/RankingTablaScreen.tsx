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

const BACKEND_URL = 'http://10.0.2.2:8000';
const TEAL = '#5BBEBB';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RankingTabla'>;
  route: RouteProp<RootStackParamList, 'RankingTabla'>;
};

type Competidor = {
  posicion:          number;
  nombre:            string;
  apellido:          string;
  nombre_pareja?:    string;
  club:              string | null;
  ciudad:            string | null;
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
  const esPareja = genero === 'Pareja';
  const [competidores, setCompetidores] = useState<Competidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchRanking(); }, []);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const url = esPareja
        ? `${BACKEND_URL}/ranking/?categoria=${categoria}&modalidad=Pareja`
        : `${BACKEND_URL}/ranking/?categoria=${categoria}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al cargar ranking');
      const data = await res.json();
      setCompetidores(data);
    } catch {
      setError('No se pudo cargar el ranking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>

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

      {/* Tabla header */}
      <View style={s.tableHeader}>
        <Text style={[s.colHeader, { width: 40 }]}>Pos.</Text>
        <Text style={[s.colHeader, { flex: 1 }]}>Nombre</Text>
        <Text style={[s.colHeader, { width: 80, textAlign: 'center' }]}>Ciudad</Text>
        <Text style={[s.colHeader, { width: 55, textAlign: 'center' }]}>Score</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={TEAL} />
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
              {/* Posición */}
              <Text style={[s.posText, { width: 40, color: medalColor(c.posicion) }]}>
                {c.posicion}
              </Text>

              {/* Nombre + Club debajo */}
              <View style={{ flex: 1, paddingRight: 4 }}>
                {esPareja ? (
                  <>
                    <Text style={s.nombreText} numberOfLines={1}>{c.nombre} {c.apellido}</Text>
                    {c.nombre_pareja && (
                      <Text style={s.nombreText} numberOfLines={1}>{c.nombre_pareja}</Text>
                    )}
                  </>
                ) : (
                  <Text style={s.nombreText} numberOfLines={1}>{c.nombre} {c.apellido}</Text>
                )}
                {c.club && <Text style={s.clubText}>{c.club}</Text>}
              </View>

              {/* Ciudad */}
              <Text style={[s.ciudadText, { width: 80 }]} numberOfLines={1}>
                {c.ciudad ?? '-'}
              </Text>

              {/* Score */}
              <Text style={[s.puntajeText, { width: 55, textAlign: 'center' }]}>
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
  container:    { flex: 1, backgroundColor: '#0D0D0D' },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerCenter: { flex: 1, paddingHorizontal: 10 },
  title:        { color: colors.primary, fontSize: 20, fontWeight: '700' },
  subtitle:     { color: colors.textSecondary, fontSize: 12 },
  scroll:       { flex: 1, paddingHorizontal: 16 },
  tableHeader:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.primary, marginHorizontal: 16, borderRadius: 10, marginBottom: 6 },
  colHeader:    { color: colors.white, fontSize: 12, fontWeight: '700' },
  fila:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8 },
  filaAlterna:  { backgroundColor: '#1A1A1A' },
  posText:      { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  nombreText:   { color: colors.white, fontSize: 13, fontWeight: '600' },
  clubText:     { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  ciudadText:   { color: TEAL, fontSize: 12, textAlign: 'center' },
  puntajeText:  { color: colors.white, fontSize: 14, fontWeight: '700' },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText:    { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  retryBtn:     { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 24 },
  retryText:    { color: colors.white, fontSize: 14, fontWeight: '700' },
});
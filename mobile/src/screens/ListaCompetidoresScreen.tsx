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

const BACKEND_URL = 'http://127.0.0.1:8000';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ListaCompetidores'>;
  route: RouteProp<RootStackParamList, 'ListaCompetidores'>;
};

type Competidor = {
  nombre: string;
  apellido: string;
  peso: number | null;
  edad: number | null;
  sexo: string | null;
  club: string | null;
};

export default function ListaCompetidoresScreen({ navigation, route }: Props) {
  const { modalidad } = route.params;
  const [competidores, setCompetidores] = useState<Competidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompetidores();
  }, []);

  const fetchCompetidores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/competidores/?modalidad=${modalidad}`);
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setCompetidores(data);
    } catch (e: any) {
      setError('No se pudo cargar la lista');
    } finally {
      setLoading(false);
    }
  };

  const formatPeso = (peso: number | null) => {
    if (!peso) return '-';
    return `-${Math.round(peso)}kg`;
  };

  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View>
          <Text style={s.titulo}>Lista de competidores</Text>
          <Text style={s.subtitulo}>{modalidad}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Tabla header ── */}
      <View style={s.tablaHeader}>
        <View style={s.colNombre}>
          <Text style={s.tablaHeaderText}>Nombre</Text>
        </View>
        <View style={s.colPeso}>
          <Text style={s.tablaHeaderText}>Peso</Text>
        </View>
        <View style={s.colEdad}>
          <Text style={s.tablaHeaderText}>Edad</Text>
        </View>
      </View>

      {/* ── Contenido ── */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.primary} />
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchCompetidores}>
            <Text style={s.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
          {competidores.map((c, i) => (
            <View key={i} style={[s.fila, i % 2 === 0 && s.filaAlterna]}>
              <View style={s.colNombre}>
                <Text style={s.filaNombre} numberOfLines={1}>
                  {c.nombre} {c.apellido}
                </Text>
              </View>
              <View style={s.colPeso}>
                <Text style={s.filaTexto}>{formatPeso(c.peso)}</Text>
              </View>
              <View style={s.colEdad}>
                <Text style={s.filaTexto}>{c.edad ?? '-'}</Text>
              </View>
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
  container:       { flex: 1, backgroundColor: colors.background },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  titulo:          { color: colors.primary, fontSize: 18, fontWeight: '700' },
  subtitulo:       { color: colors.textSecondary, fontSize: 12 },
  tablaHeader:     { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, borderRadius: 8, marginBottom: 4 },
  tablaHeaderText: { color: colors.white, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  colNombre:       { flex: 1 },
  colPeso:         { width: 70, alignItems: 'center' },
  colEdad:         { width: 50, alignItems: 'center' },
  scroll:          { flex: 1, paddingHorizontal: 16 },
  fila:            { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8 },
  filaAlterna:     { backgroundColor: '#2A2A2A' },
  filaNombre:      { color: colors.white, fontSize: 13 },
  filaTexto:       { color: colors.white, fontSize: 13, textAlign: 'center' },
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText:       { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  retryBtn:        { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 24 },
  retryText:       { color: colors.white, fontSize: 14, fontWeight: '700' },
});

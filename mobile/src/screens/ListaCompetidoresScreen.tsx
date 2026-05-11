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
  categoria: string | null;
};

const CATEGORIAS_POOMSAE = ['Todos','Cadete', 'Junior', 'Senior'];
const CATEGORIAS_KYORUGI = ['Todos', 'Femenino', 'Masculino'];

export default function ListaCompetidoresScreen({ navigation, route }: Props) {
  const { modalidad } = route.params;
  const [competidores, setCompetidores] = useState<Competidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const categorias = modalidad === 'Poomsae' ? CATEGORIAS_POOMSAE : CATEGORIAS_KYORUGI;

  useEffect(() => { fetchCompetidores(); }, []);

  const fetchCompetidores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/competidores/?modalidad=${modalidad}`);
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setCompetidores(data);
    } catch {
      setError('No se pudo cargar la lista');
    } finally {
      setLoading(false);
    }
  };

  const competidoresFiltrados = filtro === 'Todos'
    ? competidores
    : competidores.filter(c => {
        if (modalidad === 'Kyorugi') return c.sexo === filtro;
        return c.categoria === filtro;
      });

  const formatPeso = (peso: number | null) => peso ? `-${Math.round(peso)}kg` : '-';

  return (
    <SafeAreaView style={s.container}>

      {/* Header */}
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

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filtrosRow}
      >
        {categorias.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[s.filtroBtn, filtro === cat && s.filtroBtnActivo]}
            onPress={() => setFiltro(cat)}
          >
            <Text style={[s.filtroText, filtro === cat && s.filtroTextActivo]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tabla header */}
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

      {/* Contenido */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={TEAL} />
        </View>
      ) : error ? (
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.primary} />
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchCompetidores}>
            <Text style={s.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : competidoresFiltrados.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="people-outline" size={40} color={colors.textSecondary} />
          <Text style={s.errorText}>No hay competidores en esta categoría</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
          {competidoresFiltrados.map((c, i) => (
            <View key={i} style={[s.fila, i % 2 === 0 && s.filaAlterna]}>
              <View style={s.colNombre}>
                <Text style={s.filaNombre} numberOfLines={1}>
                  {c.nombre} {c.apellido}
                </Text>
                {c.club && <Text style={s.filaClub}>{c.club}</Text>}
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
  container:       { flex: 1, backgroundColor: '#0D0D0D' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  titulo:          { color: colors.primary, fontSize: 18, fontWeight: '700' },
  subtitulo:       { color: colors.textSecondary, fontSize: 12 },
  filtrosRow:      { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filtroBtn:       { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A' },
  filtroBtnActivo: { backgroundColor: TEAL, borderColor: TEAL },
  filtroText:      { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  filtroTextActivo:{ color: '#1E1E1E', fontWeight: '700' },
  tablaHeader:     { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, borderRadius: 8, marginBottom: 4 },
  tablaHeaderText: { color: colors.white, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  colNombre:       { flex: 1 },
  colPeso:         { width: 70, alignItems: 'center' },
  colEdad:         { width: 50, alignItems: 'center' },
  scroll:          { flex: 1, paddingHorizontal: 16 },
  fila:            { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8 },
  filaAlterna:     { backgroundColor: '#1A1A1A' },
  filaNombre:      { color: colors.white, fontSize: 13, fontWeight: '600' },
  filaClub:        { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  filaTexto:       { color: colors.white, fontSize: 13, textAlign: 'center' },
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText:       { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  retryBtn:        { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 24 },
  retryText:       { color: colors.white, fontSize: 14, fontWeight: '700' },
});
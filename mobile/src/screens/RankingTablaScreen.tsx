import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RankingTabla'>;
  route: RouteProp<RootStackParamList, 'RankingTabla'>;
};

const COMPETIDORES = [
  { pos: 1,  nombre: 'Lucas Javier Guzmán Rojas',       puntaje: 97 },
  { pos: 2,  nombre: 'Juan Carlos Pérez Rodríguez',      puntaje: 93 },
  { pos: 3,  nombre: 'Luis Fernando Gómez Castillo',     puntaje: 90 },
  { pos: 4,  nombre: 'José Antonio Vargas López',        puntaje: 85 },
  { pos: 5,  nombre: 'Miguel Ángel Torres Rojas',        puntaje: 80 },
  { pos: 6,  nombre: 'Lucas Javier Guzmán Rojas',        puntaje: 77 },
  { pos: 7,  nombre: 'Mateo Adrian Costa Rivera',        puntaje: 75 },
  { pos: 8,  nombre: 'Carlos Alberto Mendoza Flores',    puntaje: 71 },
  { pos: 9,  nombre: 'Andrés Felipe Herrera Sánchez',    puntaje: 65 },
  { pos: 10, nombre: 'Diego Alejandro Cruz Morales',     puntaje: 62 },
  { pos: 11, nombre: 'Pablo Sebastián Ortiz Gutiérrez',  puntaje: 58 },
  { pos: 12, nombre: 'Ricardo Daniel Chávez Navarro',    puntaje: 55 },
  { pos: 13, nombre: 'Jorge Eduardo Ramírez Silva',      puntaje: 50 },
  { pos: 14, nombre: 'Fernando Javier Castro Paredes',   puntaje: 47 },
  { pos: 15, nombre: 'Mario Andrés Salazar Vega',        puntaje: 43 },
];

const medalColor = (pos: number) => {
  if (pos === 1) return '#FFD700';
  if (pos === 2) return '#C0C0C0';
  if (pos === 3) return '#CD7F32';
  return colors.textSecondary;
};

export default function RankingTablaScreen({ navigation, route }: Props) {
  const { categoria, genero, peso } = route.params;

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
        <Ionicons name="pencil-outline" size={22} color={colors.textSecondary} />
      </View>

      {/* ── Tabla ── */}
      <View style={s.tableHeader}>
        <Text style={[s.colHeader, { width: 50, textAlign: 'center' }]}>Pos.</Text>
        <Text style={[s.colHeader, { flex: 1 }]}>Nombre</Text>
        <Text style={[s.colHeader, { width: 70, textAlign: 'center' }]}>Score</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {COMPETIDORES.map((c, i) => (
          <View key={i} style={[s.fila, i % 2 === 0 && s.filaAlterna]}>
            <Text style={[s.posText, { width: 50, textAlign: 'center', color: medalColor(c.pos) }]}>
              {c.pos}
            </Text>
            <Text style={[s.nombreText, { flex: 1 }]} numberOfLines={1}>
              {c.nombre}
            </Text>
            <Text style={[s.puntajeText, { width: 70, textAlign: 'center' }]}>
              {c.puntaje}
            </Text>
          </View>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

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
  puntajeText:  { color: colors.white, fontSize: 14, fontWeight: '700' },
});
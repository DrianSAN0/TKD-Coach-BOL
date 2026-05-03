import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Resultados'>;
  route: RouteProp<RootStackParamList, 'Resultados'>;
};

const HISTORIAL = [
  { nombre: 'Poomsae 6 – Yook Chang', fecha: '14 de abril',  puntaje: 6.5 },
  { nombre: 'Poomsae 8 – Pal Chang',  fecha: '9 de abril',   puntaje: 7.1 },
  { nombre: 'Poomsae 11 – Taebek',    fecha: '5 de abril',   puntaje: 7.9 },
  { nombre: 'Poomsae 6 – Yook Chang', fecha: '2 de abril',   puntaje: 6.2 },
  { nombre: 'Poomsae – Koryo',        fecha: '2 de abril',   puntaje: 7.3 },
  { nombre: 'Poomsae – Taeback',      fecha: '27 de marzo',  puntaje: 6.1 },
];

export default function ResultadosScreen({ navigation, route }: Props) {
  const { score, poomsae, framesCount } = route.params;

  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="chevron-back" size={24} color="#E93735" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Resultados</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ── Score + Poomsae ── */}
      <View style={s.scoreRow}>
        <View style={s.scoreCircleWrap}>
          <Text style={s.scoreSub}>Puntuación</Text>
          <View style={s.scoreCircle}>
            <Text style={s.scoreNum}>{score.toFixed(1)}</Text>
          </View>
        </View>
        <View style={s.poomsaeTag}>
          <Text style={s.poomsaeNombre}>{poomsae || 'Poomsae'}</Text>
          <Text style={s.poomsaeNivel}>7 Poomsae</Text>
        </View>
      </View>

      {/* ── Historial ── */}
      <Text style={s.historialTitulo}>Historial</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {HISTORIAL.map((item, i) => (
          <View key={i} style={s.historialItem}>
            <View style={s.numCircle}>
              <Text style={s.numText}>{i + 1}</Text>
            </View>
            <View style={s.itemInfo}>
              <Text style={s.itemNombre}>{item.nombre}</Text>
              <Text style={s.itemFecha}>Fecha: {item.fecha}</Text>
            </View>
            <View style={s.puntajeWrap}>
              <Text style={s.puntajeLabel}>Puntuación</Text>
              <Text style={s.puntajeNum}>{item.puntaje.toFixed(1)}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#1E1E1E' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle:     { color: '#E93735', fontSize: 22, fontWeight: '700' },
  scoreRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 20 },
  scoreCircleWrap: { alignItems: 'center', gap: 4 },
  scoreSub:        { color: '#E93735', fontSize: 12, fontWeight: '600' },
  scoreCircle:     { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#E93735', alignItems: 'center', justifyContent: 'center' },
  scoreNum:        { color: '#fff', fontSize: 32, fontWeight: '700' },
  poomsaeTag:      { backgroundColor: '#5BBEBB', borderRadius: 30, paddingHorizontal: 22, paddingVertical: 14, flex: 1, alignItems: 'center' },
  poomsaeNombre:   { color: '#1E1E1E', fontSize: 16, fontWeight: '700' },
  poomsaeNivel:    { color: '#1E1E1E', fontSize: 12, marginTop: 2 },
  historialTitulo: { color: '#5BBEBB', fontSize: 24, fontWeight: '700', paddingHorizontal: 20, marginBottom: 12 },
  scroll:          { flex: 1, paddingHorizontal: 20 },
  historialItem:   { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  numCircle:       { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E93735', alignItems: 'center', justifyContent: 'center' },
  numText:         { color: '#fff', fontSize: 20, fontWeight: '700' },
  itemInfo:        { flex: 1 },
  itemNombre:      { color: '#fff', fontSize: 15, fontWeight: '700' },
  itemFecha:       { color: '#CFCFCF', fontSize: 12, marginTop: 3 },
  puntajeWrap:     { alignItems: 'flex-end' },
  puntajeLabel:    { color: '#CFCFCF', fontSize: 10 },
  puntajeNum:      { color: '#E93735', fontSize: 20, fontWeight: '700' },
});
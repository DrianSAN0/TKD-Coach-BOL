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

const TEAL = '#5BBEBB';
const RED  = '#E93735';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DetalleAnalisis'>;
  route: RouteProp<RootStackParamList, 'DetalleAnalisis'>;
};

const REGLAS_WT = [
  { criterio: 'Postura base',        peso: 0.5, descripcion: 'Posición de pies y cuerpo incorrecta' },
  { criterio: 'Técnica de mano',     peso: 0.3, descripcion: 'Puñetazos o bloqueos imprecisos' },
  { criterio: 'Técnica de pie',      peso: 0.3, descripcion: 'Patadas con poca altura o precisión' },
  { criterio: 'Equilibrio',          peso: 0.5, descripcion: 'Pérdida de balance durante el poomsae' },
  { criterio: 'Ritmo y velocidad',   peso: 0.3, descripcion: 'Tempo inconsistente entre movimientos' },
  { criterio: 'Expresión de energía',peso: 0.2, descripcion: 'Falta de Ki-hap o potencia en movimientos' },
];

const getColor = (score: number) => {
  if (score >= 8.5) return '#4ADE80';
  if (score >= 7.0) return '#F0C040';
  if (score >= 5.0) return '#FB923C';
  return RED;
};

const getIcon = (obs: string) => {
  if (obs === 'Excelente') return 'checkmark-circle';
  if (obs === 'Bien') return 'checkmark-circle-outline';
  if (obs === 'Aceptable') return 'warning-outline';
  return 'close-circle';
};

export default function DetalleAnalisisScreen({ navigation, route }: Props) {
  const { item } = route.params;
  const detalles = item.detalles || [];
  const scoreColor = getColor(item.score);

  // Calcular deducciones por segmento
  const deducciones = detalles.filter((d: any) => d.puntuacion < 7.0);
  const puntosDescontados = detalles.reduce((acc: number, d: any) => {
    return acc + (d.puntuacion < 7.0 ? (7.0 - d.puntuacion) * 0.3 : 0);
  }, 0);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={RED} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalle del análisis</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Score + Info */}
        <View style={s.scoreCard}>
          <View style={[s.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[s.scoreNum, { color: scoreColor }]}>{item.score.toFixed(1)}</Text>
          </View>
          <View style={s.scoreInfo}>
            <Text style={s.poomsaeNombre}>{item.poomsae}</Text>
            <Text style={s.fecha}>Fecha: {item.fecha}</Text>
            <Text style={s.frames}>{item.framesCount} frames analizados</Text>
          </View>
        </View>

        {/* Resumen deducciones */}
        {puntosDescontados > 0 && (
          <View style={s.deduccionCard}>
            <Ionicons name="alert-circle" size={24} color={RED} />
            <View style={{ flex: 1 }}>
              <Text style={s.deduccionTitulo}>Puntos descontados</Text>
              <Text style={s.deduccionDesc}>
                Se detectaron {deducciones.length} segmento(s) con técnica a mejorar,
                resultando en aproximadamente -{puntosDescontados.toFixed(1)} puntos.
              </Text>
            </View>
          </View>
        )}

        {/* Criterios WT */}
        <Text style={s.seccionTitulo}>Criterios World Taekwondo</Text>
        {REGLAS_WT.map((r, i) => (
          <View key={i} style={s.reglaItem}>
            <View style={s.reglaPunto} />
            <View style={{ flex: 1 }}>
              <Text style={s.reglaCriterio}>{r.criterio} <Text style={s.reglaPeso}>(-{r.peso} pts)</Text></Text>
              <Text style={s.reglaDesc}>{r.descripcion}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#0D0D0D' },
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle:        { color: RED, fontSize: 18, fontWeight: '700' },
  scroll:             { paddingHorizontal: 20, paddingTop: 8 },
  scoreCard:          { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#1A1A1A', borderRadius: 20, padding: 16, marginBottom: 16 },
  scoreCircle:        { width: 70, height: 70, borderRadius: 35, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D0D0D' },
  scoreNum:           { fontSize: 22, fontWeight: '900' },
  scoreInfo:          { flex: 1 },
  poomsaeNombre:      { color: '#fff', fontSize: 16, fontWeight: '700' },
  fecha:              { color: '#888', fontSize: 12, marginTop: 2 },
  frames:             { color: '#666', fontSize: 11, marginTop: 2 },
  deduccionCard:      { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#2A1A1A', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#4A2A2A' },
  deduccionTitulo:    { color: RED, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  deduccionDesc:      { color: '#CFCFCF', fontSize: 12, lineHeight: 18 },
  seccionTitulo:      { color: TEAL, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  segmentoCard:       { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  segmentoCardError:  { borderColor: '#4A2A2A', backgroundColor: '#1E1414' },
  segmentoHeader:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  segmentoNombre:     { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700' },
  segmentoPuntaje:    { fontSize: 18, fontWeight: '900' },
  segmentoObs:        { fontSize: 12, fontWeight: '600', marginLeft: 32 },
  errorDetalle:       { backgroundColor: '#2A1A1A', borderRadius: 10, padding: 10, marginTop: 8 },
  errorDetalleText:   { color: '#CFCFCF', fontSize: 12, lineHeight: 18 },
  reglaItem:          { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  reglaPunto:         { width: 8, height: 8, borderRadius: 4, backgroundColor: TEAL, marginTop: 5 },
  reglaCriterio:      { color: '#fff', fontSize: 13, fontWeight: '700' },
  reglaPeso:          { color: RED, fontSize: 12 },
  reglaDesc:          { color: '#888', fontSize: 12, marginTop: 2 },
  emptyWrap:          { alignItems: 'center', paddingTop: 30, gap: 10 },
  emptyText:          { color: '#555', fontSize: 14 },
});
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

const TEAL = '#5BBEBB';
const RED  = '#E93735';
const STORAGE_KEY = 'tkd_historial';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Resultados'>;
  route: RouteProp<RootStackParamList, 'Resultados'>;
};

type HistorialItem = {
  poomsae: string;
  score: number;
  fecha: string;
  framesCount: number;
  detalles?: any[];
};

export default function ResultadosScreen({ navigation, route }: Props) {
  const { score, poomsae, framesCount, guardar, detalles } = route.params;
  const [historial, setHistorial] = useState<HistorialItem[]>([]);

  useEffect(() => {
    guardarYCargar();
  }, []);

  const guardarYCargar = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const prev: HistorialItem[] = raw ? JSON.parse(raw) : [];

      if (guardar) {
        const nuevo: HistorialItem = {
          poomsae: poomsae || 'Poomsae',
          score,
          framesCount,
          detalles: detalles || [],
          fecha: new Date().toLocaleDateString('es-BO', {
            day: 'numeric', month: 'long', year: 'numeric'
          }),
        };
        const actualizado = [nuevo, ...prev];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actualizado));
        setHistorial(actualizado);
      } else {
        setHistorial(prev);
      }
    } catch (e) {
      console.error('Error guardando historial:', e);
    }
  };

  const scoreColor = score >= 8.5 ? TEAL : score >= 7 ? '#F0C040' : RED;

  return (
    <SafeAreaView style={s.container}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="chevron-back" size={24} color={RED} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Resultados</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Score + Poomsae */}
      <View style={s.scoreRow}>
        <View style={s.scoreCircleWrap}>
          <Text style={s.scoreSub}>Puntuación</Text>
          <View style={[s.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[s.scoreNum, { color: scoreColor }]}>{score.toFixed(1)}</Text>
          </View>
        </View>
        <View style={s.poomsaeTag}>
          <Text style={s.poomsaeNombre}>{poomsae || 'Poomsae'}</Text>
          <Text style={s.poomsaeNivel}>{framesCount} frames analizados</Text>
        </View>
      </View>

      {/* Historial */}
      <Text style={s.historialTitulo}>Historial</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {historial.length === 0 ? (
          <View style={s.emptyWrap}>
            <Ionicons name="time-outline" size={40} color="#444" />
            <Text style={s.emptyText}>No hay análisis previos</Text>
          </View>
        ) : (
          historial.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={s.historialItem}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DetalleAnalisis', { item })}
            >
              <View style={s.numCircle}>
                <Text style={s.numText}>{i + 1}</Text>
              </View>
              <View style={s.itemInfo}>
                <Text style={s.itemNombre}>{item.poomsae}</Text>
                <Text style={s.itemFecha}>Fecha: {item.fecha}</Text>
              </View>
              <View style={s.puntajeWrap}>
                <Text style={s.puntajeLabel}>Puntuación</Text>
                <Text style={s.puntajeNum}>{item.score.toFixed(1)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0D0D0D' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle:     { color: RED, fontSize: 20, fontWeight: '700' },
  scoreRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 16 },
  scoreCircleWrap: { alignItems: 'center', gap: 4 },
  scoreSub:        { color: RED, fontSize: 11, fontWeight: '600' },
  scoreCircle:     { width: 72, height: 72, borderRadius: 36, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A' },
  scoreNum:        { fontSize: 24, fontWeight: '900' },
  poomsaeTag:      { flex: 1, backgroundColor: TEAL, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 },
  poomsaeNombre:   { color: '#fff', fontSize: 16, fontWeight: '800' },
  poomsaeNivel:    { color: '#D0F0EF', fontSize: 12, marginTop: 4 },
  historialTitulo: { color: '#fff', fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 12 },
  scroll:          { flex: 1, paddingHorizontal: 20 },
  emptyWrap:       { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 12 },
  emptyText:       { color: '#555', fontSize: 14 },
  historialItem:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 16, padding: 14, marginBottom: 10, gap: 12 },
  numCircle:       { width: 38, height: 38, borderRadius: 19, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  numText:         { color: '#fff', fontSize: 15, fontWeight: '800' },
  itemInfo:        { flex: 1 },
  itemNombre:      { color: '#fff', fontSize: 14, fontWeight: '700' },
  itemFecha:       { color: '#888', fontSize: 12, marginTop: 2 },
  puntajeWrap:     { alignItems: 'flex-end' },
  puntajeLabel:    { color: '#888', fontSize: 10 },
  puntajeNum:      { color: RED, fontSize: 18, fontWeight: '800' },
});
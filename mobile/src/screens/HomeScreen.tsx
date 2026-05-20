import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';
import MiniCalendar from '../components/MiniCalendar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const TEAL = '#5BBEBB';
const RED  = '#E93735';
const { width } = Dimensions.get('window');

const NOTICIAS = [
  { id: '1', imagen: require('../../assets/ranking2.jpeg'),     titulo: '2do Ranking Nacional Tarija 2026', fecha: 'Abril 2026' },
  { id: '2', imagen: require('../../assets/ranking1.jpeg'),     titulo: 'I Ranking Nacional Santa Cruz',    fecha: 'Marzo 2026' },
  { id: '3', imagen: require('../../assets/noticiasbol1.jpeg'), titulo: 'Taekwondo Bolivia',                fecha: 'Mayo 2026'  },
];

export default function HomeScreen({ navigation }: Props) {
  const [ultimoAnalisis, setUltimoAnalisis] = useState<any>(null);

  useEffect(() => {
    const cargar = async () => {
      const raw = await AsyncStorage.getItem('tkd_historial');
      if (raw) {
        const historial = JSON.parse(raw);
        if (historial.length > 0) setUltimoAnalisis(historial[0]);
      }
    };
    cargar();
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── HEADER ── */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.avatar}>
                <Ionicons name="person" size={26} color={TEAL} />
              </View>
              <View>
                <Text style={s.headerTitle}>Hola, Atleta</Text>
                <Text style={s.headerSubtitle}>¿Qué haremos hoy?</Text>
              </View>
            </View>
            <View style={s.headerRight}>
              <TouchableOpacity style={s.iconBtn}>
                <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={s.iconBtn}>
                <Ionicons name="notifications-outline" size={26} color="#fff" />
                <View style={s.notifDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── NOTICIAS ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Noticias</Text>
            <FlatList
              data={NOTICIAS}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              snapToAlignment="center"
              decelerationRate="fast"
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.85} style={s.noticiaCard}>
                  <Image source={item.imagen} style={s.noticiaImg} resizeMode="cover" />
                  <View style={s.noticiaOverlay}>
                    <Text style={s.noticiaTitulo}>{item.titulo}</Text>
                    <Text style={s.noticiaFecha}>{item.fecha}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

{/* ── PROGRESO ── */}
<View style={s.section}>
  <View style={s.sectionRow}>
    <Text style={s.sectionTitle}>Progreso</Text>
    <TouchableOpacity style={s.verMasRow} onPress={() => ultimoAnalisis && navigation.navigate('Resultados', {
      score: ultimoAnalisis.score,
      poomsae: ultimoAnalisis.poomsae,
      framesCount: ultimoAnalisis.framesCount,
    })}>
      <Text style={s.verMas}>Ver más</Text>
      <Ionicons name="chevron-forward" size={16} color={RED} />
    </TouchableOpacity>
  </View>

  {ultimoAnalisis ? (
    <TouchableOpacity style={s.progressCard} onPress={() => navigation.navigate('Resultados', {
      score: ultimoAnalisis.score,
      poomsae: ultimoAnalisis.poomsae,
      framesCount: ultimoAnalisis.framesCount,
    })} activeOpacity={0.85}>
      <View style={s.rankRow}>
        <View style={s.rankBadge}>
          <Text style={s.rankNum}>{ultimoAnalisis.score.toFixed(1)}</Text>
        </View>
        <View style={s.rankInfo}>
          <Text style={s.rankPoomsae}>{ultimoAnalisis.poomsae}</Text>
          <Text style={s.rankFecha}>Fecha: {ultimoAnalisis.fecha}</Text>
        </View>
        <View style={s.scoreBox}>
          <Text style={s.scoreLabel}>Puntuación</Text>
          <Text style={s.scoreValue}>{ultimoAnalisis.score.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ) : (
    <View style={s.emptyProgreso}>
      <Ionicons name="analytics-outline" size={40} color="#444" />
      <Text style={s.emptyProgresoText}>Aún no tienes análisis</Text>
      <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('ScannerInicial')}>
        <Text style={s.emptyBtnText}>Comenzar análisis</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

          {/* ── CALENDARIO ── */}
          <View style={s.section}>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Calendario</Text>
              <TouchableOpacity style={s.verMasRow} onPress={() => navigation.navigate('Calendar')}>
                <Text style={s.verMas}>Ver más</Text>
                <Ionicons name="chevron-forward" size={16} color={RED} />
              </TouchableOpacity>
            </View>
            <View style={s.calCard}>
              <MiniCalendar />
            </View>
          </View>

        </ScrollView>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: '#0D0D0D' },
  container:         { flex: 1, backgroundColor: '#0D0D0D' },
  scroll:            { paddingTop: 6, paddingHorizontal: 18, paddingBottom: 20 },
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26, minHeight: 72 },
  headerLeft:        { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar:            { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A2E2E', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 2, borderColor: TEAL },
  headerTitle:       { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSubtitle:    { color: '#9A9A9A', fontSize: 14, marginTop: 2 },
  headerRight:       { flexDirection: 'row', alignItems: 'center' },
  iconBtn:           { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  notifDot:          { position: 'absolute', top: 5, right: 5, width: 9, height: 9, borderRadius: 5, backgroundColor: RED },
  section:           { marginBottom: 26 },
  sectionRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle:      { color: TEAL, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  verMasRow:         { flexDirection: 'row', alignItems: 'center', gap: 2 },
  verMas:            { color: RED, fontSize: 14, fontWeight: '600' },
  noticiaCard:       { width: width - 36, height: 200, borderRadius: 20, overflow: 'hidden', marginRight: 12 },
  noticiaImg:        { width: '100%', height: '100%' },
  noticiaOverlay:    { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', padding: 14, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  noticiaTitulo:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  noticiaFecha:      { color: TEAL, fontSize: 12, marginTop: 2 },
  progressCard:      { backgroundColor: TEAL, borderRadius: 22, paddingVertical: 20, paddingHorizontal: 18 },
  rankRow:           { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rankBadge:         { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  rankNum:           { color: TEAL, fontSize: 22, fontWeight: '900' },
  rankInfo:          { flex: 1 },
  rankPoomsae:       { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  rankFecha:         { color: '#D0F0EF', fontSize: 13 },
  scoreBox:          { alignItems: 'flex-end' },
  scoreLabel:        { color: '#D0F0EF', fontSize: 11, marginBottom: 2 },
  scoreValue:        { color: '#fff', fontSize: 26, fontWeight: '900' },
  calCard:           { backgroundColor: '#1F1F1F', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  emptyProgreso:     { backgroundColor: '#1A1A1A', borderRadius: 22, paddingVertical: 30, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#2A2A2A' },
  emptyProgresoText: { color: '#555', fontSize: 14 },
  emptyBtn:          { backgroundColor: RED, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 24, marginTop: 4 },
  emptyBtnText:      { color: '#fff', fontSize: 14, fontWeight: '700' },
});
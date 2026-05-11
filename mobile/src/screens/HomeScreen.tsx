import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';
import MiniCalendar from '../components/MiniCalendar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const TEAL = '#5BBEBB';
const RED  = '#E93735';

export default function HomeScreen({ navigation }: Props) {
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
            <TouchableOpacity style={s.newsCard} activeOpacity={0.85}>
              <View style={s.newsImageBox}>
                <Ionicons name="newspaper-outline" size={48} color={TEAL} />
              </View>
              <View style={s.newsContent}>
                <Text style={s.newsTitle}>Campeonato Nacional de Taekwondo 2026</Text>
                <Text style={s.newsDesc}>Próximas fechas y categorías disponibles para inscripción.</Text>
                <Text style={s.newsDate}>Abril 2026</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ── PROGRESO ── */}
          <View style={s.section}>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Progreso</Text>
              <TouchableOpacity style={s.verMasRow}>
                <Text style={s.verMas}>Ver más</Text>
                <Ionicons name="chevron-forward" size={16} color={RED} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.progressCard} onPress={() => navigation.navigate('ScannerInicial')} activeOpacity={0.85}>
              <View style={s.rankRow}>
                <View style={s.rankBadge}>
                  <Text style={s.rankNum}>1</Text>
                </View>
                <View style={s.rankInfo}>
                  <Text style={s.rankPoomsae}>Poomsae 6 – Yook Chang</Text>
                  <Text style={s.rankFecha}>Fecha: 14 de abril</Text>
                </View>
                <View style={s.scoreBox}>
                  <Text style={s.scoreLabel}>Puntuación</Text>
                  <Text style={s.scoreValue}>6.5</Text>
                </View>
              </View>
            </TouchableOpacity>
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
  safe:           { flex: 1, backgroundColor: '#0D0D0D' },
  container:      { flex: 1, backgroundColor: '#0D0D0D' },
  scroll:         { paddingTop: 6, paddingHorizontal: 18, paddingBottom: 20 },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26, minHeight: 72 },
  headerLeft:     { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar:         { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A2E2E', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 2, borderColor: TEAL },
  headerTitle:    { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#9A9A9A', fontSize: 14, marginTop: 2 },
  headerRight:    { flexDirection: 'row', alignItems: 'center' },
  iconBtn:        { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  notifDot:       { position: 'absolute', top: 5, right: 5, width: 9, height: 9, borderRadius: 5, backgroundColor: RED },
  section:        { marginBottom: 26 },
  sectionRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle:   { color: TEAL, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  verMasRow:      { flexDirection: 'row', alignItems: 'center', gap: 2 },
  verMas:         { color: RED, fontSize: 14, fontWeight: '600' },
  newsCard:       { backgroundColor: '#1F1F1F', borderRadius: 22, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A' },
  newsImageBox:   { width: 110, minHeight: 150, backgroundColor: '#1A2E2E', alignItems: 'center', justifyContent: 'center' },
  newsContent:    { flex: 1, paddingVertical: 22, paddingHorizontal: 18, justifyContent: 'center' },
  newsTitle:      { color: '#fff', fontSize: 17, fontWeight: '700', lineHeight: 24, marginBottom: 10 },
  newsDesc:       { color: '#C6C6C6', fontSize: 13.5, lineHeight: 21, marginBottom: 16 },
  newsDate:       { color: TEAL, fontSize: 13, fontWeight: '700' },
  progressCard:   { backgroundColor: TEAL, borderRadius: 22, paddingVertical: 20, paddingHorizontal: 18 },
  rankRow:        { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rankBadge:      { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  rankNum:        { color: TEAL, fontSize: 26, fontWeight: '900' },
  rankInfo:       { flex: 1 },
  rankPoomsae:    { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  rankFecha:      { color: '#f0d0d0', fontSize: 13 },
  scoreBox:       { alignItems: 'flex-end' },
  scoreLabel:     { color: '#f0d4d0', fontSize: 11, marginBottom: 2 },
  scoreValue:     { color: '#fff', fontSize: 26, fontWeight: '900' },
  calCard:        { backgroundColor: '#1F1F1F', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 16, borderWidth: 1, borderColor: '#2A2A2A' },
});
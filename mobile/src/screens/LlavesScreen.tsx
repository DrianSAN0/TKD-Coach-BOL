import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Llaves'>;
  route: RouteProp<RootStackParamList, 'Llaves'>;
};

const { width } = Dimensions.get('window');

// Colores de los clubes en el bracket
const C_ROJO   = '#E93735';
const C_AZUL   = '#121F63';
const C_GRIS   = '#7C7C7C';

type Competidor = {
  nombre: string;
  club: string;
  color: string;
};

type Partido = {
  a: Competidor;
  b: Competidor;
  ganador?: 'a' | 'b';
};

// Datos de ejemplo — después vendrán de la BD
const PARTIDOS_R1: Partido[] = [
  { a: { nombre: 'Lucas Guzman',    club: 'Club Kundo Kwang', color: C_ROJO }, b: { nombre: 'Diego Cruz',      club: 'Club Kundo Kwang', color: C_AZUL }, ganador: 'a' },
  { a: { nombre: 'Fernando Sdvl',   club: 'Club Kundo Kwang', color: C_ROJO }, b: { nombre: 'Erick Ortiz',     club: 'Club Kundo Kwang', color: C_AZUL }, ganador: 'a' },
  { a: { nombre: 'Mateo Costa',     club: 'Club Kundo Kwang', color: C_ROJO }, b: { nombre: 'Leonel Vargas',   club: 'Club Kundo Kwang', color: C_AZUL }, ganador: 'a' },
  { a: { nombre: 'Jose Vargas',     club: 'Club Kundo Kwang', color: C_ROJO }, b: { nombre: 'Miguel Torres',   club: 'Club Kundo Kwang', color: C_AZUL }, ganador: 'b' },
];

const PARTIDOS_R2: Partido[] = [
  { a: { nombre: 'Lucas Guzman',  club: 'Club Kundo Kwang', color: C_ROJO }, b: { nombre: 'Fernando Sdvl', club: 'Club Kundo Kwang', color: C_AZUL }, ganador: 'a' },
  { a: { nombre: 'Mateo Costa',   club: 'Club Kundo Kwang', color: C_ROJO }, b: { nombre: 'Miguel Torres', club: 'Club Kundo Kwang', color: C_AZUL }, ganador: 'a' },
];

const PARTIDO_FINAL: Partido = {
  a: { nombre: 'Lucas Guzman', club: 'Club Kundo Kwang', color: C_ROJO },
  b: { nombre: 'Mateo Costa',  club: 'Club Kundo Kwang', color: C_GRIS },
  ganador: 'a',
};

function TarjetaJugador({ comp, ganador }: { comp: Competidor; ganador: boolean }) {
  return (
    <View style={[s.tarjeta, ganador && s.tarjetaGanador]}>
      <View style={[s.barraColor, { backgroundColor: comp.color }]} />
      <View style={s.tarjetaInfo}>
        <Text style={s.tarjetaNombre} numberOfLines={1}>{comp.nombre}</Text>
        <Text style={s.tarjetaClub} numberOfLines={1}>{comp.club}</Text>
      </View>
    </View>
  );
}

function PartidoCard({ partido }: { partido: Partido }) {
  return (
    <View style={s.partidoWrap}>
      <TarjetaJugador comp={partido.a} ganador={partido.ganador === 'a'} />
      <View style={s.vs}><Text style={s.vsText}>vs</Text></View>
      <TarjetaJugador comp={partido.b} ganador={partido.ganador === 'b'} />
    </View>
  );
}

export default function LlavesScreen({ navigation, route }: Props) {
  const { categoria, genero } = route.params;

  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={s.titulo}>Llave de Competencia</Text>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Info ── */}
      <View style={s.infoRow}>
        <View style={s.badge}>
          <Text style={s.badgeText}>Cinturon Negro</Text>
        </View>
      </View>
      <View style={s.categoriaRow}>
        <Text style={s.categoriaText}>{categoria || 'Categoria -58kg'}</Text>
        <View style={s.separador} />
        <Text style={s.categoriaText}>{genero || 'Masculino'}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Ronda 1 ── */}
        <Text style={s.rondaTitulo}>Ronda 1</Text>
        {PARTIDOS_R1.map((p, i) => (
          <PartidoCard key={i} partido={p} />
        ))}

        {/* ── Ronda 2 ── */}
        <Text style={s.rondaTitulo}>Semifinales</Text>
        {PARTIDOS_R2.map((p, i) => (
          <PartidoCard key={i} partido={p} />
        ))}

        {/* ── Final ── */}
        <Text style={s.rondaTitulo}>Final</Text>
        <PartidoCard partido={PARTIDO_FINAL} />

        {/* ── Ganador ── */}
        <View style={s.ganadorCard}>
          <Ionicons name="trophy" size={36} color="#FFD700" />
          <Text style={s.ganadorTitulo}>Campeon</Text>
          <Text style={s.ganadorNombre}>{PARTIDO_FINAL.ganador === 'a' ? PARTIDO_FINAL.a.nombre : PARTIDO_FINAL.b.nombre}</Text>
          <Text style={s.ganadorClub}>{PARTIDO_FINAL.ganador === 'a' ? PARTIDO_FINAL.a.club : PARTIDO_FINAL.b.club}</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#1E1E1E' },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  titulo:         { color: '#5BBEBB', fontSize: 20, fontWeight: '700' },
  infoRow:        { paddingHorizontal: 20, marginBottom: 4 },
  badge:          { backgroundColor: colors.primary, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText:      { color: '#1E1E1E', fontSize: 12, fontWeight: '700' },
  categoriaRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12, gap: 8 },
  categoriaText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  separador:      { width: 1, height: 18, backgroundColor: '#fff' },
  scroll:         { paddingHorizontal: 16 },
  rondaTitulo:    { color: '#5BBEBB', fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  partidoWrap:    { backgroundColor: '#2A2A2A', borderRadius: 12, padding: 12, marginBottom: 10, gap: 6, borderWidth: 1, borderColor: '#3A3A3A' },
  tarjeta:        { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 6, overflow: 'hidden', height: 36 },
  tarjetaGanador: { borderWidth: 1.5, borderColor: '#FFD700' },
  barraColor:     { width: 10, height: '100%' },
  tarjetaInfo:    { flex: 1, paddingHorizontal: 8, justifyContent: 'center' },
  tarjetaNombre:  { color: '#000', fontSize: 9, fontWeight: '700' },
  tarjetaClub:    { color: '#7C7C7C', fontSize: 7 },
  vs:             { alignItems: 'center' },
  vsText:         { color: '#7C7C7C', fontSize: 10, fontWeight: '700' },
  ganadorCard:    { backgroundColor: '#2A2A2A', borderRadius: 16, padding: 20, alignItems: 'center', gap: 6, marginTop: 16, borderWidth: 1, borderColor: '#FFD700' },
  ganadorTitulo:  { color: '#FFD700', fontSize: 16, fontWeight: '700' },
  ganadorNombre:  { color: '#fff', fontSize: 18, fontWeight: '700' },
  ganadorClub:    { color: '#7C7C7C', fontSize: 12 },
});
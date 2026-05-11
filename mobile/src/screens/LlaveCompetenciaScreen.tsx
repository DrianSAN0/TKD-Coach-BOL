import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LlaveCompetencia'>;
  route: RouteProp<RootStackParamList, 'LlaveCompetencia'>;
};

const COMPETIDORES_MOCK = [
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
  { nombre: 'Mateo Costa', club: 'Club Kundo Kwang' },
];

type Partido = {
  izq: { nombre: string; club: string } | null;
  der: { nombre: string; club: string } | null;
  ganador?: { nombre: string; club: string } | null;
};

function TarjetaCompetidor({ competidor, color }: { competidor: { nombre: string; club: string } | null; color?: string }) {
  if (!competidor) return <View style={t.tarjetaVacia} />;
  return (
    <View style={t.tarjeta}>
      {color && <View style={[t.colorBar, { backgroundColor: color }]} />}
      <View style={t.tarjetaInfo}>
        <Text style={t.tarjetaNombre} numberOfLines={1}>{competidor.nombre}</Text>
        <Text style={t.tarjetaClub} numberOfLines={1}>{competidor.club}</Text>
      </View>
    </View>
  );
}

export default function LlaveCompetenciaScreen({ navigation, route }: Props) {
  const { categoria, genero } = route.params as any;

  // Ronda 1: 4 partidos (8 competidores)
  const ronda1: Partido[] = [
    { izq: COMPETIDORES_MOCK[0], der: COMPETIDORES_MOCK[1], ganador: COMPETIDORES_MOCK[0] },
    { izq: COMPETIDORES_MOCK[2], der: COMPETIDORES_MOCK[3], ganador: COMPETIDORES_MOCK[2] },
    { izq: COMPETIDORES_MOCK[4], der: COMPETIDORES_MOCK[5], ganador: COMPETIDORES_MOCK[4] },
    { izq: COMPETIDORES_MOCK[6], der: COMPETIDORES_MOCK[7], ganador: null },
  ];

  // Semifinal
  const semi: Partido[] = [
    { izq: ronda1[0].ganador ?? null, der: ronda1[1].ganador ?? null, ganador: ronda1[0].ganador ?? null },
    { izq: ronda1[2].ganador ?? null, der: ronda1[3].ganador ?? null, ganador: ronda1[2].ganador ?? null },
  ];

  // Final
  const final: Partido = {
    izq: semi[0].ganador ?? null,
    der: semi[1].ganador ?? null,
    ganador: null,
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={s.titulo}>Llave de Competencia</Text>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={s.subHeader}>
        <View style={s.badge}>
          <Text style={s.badgeText}>Cinturón Negro</Text>
        </View>
        <Text style={s.subInfo}>Categoría {categoria ?? '-58kg'}</Text>
        <View style={s.divider} />
        <Text style={s.subInfo}>{genero ?? 'Masculino'}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.bracket}>

        {/* Ronda 1 */}
        <View style={s.ronda}>
          {ronda1.map((p, i) => (
            <View key={i} style={s.partido}>
              <TarjetaCompetidor competidor={p.izq} color="#E93735" />
              <View style={s.lineaH} />
              <TarjetaCompetidor competidor={p.der} color="#1A237E" />
            </View>
          ))}
        </View>

        {/* Conectores R1 → Semi */}
        <View style={s.conectores}>
          {[0, 1].map(i => (
            <View key={i} style={s.conectoresGroup}>
              <View style={s.lineaConector} />
              <View style={s.lineaVertical} />
              <View style={s.lineaConector} />
            </View>
          ))}
        </View>

        {/* Semifinal */}
        <View style={[s.ronda, { justifyContent: 'space-around' }]}>
          {semi.map((p, i) => (
            <View key={i} style={s.partido}>
              <TarjetaCompetidor competidor={p.izq} color="#E93735" />
              <View style={s.lineaH} />
              <TarjetaCompetidor competidor={p.der} color="#1A237E" />
            </View>
          ))}
        </View>

        {/* Conectores Semi → Final */}
        <View style={[s.conectores, { justifyContent: 'center' }]}>
          <View style={s.conectoresGroup}>
            <View style={s.lineaConector} />
            <View style={[s.lineaVertical, { height: 80 }]} />
            <View style={s.lineaConector} />
          </View>
        </View>

        {/* Final */}
        <View style={[s.ronda, { justifyContent: 'center' }]}>
          <View style={s.partido}>
            <TarjetaCompetidor competidor={final.izq} color="#E93735" />
            <View style={s.lineaH} />
            <TarjetaCompetidor competidor={final.der} color="#1A237E" />
          </View>
        </View>

        {/* Ganador */}
        <View style={[s.ronda, { justifyContent: 'center' }]}>
          <View style={s.ganadorCard}>
            <TarjetaCompetidor competidor={final.ganador ?? null} />
          </View>
        </View>

      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#0D0D0D' },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  titulo:     { color: colors.primary, fontSize: 20, fontWeight: '700' },
  subHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 12 },
  badge:      { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  badgeText:  { color: colors.white, fontSize: 12, fontWeight: '700' },
  subInfo:    { color: colors.white, fontSize: 14, fontWeight: '600' },
  divider:    { width: 1, height: 16, backgroundColor: colors.textSecondary },
  bracket:    { paddingHorizontal: 16, paddingVertical: 20, alignItems: 'center' },
  ronda:      { flexDirection: 'column', justifyContent: 'space-between', gap: 16, marginHorizontal: 4 },
  partido:    { gap: 2 },
  conectores: { flexDirection: 'column', justifyContent: 'space-between', marginHorizontal: 4 },
  conectoresGroup: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lineaH:     { height: 2, width: 10, backgroundColor: '#444' },
  lineaConector: { height: 2, width: 16, backgroundColor: '#444' },
  lineaVertical: { width: 2, height: 40, backgroundColor: '#444' },
  ganadorCard: { borderWidth: 1, borderColor: colors.primary, borderRadius: 8, padding: 4 },
});

const t = StyleSheet.create({
  tarjeta:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 6, width: 130, height: 38, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A' },
  tarjetaVacia: { width: 130, height: 38, backgroundColor: '#1A1A1A', borderRadius: 6, borderWidth: 1, borderColor: '#2A2A2A' },
  colorBar:    { width: 6, height: '100%' },
  tarjetaInfo: { flex: 1, paddingHorizontal: 6 },
  tarjetaNombre: { color: colors.white, fontSize: 11, fontWeight: '700' },
  tarjetaClub:   { color: colors.textSecondary, fontSize: 9 },
});
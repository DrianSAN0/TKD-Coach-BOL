import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ListaPoomsae'>;
};

const POOMSAES = [
  { nombre: 'Taegeuk Yuk Jang',  nivel: '6 Poomsae'     },
  { nombre: 'Taegeuk Chil Jang', nivel: '7 Poomsae'     },
  { nombre: 'Taegeuk Pal Jang',  nivel: '8 Poomsae'     },
  { nombre: 'Koryo',             nivel: '1º Dan Poomsae' },
  { nombre: 'Keumgang',          nivel: '2º Dan Poomsae' },
  { nombre: 'Taebaek',           nivel: '3º Dan Poomsae' },
  { nombre: 'Pyongwon',          nivel: '4º Dan Poomsae' },
  { nombre: 'Sipjin',            nivel: '5º Dan Poomsae' },
];

export default function ListaPoomsaeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={s.titulo}>Listas de Poomsae</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {POOMSAES.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={s.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('UploadVideo', { poomsae: p.nombre })}
          >
            <View style={s.cardInfo}>
              <Text style={s.cardNombre}>{p.nombre}</Text>
              <Text style={s.cardNivel}>{p.nivel}</Text>
            </View>
            <View style={s.iconBtn}>
              <Ionicons name="videocam" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const colors = {
  background: '#1E1E1E',
  primary:    '#E93735',
  success:    '#5BBEBB',
  white:      '#FFFFFF',
  card:       '#FFFFFF',
  cardText:   '#1E1E1E',
};

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.background },
  header:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  titulo:     { color: colors.success, fontSize: 20, fontWeight: '700' },
  scroll:     { paddingHorizontal: 20, paddingTop: 8 },
  card:       { backgroundColor: colors.card, borderRadius: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 8, paddingVertical: 14, marginBottom: 12 },
  cardInfo:   { flex: 1 },
  cardNombre: { color: colors.success, fontSize: 18, fontWeight: '700' },
  cardNivel:  { color: colors.cardText, fontSize: 13, fontWeight: '700', marginTop: 2 },
  iconBtn:    { width: 45, height: 45, borderRadius: 22.5, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
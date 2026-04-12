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
  navigation: NativeStackNavigationProp<RootStackParamList, 'RankingPesos'>;
  route: RouteProp<RootStackParamList, 'RankingPesos'>;
};

const PESOS = [
  '-54kg', '-58kg', '-63kg', '-68kg',
  '-74kg', '-80kg', '-87kg', '+87kg',
];

export default function RankingPesosScreen({ navigation, route }: Props) {
  const { categoria, genero } = route.params;

  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Ranking Nacional</Text>
          <Text style={s.subtitle}>{categoria} · {genero}</Text>
        </View>
        <Ionicons name="pencil-outline" size={22} color={colors.textSecondary} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <View style={s.card}>
          <Text style={s.seleccionaLabel}>Selecciona tu categoría de peso</Text>
          <View style={s.pesosCol}>
            {PESOS.map((peso) => (
              <TouchableOpacity
                key={peso}
                style={s.pesoBtn}
                onPress={() => navigation.navigate('RankingTabla', {
                  categoria,
                  genero,
                  peso,
                })}
                activeOpacity={0.8}
              >
                <Text style={s.pesoBtnText}>{peso}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: colors.background },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerCenter:    { flex: 1, paddingHorizontal: 10 },
  title:           { color: colors.primary, fontSize: 20, fontWeight: '700' },
  subtitle:        { color: colors.textSecondary, fontSize: 12 },
  scroll:          { paddingHorizontal: 20, paddingTop: 8 },
  card:            { backgroundColor: colors.cardDark, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, gap: 16 },
  seleccionaLabel: { color: colors.white, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  pesosCol:        { gap: 10 },
  pesoBtn:         { backgroundColor: '#2E6DA4', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  pesoBtnText:     { color: colors.white, fontSize: 15, fontWeight: '600' },
});
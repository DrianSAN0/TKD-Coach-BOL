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

const TEAL = '#5BBEBB';

const PESOS: Record<string, string[]> = {
  Femenino:  ['-46 kg', '-49 kg', '-53 kg', '-57 kg', '-62 kg', '-67 kg', '-73 kg', '+73 kg'],
  Masculino: ['-54 kg', '-58 kg', '-63 kg', '-68 kg', '-74 kg', '-80 kg', '-87 kg', '+87 kg'],
};

const CATEGORIAS_POOMSAE = ['Cadete', 'Junior', 'Senior'];

export default function RankingPesosScreen({ navigation, route }: Props) {
  const { categoria, genero } = route.params;
  const esPoomsae = categoria === 'Poomsae';
  const opciones = esPoomsae ? CATEGORIAS_POOMSAE : (PESOS[genero] ?? PESOS['Masculino']);
  const label = esPoomsae ? 'Selecciona tu categoría' : 'Selecciona tu categoría de peso';

  return (
    <SafeAreaView style={s.container}>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.tab}>
          <Text style={s.tabText}>{esPoomsae ? 'Poomsae' : 'Kyorugi'}</Text>
        </View>
        <View style={s.card}>
          <Text style={s.seleccionaLabel}>{label}</Text>
          <View style={s.pesosCol}>
            {opciones.map(opcion => (
              <TouchableOpacity
                key={opcion}
                style={s.pesoBtn}
                onPress={() => navigation.navigate('RankingTabla', {
                  categoria: esPoomsae ? opcion : categoria,
                  genero,
                  peso: esPoomsae ? 'Poomsae' : opcion,
                })}
                activeOpacity={0.8}
              >
                <Text style={s.pesoBtnText}>{opcion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0D0D0D' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerCenter:    { flex: 1, paddingHorizontal: 10 },
  title:           { color: colors.primary, fontSize: 20, fontWeight: '700' },
  subtitle:        { color: colors.textSecondary, fontSize: 12 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  tab:             { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 22, alignSelf: 'flex-start', marginTop: 16, marginBottom: 8 },
  tabText:         { color: colors.white, fontSize: 14, fontWeight: '700' },
  card:            { width: '100%', backgroundColor: '#1A1A1A', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#2A2A2A', gap: 10 },
  seleccionaLabel: { color: colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  pesosCol:        { gap: 8 },
  pesoBtn:         { backgroundColor: TEAL, borderRadius: 30, paddingVertical: 12, alignItems: 'center' },
  pesoBtnText:     { color: '#1E1E1E', fontSize: 14, fontWeight: '700' },
});
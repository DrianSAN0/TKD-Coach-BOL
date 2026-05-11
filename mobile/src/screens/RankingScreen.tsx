import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ranking'>;
};

const TEAL = '#5BBEBB';

export default function RankingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Ranking Nacional</Text>
          <Text style={s.subtitle}>Cinturones Negros</Text>
        </View>
        <Ionicons name="pencil-outline" size={22} color={colors.textSecondary} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* ── POOMSAE ── */}
        <View style={s.tab}>
          <Text style={s.tabText}>Poomsae</Text>
        </View>
        <View style={s.seccionCard}>
          <Text style={s.seleccionaLabel}>Selecciona tu género</Text>
          <View style={s.opcionesCol}>
            {['Femenino', 'Masculino', 'Pareja'].map(g => (
              <TouchableOpacity
                key={g}
                style={s.opcionBtn}
                onPress={() => navigation.navigate('RankingPesos', { categoria: 'Poomsae', genero: g })}
                activeOpacity={0.8}
              >
                <Text style={s.opcionText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── KYORUGI ── */}
        <View style={[s.tab, { marginTop: 20 }]}>
          <Text style={s.tabText}>Kyorugi</Text>
        </View>
        <View style={s.seccionCard}>
          <Text style={s.seleccionaLabel}>Selecciona tu género</Text>
          <View style={s.opcionesCol}>
            {['Femenino', 'Masculino'].map(g => (
              <TouchableOpacity
                key={g}
                style={s.opcionBtn}
                onPress={() => navigation.navigate('RankingPesos', { categoria: 'Senior', genero: g })}
                activeOpacity={0.8}
              >
                <Text style={s.opcionText}>{g}</Text>
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
  scroll:          { flex: 1 },
  scrollContent:   { paddingHorizontal: 20, alignItems: 'center' },
  tab:             { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 22, alignSelf: 'flex-start', marginTop: 16, marginBottom: 8 },
  tabText:         { color: colors.white, fontSize: 14, fontWeight: '700' },
  seccionCard:     { width: '100%', backgroundColor: '#1A1A1A', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#2A2A2A', gap: 10 },
  seleccionaLabel: { color: colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  opcionesCol:     { gap: 8 },
  opcionBtn:       { backgroundColor: TEAL, borderRadius: 30, paddingVertical: 12, alignItems: 'center' },
  opcionText:      { color: '#1E1E1E', fontSize: 14, fontWeight: '700' },
});
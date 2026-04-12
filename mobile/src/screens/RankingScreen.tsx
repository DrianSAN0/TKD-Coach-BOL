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

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Poomsae ── */}
        <View style={s.seccionCard}>
          <View style={s.tabActivo}>
            <Text style={s.tabActivoText}>Poomsae</Text>
          </View>
          <Text style={s.seleccionaLabel}>Selecciona tu género</Text>
          <View style={s.opcionesCol}>
            {['Femenino', 'Masculino', 'Pareja'].map(g => (
              <View key={g} style={[s.opcionBtn, s.opcionDeshabilitado]}>
                <Text style={s.opcionTextDes}>{g}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Kyorugi ── */}
        <View style={s.seccionCard}>
          <View style={s.tabActivo}>
            <Text style={s.tabActivoText}>Kyorugi</Text>
          </View>
          <Text style={s.seleccionaLabel}>Selecciona tu género</Text>
          <View style={s.opcionesCol}>
            <View style={[s.opcionBtn, s.opcionDeshabilitado]}>
              <Text style={s.opcionTextDes}>Femenino</Text>
            </View>
            <TouchableOpacity
              style={[s.opcionBtn, s.opcionActivo]}
              onPress={() => navigation.navigate('RankingPesos', { categoria: 'Kyorugi', genero: 'Masculino' })}
              activeOpacity={0.8}
            >
              <Text style={s.opcionTextActivo}>Masculino</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:           { flex: 1, backgroundColor: colors.background },
  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerCenter:        { flex: 1, paddingHorizontal: 10 },
  title:               { color: colors.primary, fontSize: 20, fontWeight: '700' },
  subtitle:            { color: colors.textSecondary, fontSize: 12 },
  scroll:              { flex: 1, paddingHorizontal: 20 },
  seccionCard:         { backgroundColor: colors.cardDark, borderRadius: 16, marginTop: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  tabActivo:           { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 18, alignSelf: 'flex-start' },
  tabActivoText:       { color: colors.white, fontSize: 14, fontWeight: '700' },
  seleccionaLabel:     { color: colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  opcionesCol:         { gap: 8 },
  opcionBtn:           { borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  opcionActivo:        { backgroundColor: '#2E6DA4' },
  opcionDeshabilitado: { backgroundColor: '#2A2A2A', opacity: 0.5 },
  opcionTextActivo:    { color: colors.white, fontSize: 14, fontWeight: '600' },
  opcionTextDes:       { color: colors.textSecondary, fontSize: 14 },
});
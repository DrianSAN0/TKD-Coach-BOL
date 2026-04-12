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
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
          </View>
          <View>
            <Text style={s.greeting}>hola, Atleta</Text>
            <Text style={s.subGreeting}>¿Qué haremos hoy?</Text>
          </View>
        </View>
        <View style={s.headerIcons}>
          <Ionicons name="menu" size={22} color={colors.white} />
          <View style={s.notifWrap}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            <View style={s.notifDot} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Noticias ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Noticias</Text>
        </View>
        <View style={s.newsCard}>
          <View style={s.newsImagePlaceholder}>
            <Ionicons name="newspaper-outline" size={36} color={colors.textSecondary} />
          </View>
          <View style={s.newsContent}>
            <Text style={s.newsTitle}>Campeonato Nacional de Taekwondo 2026</Text>
            <Text style={s.newsDesc}>Próximas fechas y categorías disponibles para inscripción.</Text>
            <Text style={s.newsDate}>Abril 2026</Text>
          </View>
        </View>

        {/* ── Progreso ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Progreso</Text>
          <TouchableOpacity>
            <Text style={s.verMas}>Ver más</Text>
          </TouchableOpacity>
        </View>
        <View style={s.progresoCard}>
          <View style={s.progresoRow}>
            <View style={s.progresoItem}>
              <Text style={s.progresoNum}>7.3</Text>
              <Text style={s.progresoLabel}>Último score</Text>
            </View>
            <View style={s.progresoDivider} />
            <View style={s.progresoItem}>
              <Text style={s.progresoNum}>12</Text>
              <Text style={s.progresoLabel}>Análisis</Text>
            </View>
            <View style={s.progresoDivider} />
            <View style={s.progresoItem}>
              <Text style={s.progresoNum}>98%</Text>
              <Text style={s.progresoLabel}>Detección</Text>
            </View>
          </View>
          <TouchableOpacity
            style={s.scanBtn}
            onPress={() => navigation.navigate('UploadVideo')}
          >
            <Ionicons name="scan-outline" size={20} color={colors.white} />
            <Text style={s.scanBtnText}>Nuevo análisis</Text>
          </TouchableOpacity>
        </View>

        {/* ── Calendario ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Calendario</Text>
          <TouchableOpacity>
            <Text style={s.verMas}>Ver más</Text>
          </TouchableOpacity>
        </View>
        <View style={s.calCard}>
          <View style={s.calItem}>
            <View style={s.calDateBox}>
              <Text style={s.calDay}>15</Text>
              <Text style={s.calMonth}>ABR</Text>
            </View>
            <View style={s.calInfo}>
              <Text style={s.calTitle}>Entrenamiento Poomsae</Text>
              <Text style={s.calSub}>Club Kundo Kwang · 18:00</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
          <View style={s.calDivider} />
          <View style={s.calItem}>
            <View style={s.calDateBox}>
              <Text style={s.calDay}>20</Text>
              <Text style={s.calMonth}>ABR</Text>
            </View>
            <View style={s.calInfo}>
              <Text style={s.calTitle}>Torneo Regional</Text>
              <Text style={s.calSub}>Coliseo Municipal · 09:00</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:            { flex: 1, backgroundColor: colors.background },
  scroll:               { paddingHorizontal: 20, paddingTop: 8 },
  header:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  avatarWrap:           { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar:               { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  greeting:             { color: colors.white, fontSize: 18, fontWeight: '700' },
  subGreeting:          { color: colors.textSecondary, fontSize: 12 },
  headerIcons:          { flexDirection: 'row', alignItems: 'center', gap: 16 },
  notifWrap:            { position: 'relative' },
  notifDot:             { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  sectionHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 },
  sectionTitle:         { color: colors.white, fontSize: 18, fontWeight: '700' },
  verMas:               { color: colors.primary, fontSize: 13, fontWeight: '600' },
  newsCard:             { backgroundColor: colors.cardDark, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  newsImagePlaceholder: { width: 90, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  newsContent:          { flex: 1, padding: 14, gap: 4 },
  newsTitle:            { color: colors.white, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  newsDesc:             { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  newsDate:             { color: colors.primary, fontSize: 11, fontWeight: '600', marginTop: 4 },
  progresoCard:         { backgroundColor: colors.cardDark, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 16 },
  progresoRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  progresoItem:         { alignItems: 'center', gap: 4 },
  progresoNum:          { color: colors.white, fontSize: 26, fontWeight: '700' },
  progresoLabel:        { color: colors.textSecondary, fontSize: 11 },
  progresoDivider:      { width: 1, height: 40, backgroundColor: colors.border },
  scanBtn:              { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  scanBtnText:          { color: colors.white, fontSize: 15, fontWeight: '700' },
  calCard:              { backgroundColor: colors.cardDark, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  calItem:              { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  calDateBox:           { width: 44, height: 44, backgroundColor: colors.primary, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  calDay:               { color: colors.white, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  calMonth:             { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '600' },
  calInfo:              { flex: 1, gap: 3 },
  calTitle:             { color: colors.white, fontSize: 14, fontWeight: '600' },
  calSub:               { color: colors.textSecondary, fontSize: 12 },
  calDivider:           { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
});
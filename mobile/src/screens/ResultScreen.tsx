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

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

export default function ResultScreen({ navigation, route }: Props) {
  const { score, stability, posture, framesCount, videoUri } = route.params;

  const scoreColor = () => {
    if (score >= 8) return colors.success;
    if (score >= 6) return '#F0C040';
    return colors.primary;
  };

  const scoreLabel = () => {
    if (score >= 8.5) return '¡Excelente!';
    if (score >= 7)   return '¡Bien hecho!';
    if (score >= 5)   return 'Aceptable';
    return 'Necesita práctica';
  };

  const metricColor = (val: string, good: string, mid: string) => {
    if (val === good) return colors.success;
    if (val === mid)  return '#F0C040';
    if (val === '—')  return colors.textSecondary;
    return colors.primary;
  };

  const observaciones = () => {
    const obs: string[] = [];
    if (stability === 'Baja')       obs.push('⚠️ Trabaja en mantener las caderas estables durante el poomsae.');
    if (stability === 'Media')      obs.push('💡 Tu estabilidad es aceptable, sigue practicando el balance.');
    if (stability === 'Alta')       obs.push('✅ Excelente estabilidad de caderas.');
    if (posture === 'A mejorar')    obs.push('⚠️ Alinea mejor tus hombros con tus caderas.');
    if (posture === 'Aceptable')    obs.push('💡 Postura aceptable, enfócate en la alineación.');
    if (posture === 'Correcta')     obs.push('✅ Muy buena postura general.');
    if (score < 5)                  obs.push('⚠️ Asegúrate de que el cuerpo completo sea visible en el video.');
    return obs;
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={s.title}>Resultado del análisis</Text>
        </View>

        {/* Score principal */}
        <View style={s.scoreCard}>
          <Text style={s.scoreEmoji}>
            {score >= 8.5 ? '🏆' : score >= 7 ? '🥇' : score >= 5 ? '👍' : '💪'}
          </Text>
          <Text style={[s.scoreValue, { color: scoreColor() }]}>
            {score.toFixed(1)}
          </Text>
          <Text style={s.scoreMax}>/10</Text>
          <Text style={[s.scoreLabel, { color: scoreColor() }]}>
            {scoreLabel()}
          </Text>
          <Text style={s.framesText}>{framesCount} frames analizados</Text>
        </View>

        {/* Métricas */}
        <Text style={s.sectionTitle}>Métricas</Text>
        <View style={s.metricsRow}>
          <View style={[s.metricCard, { borderColor: metricColor(stability, 'Alta', 'Media') }]}>
            <Text style={s.metricIcon}>⚖️</Text>
            <Text style={s.metricTitle}>Estabilidad</Text>
            <Text style={[s.metricValue, { color: metricColor(stability, 'Alta', 'Media') }]}>
              {stability}
            </Text>
          </View>
          <View style={[s.metricCard, { borderColor: metricColor(posture, 'Correcta', 'Aceptable') }]}>
            <Text style={s.metricIcon}>🧍</Text>
            <Text style={s.metricTitle}>Postura</Text>
            <Text style={[s.metricValue, { color: metricColor(posture, 'Correcta', 'Aceptable') }]}>
              {posture}
            </Text>
          </View>
        </View>

        {/* Observaciones */}
        <Text style={s.sectionTitle}>Observaciones</Text>
        <View style={s.obsCard}>
          {observaciones().length > 0
            ? observaciones().map((obs, i) => (
                <Text key={i} style={s.obsText}>{obs}</Text>
              ))
            : <Text style={s.obsText}>✅ Análisis completado sin observaciones.</Text>
          }
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={s.retryBtn}
          onPress={() => navigation.navigate('UploadVideo', {})}
        >
          <Ionicons name="refresh-outline" size={20} color={colors.white} />
          <Text style={s.retryBtnText}>Analizar otro video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={s.homeBtnText}>Volver al inicio</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 10, paddingBottom: 16 },
  title:        { color: colors.white, fontSize: 20, fontWeight: '700' },
  scoreCard:    { backgroundColor: colors.cardDark, borderRadius: 24, padding: 30, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  scoreEmoji:   { fontSize: 48, marginBottom: 8 },
  scoreValue:   { fontSize: 72, fontWeight: '700', lineHeight: 80 },
  scoreMax:     { color: colors.textSecondary, fontSize: 20, marginTop: -8 },
  scoreLabel:   { fontSize: 22, fontWeight: '700', marginTop: 8 },
  framesText:   { color: colors.textSecondary, fontSize: 12, marginTop: 8 },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  metricsRow:   { flexDirection: 'row', gap: 12, marginBottom: 24 },
  metricCard:   { flex: 1, backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  metricIcon:   { fontSize: 24, marginBottom: 6 },
  metricTitle:  { color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  metricValue:  { fontSize: 16, fontWeight: '700' },
  obsCard:      { backgroundColor: colors.cardDark, borderRadius: 16, padding: 18, marginBottom: 24, gap: 10, borderWidth: 1, borderColor: colors.border },
  obsText:      { color: colors.white, fontSize: 13, lineHeight: 22 },
  retryBtn:     { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  retryBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  homeBtn:      { borderRadius: 30, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  homeBtnText:  { color: colors.textSecondary, fontSize: 15 },
});
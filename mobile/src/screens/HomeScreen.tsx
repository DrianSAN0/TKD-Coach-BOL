import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={s.container}>

      <View style={s.hero}>
        <Text style={s.appName}>TKD Coach BO</Text>
        <Text style={s.subtitle}>Análisis de Poomsae</Text>
        <Text style={s.description}>
          Graba tu poomsae o selecciona un video ya grabado.
          La app analizará tu técnica y te dará una evaluación detallada.
        </Text>
      </View>

      {/* Card principal */}
      <View style={s.card}>
        <Ionicons name="videocam-outline" size={48} color={colors.primary} />
        <Text style={s.cardTitle}>Analizar Poomsae</Text>
        <Text style={s.cardDesc}>
          Selecciona un video de tu galería o graba uno nuevo
        </Text>

        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => navigation.navigate('UploadVideo')}
        >
          <Ionicons name="play-circle-outline" size={22} color={colors.white} />
          <Text style={s.primaryBtnText}>Comenzar análisis</Text>
        </TouchableOpacity>
      </View>

      {/* Info cards */}
      <View style={s.infoRow}>
        <View style={s.infoCard}>
          <Text style={s.infoIcon}>🎯</Text>
          <Text style={s.infoTitle}>Precisión</Text>
          <Text style={s.infoDesc}>Detecta 17 puntos del cuerpo</Text>
        </View>
        <View style={s.infoCard}>
          <Text style={s.infoIcon}>📊</Text>
          <Text style={s.infoTitle}>Puntuación</Text>
          <Text style={s.infoDesc}>Score 0-10 de tu técnica</Text>
        </View>
        <View style={s.infoCard}>
          <Text style={s.infoIcon}>💡</Text>
          <Text style={s.infoTitle}>Feedback</Text>
          <Text style={s.infoDesc}>Postura y estabilidad</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  hero:         { alignItems: 'center', paddingTop: 40, paddingBottom: 30 },
  appName:      { color: colors.primary, fontSize: 32, fontWeight: '700', marginBottom: 4 },
  subtitle:     { color: colors.success, fontSize: 18, fontWeight: '600', marginBottom: 16 },
  description:  { color: colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  card:         { backgroundColor: colors.cardDark, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  cardTitle:    { color: colors.white, fontSize: 22, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  cardDesc:     { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  primaryBtn:   { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 14, paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', gap: 10 },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  infoRow:      { flexDirection: 'row', gap: 12 },
  infoCard:     { flex: 1, backgroundColor: colors.cardDark, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  infoIcon:     { fontSize: 24, marginBottom: 6 },
  infoTitle:    { color: colors.white, fontSize: 13, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  infoDesc:     { color: colors.textSecondary, fontSize: 11, textAlign: 'center' },
});
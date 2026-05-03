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
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScannerInicial'>;
};

const INSTRUCCIONES = [
  {
    icon: 'videocam-outline' as const,
    titulo: 'Selecciona tu video',
    desc: 'Elige un video de tu galería o grábalo directamente desde la app.',
  },
  {
    icon: 'body-outline' as const,
    titulo: 'Cuerpo completo visible',
    desc: 'Asegurate de que tu cuerpo completo esté en el cuadro durante toda la ejecución.',
  },
  {
    icon: 'sunny-outline' as const,
    titulo: 'Buena iluminación',
    desc: 'Grabá en un lugar bien iluminado con fondo limpio para mejor detección.',
  },
  {
    icon: 'analytics-outline' as const,
    titulo: 'Análisis automático',
    desc: 'La IA analizará tu poomsae frame a frame y te dará una evaluación detallada.',
  },
];

export default function ScannerInicialScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={s.container}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Escáner biométrico</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Bienvenida ── */}
        <Text style={s.titulo}>BIENVENIDO</Text>

        <View style={s.iconoWrap}>
          <Ionicons name="scan-circle-outline" size={90} color={colors.primary} />
        </View>

        <Text style={s.descripcion}>
          Te damos la bienvenida al escáner biométrico. Esta función analiza tu
          ejecución de poomsae para ayudarte a evaluar tu rendimiento y seguir
          tu progreso. A través de tecnología avanzada, podrás identificar
          errores y perfeccionar tu técnica para alcanzar un mejor desempeño
          en competencias.
        </Text>

        {/* ── Instrucciones ── */}
        <Text style={s.instruccionesTitulo}>Instrucciones</Text>

        {INSTRUCCIONES.map((item, i) => (
          <View key={i} style={s.instruccionCard}>
            <View style={s.instruccionIconWrap}>
              <Ionicons name={item.icon} size={28} color={colors.primary} />
            </View>
            <View style={s.instruccionTexto}>
              <Text style={s.instruccionTitulo}>{item.titulo}</Text>
              <Text style={s.instruccionDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        {/* ── Botón ── */}
        <TouchableOpacity
          style={s.btn}
          onPress={() => navigation.navigate('ListaPoomsae')}
          activeOpacity={0.85}
        >
          <Ionicons name="scan-outline" size={22} color={colors.white} />
          <Text style={s.btnText}>Comenzar análisis</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:            { flex: 1, backgroundColor: colors.background },
  header:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle:          { color: colors.white, fontSize: 18, fontWeight: '700' },
  scroll:               { paddingHorizontal: 20, paddingTop: 8 },
  titulo:               { color: colors.white, fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  iconoWrap:            { alignItems: 'center', marginBottom: 20 },
  descripcion:          { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  instruccionesTitulo:  { color: colors.white, fontSize: 20, fontWeight: '700', marginBottom: 14 },
  instruccionCard:      { backgroundColor: colors.cardDark, borderRadius: 14, padding: 16, flexDirection: 'row', gap: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  instruccionIconWrap:  { width: 44, height: 44, backgroundColor: '#2A2A2A', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  instruccionTexto:     { flex: 1, gap: 4 },
  instruccionTitulo:    { color: colors.white, fontSize: 14, fontWeight: '700' },
  instruccionDesc:      { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  btn:                  { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20 },
  btnText:              { color: colors.white, fontSize: 16, fontWeight: '700' },
});
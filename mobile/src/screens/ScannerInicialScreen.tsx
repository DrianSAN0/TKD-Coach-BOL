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

const TEAL = '#5BBEBB';

export default function ScannerInicialScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={s.container}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Escáner biométrico</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* BIENVENIDO */}
        <Text style={s.titulo}>BIENVENIDO</Text>

        {/* Marco de escaneo */}
        <View style={s.scanFrame}>
          <View style={[s.corner, s.tl]} />
          <View style={[s.corner, s.tr]} />
          <View style={[s.corner, s.bl]} />
          <View style={[s.corner, s.br]} />
          <Ionicons name="body-outline" size={80} color={colors.white} />
        </View>

        {/* Descripción */}
        <Text style={s.descripcion}>
          Te damos la bienvenida al escáner biométrico. Esta función analiza tu ejecución
          de poomsae para ayudarte a evaluar tu rendimiento y seguir tu progreso a lo largo
          de las prácticas. A través de una tecnología avanzada, podrás identificar errores,
          reconocer áreas de mejora y perfeccionar tu técnica para alcanzar un mejor
          desempeño en competencias.
        </Text>

        {/* Instrucciones */}
        <Text style={s.instruccionesTitulo}>Instrucciones</Text>

        {/* Card 1 — Orientación horizontal */}
        <View style={s.instruccionCard}>
          <View style={s.cardIconsRow}>
            <View style={s.phoneBox}>
              <Ionicons name="phone-portrait-outline" size={36} color="#1E1E1E" />
            </View>
            <Ionicons name="sync-outline" size={36} color="#1E1E1E" />
          </View>
        </View>
        <Text style={s.cardDesc}>
          Asegúrate de colocar la cámara en posición horizontal y sobre una base firme y estable,
          evitando cualquier movimiento durante la grabación.
        </Text>

        {/* Card 2 — Distancia */}
        <View style={s.instruccionCard}>
          <View style={s.cardIconsRow}>
            <Ionicons name="person-outline" size={36} color="#1E1E1E" />
            <View style={s.distanciaRow}>
              <View style={s.lineaDist} />
              <Text style={s.distText}>3 metros</Text>
              <View style={s.lineaDist} />
            </View>
            <View style={s.paredBox} />
          </View>
        </View>
        <Text style={s.cardDesc}>
          Manten una distancia aproximada de 10 pies (alrededor de 3 metros) entre el
          dispositivo y la persona que realizará el poomsae.
        </Text>

        {/* Card 3 — Iluminación */}
        <View style={s.instruccionCard}>
          <View style={s.cardIconsRow}>
            <Ionicons name="person-outline" size={36} color="#1E1E1E" />
            <Ionicons name="sunny-outline" size={44} color="#1E1E1E" />
          </View>
        </View>
        <Text style={s.cardDesc}>
          Verifica que el área cuente con una buena iluminación, de modo que todos los
          movimientos puedan registrarse con claridad y calidad.
        </Text>

        {/* Botón */}
        <TouchableOpacity
          style={s.btn}
          onPress={() => navigation.navigate('ListaPoomsae')}
          activeOpacity={0.85}
        >
          <Ionicons name="videocam-outline" size={22} color={colors.white} />
          <Text style={s.btnText}>Iniciar Grabación</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const CORNER_SIZE = 24;
const CORNER_THICK = 4;

const s = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#0D0D0D' },
  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle:         { color: colors.white, fontSize: 18, fontWeight: '700' },
  scroll:              { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  titulo:              { color: colors.primary, fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 20, letterSpacing: 2 },

  // Marco escaneo
  scanFrame:           { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  corner:              { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: colors.primary },
  tl:                  { top: 0, left: 0, borderTopWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK },
  tr:                  { top: 0, right: 0, borderTopWidth: CORNER_THICK, borderRightWidth: CORNER_THICK },
  bl:                  { bottom: 0, left: 0, borderBottomWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK },
  br:                  { bottom: 0, right: 0, borderBottomWidth: CORNER_THICK, borderRightWidth: CORNER_THICK },

  descripcion:         { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  instruccionesTitulo: { color: TEAL, fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16 },

  instruccionCard:     { backgroundColor: TEAL, borderRadius: 20, paddingVertical: 24, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12, minHeight: 120 },
  cardIconsRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  phoneBox:            { transform: [{ rotate: '90deg' }] },
  cardDesc:            { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },

  distanciaRow:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lineaDist:           { width: 20, height: 2, backgroundColor: '#1E1E1E' },
  distText:            { color: '#1E1E1E', fontSize: 12, fontWeight: '700' },
  paredBox:            { width: 6, height: 40, backgroundColor: '#1E1E1E', borderRadius: 2 },

  btn:                 { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  btnText:             { color: colors.white, fontSize: 16, fontWeight: '700' },
});
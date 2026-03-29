import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

function InstructionCard({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>{children}</View>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

export default function ScannerIntroScreen({
  onStart,
}: {
  onStart: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Escáner biométrico</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>BIENVENIDO</Text>

        <Text style={styles.description}>
          Te damos la bienvenida al escáner biométrico. Esta función analiza tu
          ejecución de poomsae para ayudarte a evaluar tu rendimiento y seguir
          tu progreso a lo largo de las prácticas. A través de una tecnología
          avanzada, podrás identificar errores, reconocer áreas de mejora y
          perfeccionar tu técnica para alcanzar un mejor desempeño en
          competencias.
        </Text>

        <Text style={styles.sectionTitle}>Instrucciones</Text>

        <InstructionCard text="Asegúrate de colocar la cámara en posición horizontal y sobre una base firme y estable, evitando cualquier movimiento durante la grabación.">
          <View style={styles.iconRow}>
            <MaterialCommunityIcons
              name="cellphone"
              size={80}
              color={colors.background}
            />
            <Feather name="rotate-cw" size={70} color={colors.background} />
          </View>
        </InstructionCard>

        <InstructionCard text="Mantén una distancia aproximada de 3 metros entre el dispositivo y la persona que realizará el poomsae.">
          <View style={styles.distanceContainer}>
            <MaterialCommunityIcons
              name="human-male"
              size={60}
              color={colors.background}
            />
            <View style={styles.distanceLine}>
              <Feather name="arrow-left" size={22} color={colors.background} />
              <Text style={styles.distanceText}>3 metros</Text>
              <Feather name="arrow-right" size={22} color={colors.background} />
            </View>
            <MaterialCommunityIcons
              name="cellphone"
              size={55}
              color={colors.background}
            />
          </View>
        </InstructionCard>

        <InstructionCard text="Verifica que el área cuente con una buena iluminación, de modo que todos los movimientos puedan registrarse con claridad y calidad.">
          <View style={styles.iconRow}>
            <Ionicons
              name="sunny-outline"
              size={70}
              color={colors.background}
            />
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={70}
              color={colors.background}
            />
          </View>
        </InstructionCard>

        <TouchableOpacity style={styles.recordButton} onPress={onStart}>
          <Ionicons name="videocam-outline" size={22} color={colors.white} />
          <Text style={styles.recordButtonText}>Iniciar Grabación</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={28} color={colors.white} />
        <MaterialCommunityIcons
          name="scan-helper"
          size={28}
          color={colors.primary}
        />
        <Ionicons name="trophy-outline" size={26} color={colors.white} />
        <Ionicons name="calendar-outline" size={26} color={colors.white} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTitle: {
    color: colors.success,
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    alignItems: 'center',
  },
  welcome: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: 120,
    textAlign: 'center',
  },
  description: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 34,
  },
  sectionTitle: {
    color: colors.success,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
  },
  card: {
    width: '100%',
    backgroundColor: colors.success,
    borderRadius: 28,
    minHeight: 155,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  cardText: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 14,
    paddingHorizontal: 12,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  distanceLine: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 6,
  },
  recordButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 33,
    minHeight: 66,
    width: 237,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  recordButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
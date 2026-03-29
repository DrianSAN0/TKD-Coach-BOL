import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CameraScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState(7.2);
  const [stability, setStability] = useState('Media');
  const [posture, setPosture] = useState('Aceptable');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        const nextScore = (6.8 + Math.random() * 2).toFixed(1);
        setScore(Number(nextScore));

        const stabilityOptions = ['Alta', 'Media', 'Baja'];
        const postureOptions = ['Correcta', 'Aceptable', 'A mejorar'];

        setStability(
          stabilityOptions[Math.floor(Math.random() * stabilityOptions.length)]
        );
        setPosture(
          postureOptions[Math.floor(Math.random() * postureOptions.length)]
        );
      }, 1200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Necesitamos acceso a la cámara para usar el escáner biométrico.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      setIsRecording(true);
      await cameraRef.current.recordAsync({
        maxDuration: 20,
      });
    } catch (error) {
      console.log('Error al iniciar grabación:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current) return;
    cameraRef.current.stopRecording();
    setIsRecording(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Escáner en vivo</Text>
      </View>

      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Puntuación en vivo</Text>
        <Text style={styles.scoreValue}>{score.toFixed(1)}</Text>
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        mode="video"
        facing="back"
      />

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Estabilidad</Text>
          <Text style={styles.metricValue}>{stability}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Postura</Text>
          <Text style={styles.metricValue}>{posture}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <Ionicons name="videocam" size={22} color={colors.white} />
            <Text style={styles.recordButtonText}>Iniciar grabación</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <Ionicons name="stop" size={22} color={colors.white} />
            <Text style={styles.recordButtonText}>Detener grabación</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
  },
  topTitle: {
    color: colors.success,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
  },
  scoreBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#252525',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  scoreLabel: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '700',
  },
  camera: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  metricTitle: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  recordButton: {
    minWidth: 240,
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stopButton: {
    minWidth: 240,
    backgroundColor: '#B3261E',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  recordButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
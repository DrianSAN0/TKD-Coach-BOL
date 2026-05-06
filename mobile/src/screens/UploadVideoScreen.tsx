import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

import { BACKEND_URL } from '../config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UploadVideo'>;
};

export default function UploadVideoScreen({ navigation }: Props) {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const grabarVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara.');
      return;
    }
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        videoMaxDuration: 60,
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) setVideoUri(result.assets[0].uri);
    } catch {
      Alert.alert('Error', 'No se pudo grabar el video.');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) setVideoUri(result.assets[0].uri);
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar el video.');
    } finally {
      setLoading(false);
    }
  };

  const analizarVideo = async () => {
    if (!videoUri) return;
    setLoading(true);
    try {
      setUploadStatus('Conectando al servidor...');
      const healthRes = await fetch(`${BACKEND_URL}/health`).catch(() => null);
      if (!healthRes?.ok) {
        Alert.alert('Backend no disponible', `No se pudo conectar a ${BACKEND_URL}`);
        return;
      }

      // 1. Copiar video a directorio permanente
      setUploadStatus('Preparando video...');
      const filename = videoUri.split('/').pop() || 'video.mp4';
      const permanentUri = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({ from: videoUri, to: permanentUri });

      // 2. Subir video directo al EC2
      setUploadStatus('Subiendo video...');
      const formData = new FormData();
      formData.append('video', { uri: permanentUri, name: 'video.mp4', type: 'video/mp4' } as any);
      formData.append('id_atleta', 'atleta');
      formData.append('poomsae', 'Koryo');

      const s3Res = await fetch(`http://3.144.245.237:8000/s3/upload-video`, {
        method: 'POST',
        body: formData,
      });
      if (!s3Res.ok) throw new Error('Error subiendo video');
      const { key, url: s3VideoUrl } = await s3Res.json();

      // 3. Analizar desde S3
      setUploadStatus('Procesando con MediaPipe...');
      const response = await fetch(`${BACKEND_URL}/analyze-s3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: s3VideoUrl, key }),
      });

      if (!response.ok) throw new Error(`Error del servidor: ${await response.text()}`);

      const analysisData = await response.json();
      navigation.navigate('Analysis', { videoUri: permanentUri, analysisData });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error desconocido');
    } finally {
      setLoading(false);
      setUploadStatus('');
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={s.title}>Seleccionar video</Text>
        </View>

        <View style={s.previewBox}>
          {videoUri ? (
            <Video
              source={{ uri: videoUri }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              useNativeControls
            />
          ) : (
            <View style={s.emptyPreview}>
              <Ionicons name="videocam-outline" size={64} color={colors.border} />
              <Text style={s.emptyText}>Sin video seleccionado</Text>
            </View>
          )}
        </View>

        <View style={s.btnRow}>
          <TouchableOpacity
            style={[s.selectBtn, loading && s.disabled]}
            onPress={grabarVideo}
            disabled={loading}
          >
            <Ionicons name="camera-outline" size={22} color={colors.white} />
            <Text style={s.selectBtnText}>Grabar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.selectBtn, s.selectBtnAlt, loading && s.disabled]}
            onPress={seleccionarVideo}
            disabled={loading}
          >
            <Ionicons name="folder-open-outline" size={22} color={colors.primary} />
            <Text style={[s.selectBtnText, { color: colors.primary }]}>Galería</Text>
          </TouchableOpacity>
        </View>

        {!videoUri && !loading && (
          <View style={s.tipsBox}>
            <Text style={s.tipsTitle}>Consejos para mejor análisis</Text>
            <Text style={s.tip}>✅ Graba de cuerpo completo</Text>
            <Text style={s.tip}>✅ Fondo limpio y buena iluminación</Text>
            <Text style={s.tip}>✅ Mínimo 3 metros de distancia</Text>
            <Text style={s.tip}>✅ Cámara estable en posición horizontal</Text>
          </View>
        )}

        {loading && (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            {uploadStatus ? <Text style={s.loadingText}>{uploadStatus}</Text> : null}
          </View>
        )}

        {videoUri && !loading && (
          <TouchableOpacity style={s.analyzeBtn} onPress={analizarVideo}>
            <Ionicons name="scan-outline" size={22} color={colors.white} />
            <Text style={s.analyzeBtnText}>Analizar video</Text>
          </TouchableOpacity>
        )}
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: colors.background },
  content:        { flex: 1, paddingHorizontal: 20 },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 10, paddingBottom: 16 },
  title:          { color: colors.white, fontSize: 20, fontWeight: '700' },
  previewBox:     { width: '100%', height: 220, backgroundColor: colors.cardDark, borderRadius: 20, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  emptyPreview:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText:      { color: colors.textSecondary, fontSize: 14 },
  btnRow:         { flexDirection: 'row', gap: 12, marginBottom: 20 },
  selectBtn:      { flex: 1, backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  selectBtnAlt:   { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary },
  selectBtnText:  { color: colors.white, fontSize: 15, fontWeight: '700' },
  disabled:       { opacity: 0.5 },
  tipsBox:        { backgroundColor: colors.cardDark, borderRadius: 16, padding: 18, gap: 8, borderWidth: 1, borderColor: colors.border },
  tipsTitle:      { color: colors.white, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  tip:            { color: colors.textSecondary, fontSize: 13 },
  loadingBox:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText:    { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  analyzeBtn:     { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 },
  analyzeBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
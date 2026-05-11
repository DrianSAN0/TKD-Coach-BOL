import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

const BACKEND_URL = 'http://10.0.2.2:8000';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UploadVideo'>;
  route: RouteProp<RootStackParamList, 'UploadVideo'>;
};

const TIPS = [
  { icon: 'body-outline',      text: 'Graba de cuerpo completo' },
  { icon: 'sunny-outline',     text: 'Fondo limpio y buena iluminacion' },
  { icon: 'resize-outline',    text: 'Minimo 3 metros de distancia' },
  { icon: 'phone-landscape-outline', text: 'Camara estable en posicion horizontal' },
];

export default function UploadVideoScreen({ navigation, route }: Props) {
  const poomsae = route.params?.poomsae || 'Poomsae';
  const [videoUri,      setVideoUri]      = useState<string | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [uploadStatus,  setUploadStatus]  = useState('');

  const grabarVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a la camara.'); return; }
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        videoMaxDuration: 60,
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) setVideoUri(result.assets[0].uri);
    } catch { Alert.alert('Error', 'No se pudo grabar el video.'); }
    finally { setLoading(false); }
  };

  const seleccionarVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galeria.'); return; }
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) setVideoUri(result.assets[0].uri);
    } catch { Alert.alert('Error', 'No se pudo seleccionar el video.'); }
    finally { setLoading(false); }
  };

  const analizarVideo = async () => {
    if (!videoUri) return;
    setLoading(true);
    try {
      setUploadStatus('Conectando al servidor...');
      const healthRes = await fetch(`${BACKEND_URL}/health`).catch(() => null);
      if (!healthRes?.ok) { Alert.alert('Backend no disponible', `No se pudo conectar a ${BACKEND_URL}`); return; }
      setUploadStatus('Preparando video...');
      const filename = videoUri.split('/').pop() || 'video.mp4';
      const permanentUri = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({ from: videoUri, to: permanentUri });
      setUploadStatus('Subiendo video...');
      const formData = new FormData();
      formData.append('video', { uri: permanentUri, name: 'video.mp4', type: 'video/mp4' } as any);
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST', body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response.ok) throw new Error(`Error del servidor: ${await response.text()}`);
      setUploadStatus('Procesando con MediaPipe...');
      const analysisData = await response.json();
      navigation.navigate('Analysis', { videoUri: permanentUri, analysisData, poomsae });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error desconocido');
    } finally { setLoading(false); setUploadStatus(''); }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={s.title}>Seleccionar video</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Poomsae seleccionado */}
        <View style={s.poomsaeBadge}>
          <Ionicons name="ribbon-outline" size={16} color={colors.primary} />
          <Text style={s.poomsaeText}>{poomsae}</Text>
        </View>

        {/* Preview */}
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
              <View style={s.emptyIconWrap}>
                <Ionicons name="videocam-outline" size={48} color={colors.textSecondary} />
              </View>
              <Text style={s.emptyText}>Sin video seleccionado</Text>
            </View>
          )}
        </View>

        {/* Botones Grabar / Galeria */}
        <View style={s.btnRow}>
          <TouchableOpacity
            style={[s.btn, s.btnSolid, loading && s.disabled]}
            onPress={grabarVideo}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Ionicons name="camera-outline" size={22} color="#fff" />
            <Text style={s.btnSolidText}>Grabar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, s.btnOutline, loading && s.disabled]}
            onPress={seleccionarVideo}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Ionicons name="folder-open-outline" size={22} color={colors.primary} />
            <Text style={s.btnOutlineText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            {uploadStatus ? <Text style={s.loadingText}>{uploadStatus}</Text> : null}
          </View>
        )}

        {/* Tips */}
        {!videoUri && !loading && (
          <View style={s.tipsBox}>
            <Text style={s.tipsTitle}>Consejos para mejor analisis</Text>
            {TIPS.map((t, i) => (
              <View key={i} style={s.tipRow}>
                <View style={s.tipIconWrap}>
                  <Ionicons name={t.icon as any} size={18} color={colors.primary} />
                </View>
                <Text style={s.tipText}>{t.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Boton Analizar */}
        {videoUri && !loading && (
          <TouchableOpacity style={s.analyzeBtn} onPress={analizarVideo} activeOpacity={0.85}>
            <Ionicons name="scan-outline" size={22} color="#fff" />
            <Text style={s.analyzeBtnText}>Analizar video</Text>
          </TouchableOpacity>
        )}
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background },
  content:      { flex: 1, paddingHorizontal: 20 },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 12 },
  title:        { color: colors.white, fontSize: 20, fontWeight: '700' },
  poomsaeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2A2A2A', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, alignSelf: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  poomsaeText:  { color: colors.primary, fontSize: 13, fontWeight: '600' },
  previewBox:   { width: '100%', height: 220, backgroundColor: colors.cardDark, borderRadius: 20, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  emptyPreview: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIconWrap:{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' },
  emptyText:    { color: colors.textSecondary, fontSize: 14 },
  btnRow:       { flexDirection: 'row', gap: 12, marginBottom: 20 },
  btn:          { flex: 1, borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnSolid:     { backgroundColor: colors.primary },
  btnOutline:   { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary },
  btnSolidText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnOutlineText:{ color: colors.primary, fontSize: 15, fontWeight: '700' },
  disabled:     { opacity: 0.5 },
  loadingBox:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText:  { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  tipsBox:      { backgroundColor: colors.cardDark, borderRadius: 16, padding: 18, gap: 12, borderWidth: 1, borderColor: colors.border },
  tipsTitle:    { color: colors.white, fontSize: 15, fontWeight: '700' },
  tipRow:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tipIconWrap:  { width: 32, height: 32, borderRadius: 8, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' },
  tipText:      { color: colors.textSecondary, fontSize: 13, flex: 1 },
  analyzeBtn:   { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  analyzeBtnText:{ color: '#fff', fontSize: 16, fontWeight: '700' },
});
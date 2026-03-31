import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { RootStackParamList, Keypoint } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Analysis'>;
  route: RouteProp<RootStackParamList, 'Analysis'>;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MIN_VISIBILITY = 0.3;
const COLOR_LINE = '#00F5FF';
const COLOR_DOT  = '#FF4D6D';

export default function AnalysisScreen({ navigation, route }: Props) {
  const { videoUri, analysisData } = route.params;
  const { fps, connections, frames, width: vidW, height: vidH } = analysisData;

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Calcular tamaño del video manteniendo aspect ratio
  const aspectRatio = vidW / vidH;
  const videoAreaH = SCREEN_H * 0.62;
  let displayW = SCREEN_W;
  let displayH = SCREEN_W / aspectRatio;
  if (displayH > videoAreaH) {
    displayH = videoAreaH;
    displayW = videoAreaH * aspectRatio;
  }

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setIsPlaying(status.isPlaying);
      const posMs = status.positionMillis ?? 0;
      const frameNum = Math.floor((posMs / 1000) * fps);
      setCurrentFrame(Math.min(frameNum, frames.length - 1));
    },
    [fps, frames.length]
  );

  const togglePlay = async () => {
    if (!videoRef.current) return;
    isPlaying
      ? await videoRef.current.pauseAsync()
      : await videoRef.current.playAsync();
  };

  const restart = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setPositionAsync(0);
    await videoRef.current.playAsync();
  };

  const keypoints: Keypoint[] = frames[currentFrame]?.keypoints ?? [];
  const hasDetection = keypoints.length > 0;
  const detectedFrames = frames.filter(f => f.keypoints.length > 0).length;
  const detectionRate = Math.round((detectedFrames / frames.length) * 100);

  return (
    <View style={s.container}>
      <StatusBar hidden />

      {/* VIDEO + ESQUELETO */}
      <View style={s.videoArea}>
        <View style={[s.videoWrapper, { width: displayW, height: displayH }]}>

          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            shouldPlay={false}
            isLooping
            useNativeControls={false}
          />

          {/* Esqueleto SVG encima del video */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={displayW} height={displayH}>
              <G>
                {connections.map(([from, to], idx) => {
                  const a = keypoints[from];
                  const b = keypoints[to];
                  if (!a || !b || a.visibility < MIN_VISIBILITY || b.visibility < MIN_VISIBILITY) return null;
                  return (
                    <Line
                      key={`l${idx}`}
                      x1={a.x * displayW} y1={a.y * displayH}
                      x2={b.x * displayW} y2={b.y * displayH}
                      stroke={COLOR_LINE}
                      strokeWidth={2.5}
                      strokeOpacity={0.9}
                      strokeLinecap="round"
                    />
                  );
                })}

                {keypoints.map((kp, idx) => {
                  if (kp.visibility < MIN_VISIBILITY) return null;
                  const cx = kp.x * displayW;
                  const cy = kp.y * displayH;
                  const r = idx <= 10 ? 3 : 5;
                  return (
                    <G key={`k${idx}`}>
                      <Circle cx={cx} cy={cy} r={r + 3} fill={COLOR_LINE} fillOpacity={0.15} />
                      <Circle cx={cx} cy={cy} r={r} fill={COLOR_DOT} stroke={COLOR_LINE} strokeWidth={1.5} />
                    </G>
                  );
                })}
              </G>
            </Svg>
          </View>

          {/* Badge detección */}
          <View style={[s.badge, { backgroundColor: hasDetection ? 'rgba(0,200,80,0.8)' : 'rgba(200,0,0,0.7)' }]}>
            <View style={[s.badgeDot, { backgroundColor: hasDetection ? '#4ADE80' : '#F87171' }]} />
            <Text style={s.badgeText}>{hasDetection ? 'Pose detectada' : 'Sin detección'}</Text>
          </View>

          {/* Frame counter */}
          <View style={s.frameCounter}>
            <Text style={s.frameCounterText}>Frame {currentFrame + 1} / {frames.length}</Text>
          </View>

        </View>
      </View>

      {/* CONTROLES */}
      <SafeAreaView edges={['bottom']} style={s.controls}>

        <View style={s.statsRow}>
          {[
            { label: 'FPS',       value: fps.toFixed(0) },
            { label: 'FRAMES',    value: String(frames.length) },
            { label: 'DETECCIÓN', value: `${detectionRate}%`, color: detectionRate > 70 ? '#4ADE80' : '#FBBF24' },
            { label: 'PUNTOS',    value: String(keypoints.length) },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={s.statDivider} />}
              <View style={s.statItem}>
                <Text style={[s.statValue, stat.color ? { color: stat.color } : {}]}>
                  {stat.value}
                </Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={s.btnRow}>
          <TouchableOpacity style={s.sideBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
            <Text style={s.sideBtnText}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.playBtn} onPress={togglePlay}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity style={s.sideBtn} onPress={restart}>
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            <Text style={s.sideBtnText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>

        <View style={s.legend}>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: COLOR_DOT }]} />
            <Text style={s.legendText}>Articulaciones</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendLine, { backgroundColor: COLOR_LINE }]} />
            <Text style={s.legendText}>Conexiones</Text>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#000' },
  videoArea:        { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  videoWrapper:     { position: 'relative', overflow: 'hidden', backgroundColor: '#000' },
  badge:            { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeDot:         { width: 7, height: 7, borderRadius: 4 },
  badgeText:        { color: '#fff', fontSize: 11, fontWeight: '700' },
  frameCounter:     { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  frameCounterText: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  controls:         { backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 14 },
  statsRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 12, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  statItem:         { alignItems: 'center', gap: 2 },
  statValue:        { color: colors.white, fontSize: 18, fontWeight: '800' },
  statLabel:        { color: colors.textSecondary, fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  statDivider:      { width: 1, height: 28, backgroundColor: colors.border },
  btnRow:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  playBtn:          { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sideBtn:          { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.cardDark, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  sideBtnText:      { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  legend:           { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingBottom: 6 },
  legendItem:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:        { width: 9, height: 9, borderRadius: 5 },
  legendLine:       { width: 16, height: 2.5, borderRadius: 2 },
  legendText:       { color: colors.textSecondary, fontSize: 11 },
});
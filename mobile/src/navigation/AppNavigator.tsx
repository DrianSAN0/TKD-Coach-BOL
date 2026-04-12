import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import UploadVideoScreen from '../screens/UploadVideoScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ResultScreen from '../screens/ResultScreen';
import RankingScreen from '../screens/RankingScreen';
import RankingPesosScreen from '../screens/RankingPesosScreen';
import RankingTablaScreen from '../screens/RankingTablaScreen';
import CalendarScreen from '../screens/CalendarScreen';

export interface Keypoint {
  x: number; y: number; z: number; visibility: number;
}
export interface FrameData {
  frame: number; keypoints: Keypoint[];
}
export interface AnalysisData {
  fps: number; total_frames: number; width: number; height: number;
  connections: [number, number][]; frames: FrameData[];
}

export type RootStackParamList = {
  Home: undefined;
  Calendar: undefined;
  UploadVideo: undefined;
  Analysis: { videoUri: string; analysisData: AnalysisData; };
  Result: { score: number; stability: string; posture: string; framesCount: number; videoUri: string; };
  Ranking: undefined;
  RankingPesos: { categoria: string; genero: string; };
  RankingTabla: { categoria: string; genero: string; peso: string; };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0D0D0D' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UploadVideo" component={UploadVideoScreen} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
      <Stack.Screen name="RankingPesos" component={RankingPesosScreen} />
      <Stack.Screen name="RankingTabla" component={RankingTablaScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
}
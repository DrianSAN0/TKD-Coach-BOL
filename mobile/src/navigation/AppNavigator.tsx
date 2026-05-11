import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ScannerInicialScreen from '../screens/ScannerInicialScreen';
import ListaPoomsaeScreen from '../screens/ListaPoomsaeScreen';
import UploadVideoScreen from '../screens/UploadVideoScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import FelicidadesScreen from '../screens/FelicidadesScreen';
import ResultadosScreen from '../screens/ResultadosScreen';
import ResultScreen from '../screens/ResultScreen';
import RankingScreen from '../screens/RankingScreen';
import RankingPesosScreen from '../screens/RankingPesosScreen';
import RankingTablaScreen from '../screens/RankingTablaScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ListaCompetidoresScreen from '../screens/ListaCompetidoresScreen';
import LlaveCompetenciaScreen from '../screens/LlaveCompetenciaScreen';
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
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ScannerInicial: undefined;
  ListaPoomsae: undefined;
  UploadVideo: { poomsae?: string };
  Calendar: undefined;
  Analysis: { videoUri: string; analysisData: AnalysisData; poomsae?: string };
  Felicidades: { score: number; poomsae?: string; framesCount: number };
  Resultados: { score: number; poomsae?: string; framesCount: number };
  Result: { score: number; stability: string; posture: string; framesCount: number; videoUri: string };
  Ranking: undefined;
  RankingPesos: { categoria: string; genero: string };
  RankingTabla: { categoria: string; genero: string; peso: string };
  ListaCompetidores: { modalidad: string };
  LlaveCompetencia: { categoria: string; genero: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1E1E1E' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash"              component={SplashScreen} />
      <Stack.Screen name="Login"               component={LoginScreen} />
      <Stack.Screen name="Register"            component={RegisterScreen} />
      <Stack.Screen name="Home"                component={HomeScreen} />
      <Stack.Screen name="ScannerInicial"      component={ScannerInicialScreen} />
      <Stack.Screen name="ListaPoomsae"        component={ListaPoomsaeScreen} />
      <Stack.Screen name="UploadVideo"         component={UploadVideoScreen} />
      <Stack.Screen name="Analysis"            component={AnalysisScreen} />
      <Stack.Screen name="Felicidades"         component={FelicidadesScreen} />
      <Stack.Screen name="Resultados"          component={ResultadosScreen} />
      <Stack.Screen name="Result"              component={ResultScreen} />
      <Stack.Screen name="Ranking"             component={RankingScreen} />
      <Stack.Screen name="RankingPesos"        component={RankingPesosScreen} />
      <Stack.Screen name="RankingTabla"        component={RankingTablaScreen} />
      <Stack.Screen name="Calendar"            component={CalendarScreen} />
      <Stack.Screen name="ListaCompetidores"   component={ListaCompetidoresScreen} />
      <Stack.Screen name="LlaveCompetencia" component={LlaveCompetenciaScreen} />

    </Stack.Navigator>
  );
}
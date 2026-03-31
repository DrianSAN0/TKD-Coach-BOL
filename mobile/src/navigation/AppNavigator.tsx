import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import UploadVideoScreen from '../screens/UploadVideoScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ResultScreen from '../screens/ResultScreen';

export interface Keypoint {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface FrameData {
  frame: number;
  keypoints: Keypoint[];
}

export interface AnalysisData {
  fps: number;
  total_frames: number;
  width: number;
  height: number;
  connections: [number, number][];
  frames: FrameData[];
}

export type RootStackParamList = {
  Home: undefined;
  UploadVideo: undefined;
  Analysis: {
    videoUri: string;
    analysisData: AnalysisData;
  };
  Result: {
    score: number;
    stability: string;
    posture: string;
    framesCount: number;
    videoUri: string;
  };
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
    </Stack.Navigator>
  );
}
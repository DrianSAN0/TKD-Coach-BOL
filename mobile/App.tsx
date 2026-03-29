import React, { useState } from 'react';
import ScannerIntroScreen from './src/screens/ScannerIntroScreen';
import CameraScreen from './src/screens/CameraScreen';

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'camera'>('intro');

  if (screen === 'camera') {
    return <CameraScreen onBack={() => setScreen('intro')} />;
  }

  return <ScannerIntroScreen onStart={() => setScreen('camera')} />;
}
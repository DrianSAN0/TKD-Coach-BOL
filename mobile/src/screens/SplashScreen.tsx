import React, { useEffect, useRef } from 'react';
import {
  View, Animated, StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: Props) {
  const opacity  = useRef(new Animated.Value(0)).current;
  const scale    = useRef(new Animated.Value(0.6)).current;
  const bgOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fase 1: logo aparece (fade in + scale up)
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      // Fase 2: pausa
      Animated.delay(800),
      // Fase 3: fade out todo
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Home');
    });
  }, []);

  return (
    <View style={s.container}>
      <StatusBar backgroundColor="#E93735" barStyle="light-content" />
      <Animated.View style={[StyleSheet.absoluteFill, s.bg, { opacity: bgOpacity }]}>
        <Animated.Image
          source={require('../../assets/splash-icon.png')}
          style={[
            s.logo,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E93735',
  },
  bg: {
    backgroundColor: '#E93735',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
});
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TouchableOpacity, Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNavBar from '../components/BottomNavBar';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Felicidades'>;
  route: RouteProp<RootStackParamList, 'Felicidades'>;
};

export default function FelicidadesScreen({ navigation, route }: Props) {
  const { score, poomsae, framesCount } = route.params;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>

        <Animated.View style={[s.card, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={s.titulo}>! Felicidades !</Text>
          <View style={s.mensajeCard}>
            <Text style={s.mensaje}>
              ¡Buen trabajo! Has finalizado tu poomsae con éxito. Nuestro
              escáner biométrico ya está analizando tu desempeño. En breve
              podrás ver tus resultados y descubrir en qué aspectos puedes
              seguir mejorando. ¡Sigue entrenando y superándote!
            </Text>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={s.btn}
          onPress={() => navigation.replace('Resultados', {
            score,
            poomsae,
            framesCount,
          })}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>Ver Resultados</Text>
        </TouchableOpacity>

      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E' },
  content:   { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 32 },
  card:      { backgroundColor: '#5BBEBB', borderRadius: 20, padding: 28, width: '100%', alignItems: 'center', gap: 20 },
  titulo:    { color: '#1E1E1E', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  mensajeCard:{ backgroundColor: '#fff', borderRadius: 14, padding: 18, width: '100%' },
  mensaje:   { color: '#1E1E1E', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  btn:       { backgroundColor: '#E93735', borderRadius: 100, paddingVertical: 14, paddingHorizontal: 48, alignItems: 'center' },
  btnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
});
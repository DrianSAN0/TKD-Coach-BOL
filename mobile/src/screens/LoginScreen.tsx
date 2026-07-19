import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TextInput, TouchableOpacity, Alert,
  ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validarLogin } from '../utils/validacion';
const BACKEND_URL = 'http://10.0.2.2:8000';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [correo,     setCorreo]     = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading,    setLoading]    = useState(false);
  const [showPass,   setShowPass]   = useState(false);

const handleLogin = async () => {
    const errorValidacion = validarLogin({ correo, contrasena });
    if (errorValidacion) {
      Alert.alert('Error', errorValidacion);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al iniciar sesión');
      await AsyncStorage.setItem('tkd_usuario', JSON.stringify(data));
      navigation.replace('Home');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar backgroundColor="#1E1E1E" barStyle="light-content" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={s.header}>
          <Text style={s.titulo}>Inicio De sesión</Text>
        </View>

        {/* Bienvenida */}
        <View style={s.welcomeSection}>
          <Text style={s.bienvenido}>Bienvenido</Text>
          <Text style={s.descripcion}>
            TKD Coach BO te da la bienvenida en el camino del Taekwondo.
            Integra disciplina y tecnología para ayudarte a organizar tu
            progreso, mejorar tu técnica y alcanzar nuevas metas dentro
            y fuera del tatami.
          </Text>
        </View>

        {/* Formulario */}
        <View style={s.formCard}>
          <Text style={s.label}>Usuario o correo electrónico</Text>
          <TextInput
            style={s.input}
            placeholder="example@example.com"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={s.label}>Contraseña</Text>
          <View style={s.passWrap}>
            <TextInput
              style={[s.input, { flex: 1, marginBottom: 0 }]}
              placeholder="••••••••••••"
              placeholderTextColor="#999"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.forgotBtn}>
            <Text style={s.forgotText}>¿Olvidaste la contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* Botón login */}
        <TouchableOpacity
          style={[s.loginBtn, loading && s.disabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.loginBtnText}>Inicio de sesión</Text>}
        </TouchableOpacity>

        {/* Divider */}
        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>o</Text>
          <View style={s.dividerLine} />
        </View>

        {/* Registro */}
        <View style={s.registerRow}>
          <Text style={s.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#1E1E1E' },
  scroll:        { paddingHorizontal: 24, paddingBottom: 40 },
  header:        { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  titulo:        { color: '#E93735', fontSize: 20, fontWeight: '700' },
  welcomeSection:{ alignItems: 'center', paddingVertical: 24 },
  bienvenido:    { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  descripcion:   { color: '#fff', fontSize: 14, textAlign: 'center', lineHeight: 20, opacity: 0.8 },
  formCard:      { backgroundColor: '#2A2A2A', borderRadius: 20, padding: 20, marginBottom: 24 },
  label:         { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input:         { backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#232323', marginBottom: 8 },
  passWrap:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingRight: 12, marginBottom: 8 },
  eyeBtn:        { padding: 4 },
  forgotBtn:     { alignItems: 'flex-end', marginTop: 4 },
  forgotText:    { color: '#fff', fontSize: 12, opacity: 0.8 },
  loginBtn:      { backgroundColor: '#E93735', borderRadius: 100, paddingVertical: 14, alignItems: 'center', marginBottom: 24 },
  loginBtnText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  disabled:      { opacity: 0.6 },
  divider:       { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  dividerLine:   { flex: 1, height: 1, backgroundColor: '#444' },
  dividerText:   { color: '#fff', fontSize: 14, opacity: 0.6 },
  registerRow:   { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText:  { color: '#fff', fontSize: 14, opacity: 0.8 },
  registerLink:  { color: '#E93735', fontSize: 14, fontWeight: '600' },
});

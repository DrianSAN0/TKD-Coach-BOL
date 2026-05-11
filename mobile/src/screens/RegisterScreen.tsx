import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  TextInput, TouchableOpacity, Alert,
  ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const BACKEND_URL = 'http://10.0.2.2:8000';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [nombre,      setNombre]      = useState('');
  const [apellido,    setApellido]    = useState('');
  const [correo,      setCorreo]      = useState('');
  const [contrasena,  setContrasena]  = useState('');
  const [confirmar,   setConfirmar]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [aceptado,    setAceptado]    = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellido || !correo || !contrasena || !confirmar) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    if (contrasena !== confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (!aceptado) {
      Alert.alert('Error', 'Debés aceptar los términos y condiciones');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, correo, contrasena }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al registrarse');
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
        { text: 'Iniciar sesión', onPress: () => navigation.replace('Login') }
      ]);
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#E93735" />
          </TouchableOpacity>
          <Text style={s.titulo}>Crear una cuenta</Text>
        </View>

        <Text style={s.subtitulo}>¡Empecemos!</Text>

        {/* Formulario */}
        <View style={s.formCard}>
          <Text style={s.label}>Nombre completo</Text>
          <TextInput
            style={s.input}
            placeholder="Tu nombre"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={s.label}>Apellido</Text>
          <TextInput
            style={s.input}
            placeholder="Tu apellido"
            placeholderTextColor="#999"
            value={apellido}
            onChangeText={setApellido}
          />

          <Text style={s.label}>Email</Text>
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

          <Text style={s.label}>Confirmar contraseña</Text>
          <TextInput
            style={s.input}
            placeholder="••••••••••••"
            placeholderTextColor="#999"
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry={!showPass}
          />
        </View>

        {/* Términos */}
        <TouchableOpacity style={s.termsRow} onPress={() => setAceptado(!aceptado)}>
          <View style={[s.checkbox, aceptado && s.checkboxActivo]}>
            {aceptado && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={s.termsText}>
            Acepto todos los{' '}
            <Text style={s.termsLink}>Términos de uso</Text>
            {' '}y{' '}
            <Text style={s.termsLink}>Políticas de privacidad.</Text>
          </Text>
        </TouchableOpacity>

        {/* Botón */}
        <TouchableOpacity
          style={[s.registerBtn, loading && s.disabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.registerBtnText}>Crear cuenta</Text>}
        </TouchableOpacity>

        {/* Ya tengo cuenta */}
        <View style={s.loginRow}>
          <Text style={s.loginText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={s.loginLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#1E1E1E' },
  scroll:         { paddingHorizontal: 24, paddingBottom: 40 },
  header:         { flexDirection: 'row', alignItems: 'center', paddingTop: 16, paddingBottom: 8 },
  backBtn:        { marginRight: 12 },
  titulo:         { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitulo:      { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  formCard:       { backgroundColor: '#2A2A2A', borderRadius: 20, padding: 20, marginBottom: 20 },
  label:          { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input:          { backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#232323', marginBottom: 4 },
  passWrap:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingRight: 12, marginBottom: 4 },
  eyeBtn:         { padding: 4 },
  termsRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  checkbox:       { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: '#5BBEBB', alignItems: 'center', justifyContent: 'center' },
  checkboxActivo: { backgroundColor: '#5BBEBB' },
  termsText:      { color: '#fff', fontSize: 13, flex: 1, lineHeight: 20 },
  termsLink:      { color: '#E93735', fontWeight: '600' },
  registerBtn:    { backgroundColor: '#E93735', borderRadius: 100, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  registerBtnText:{ color: '#fff', fontSize: 16, fontWeight: '700' },
  disabled:       { opacity: 0.6 },
  loginRow:       { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText:      { color: '#fff', fontSize: 14, opacity: 0.8 },
  loginLink:      { color: '#E93735', fontSize: 14, fontWeight: '600' },
});

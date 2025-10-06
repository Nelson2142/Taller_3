import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/api';

export default function Inicio({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion() {
    setCargando(true);
    try {
      const respuesta = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password: clave }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.msg || 'Error de autenticación');

      await AsyncStorage.setItem('token', datos.token);
      navigation.reset({ index: 0, routes: [{ name: 'Principal' }] });
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Usuario"
        placeholderTextColor="#888888"
        value={usuario}
        onChangeText={setUsuario}
        style={estilos.entrada}
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#888888"
        value={clave}
        secureTextEntry
        onChangeText={setClave}
        style={estilos.entrada}
      />

      <TouchableOpacity style={estilos.boton} onPress={iniciarSesion} disabled={cargando}>
        <Text style={estilos.textoBoton}>{cargando ? 'Cargando...' : 'Ingresar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0f1720',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: { fontSize: 26, color: '#ffffff', marginBottom: 20 },
  entrada: {
    width: '100%',
    backgroundColor: '#111827',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#0ea5a4',
    padding: 12,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: { color: '#081018', fontWeight: 'bold' }
});
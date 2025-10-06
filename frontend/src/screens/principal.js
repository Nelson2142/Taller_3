import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { llamarApi } from '../utils/api';

export default function Principal({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [refrescando, setRefrescando] = useState(false);

  async function cargarProductos() {
    try {
      const datos = await llamarApi('/productos', { method: 'GET' });
      setProductos(datos);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }

  useEffect(() => {
    const focus = navigation.addListener('focus', cargarProductos);
    cargarProductos();
    return focus;
  }, []);

  async function cerrarSesion() {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Inventario</Text>
        <TouchableOpacity style={estilos.botonSalir} onPress={cerrarSesion}>
          <Text style={estilos.textoSalir}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productos}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={async () => {
              setRefrescando(true);
              await cargarProductos();
              setRefrescando(false);
            }}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={estilos.item}
            onPress={() => navigation.navigate('Producto', { idProducto: item.id })}
          >
            <Text style={estilos.nombre}>{item.nombre}</Text>
            <Text style={estilos.stock}>Stock: {item.stock}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={estilos.contenedorBoton}>
        <TouchableOpacity style={estilos.botonCamara} onPress={() => navigation.navigate('Escaner')}>
          <Text style={estilos.iconoCamara}>📷</Text>
          <Text style={estilos.textoCamara}>Escanear QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0b1220', padding: 12 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titulo: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  botonSalir: { backgroundColor: '#111827', padding: 10, borderRadius: 8 },
  textoSalir: { color: '#f87171', fontWeight: 'bold' },

  item: { backgroundColor: '#0f1724', padding: 12, borderRadius: 8, marginBottom: 8 },
  nombre: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  stock: { color: '#9ca3af', marginTop: 6 },

  contenedorBoton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  botonCamara: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5a4',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#0ea5a4',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  iconoCamara: {
    fontSize: 26,
    marginRight: 10,
    color: '#081018',
  },
  textoCamara: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#081018',
  },
});
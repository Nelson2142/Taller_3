import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { llamarApi } from '../utils/api';

export default function Producto({ route, navigation }) {
  const { idProducto } = route.params;
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState('1');

  async function cargarProducto() {
    try {
      const datos = await llamarApi(`/productos/${idProducto}`, { method: 'GET' });
      setProducto(datos);
    } catch (err) {
      Alert.alert('Error', err.message);
      navigation.goBack();
    }
  }

  useEffect(() => { cargarProducto(); }, []);

  async function disminuirStock() {
    const delta = -Math.abs(parseInt(cantidad));
    try {
      const datos = await llamarApi(`/productos/${idProducto}`, {
        method: 'PUT',
        body: JSON.stringify({ delta }),
      });
      setProducto(datos);
      Alert.alert('Stock actualizado', `Nuevo stock: ${datos.stock}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }

  if (!producto) return <View style={estilos.contenedor}><Text>Cargando...</Text></View>;

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.nombre}>{producto.nombre}</Text>
      <Text style={estilos.stock}>Stock actual: {producto.stock}</Text>

      <Text style={estilos.label}>Introduzca la cantidad solicitada:</Text>
      <TextInput
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
        style={estilos.entrada}
      />
      <TouchableOpacity style={estilos.boton} onPress={disminuirStock}>
        <Text style={estilos.textoBoton}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0b1220', padding: 16 },
  nombre: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  stock: { color: '#9ca3af', marginBottom: 12 },
  label: { color: '#9ca3af' },
  entrada: { backgroundColor: '#111827', color: '#ffffff', padding: 10, borderRadius: 8, marginTop: 8 },
  boton: { marginTop: 15, backgroundColor: '#0ea5a4', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#081018', fontWeight: 'bold' },
});
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function Escaner({ navigation }) {
  const [permiso, solicitarPermiso] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);

  useEffect(() => {
    if (permiso === null) {
      solicitarPermiso();
    }
  }, [permiso]);

  const manejarEscaneo = ({ data }) => {
    if (escaneado) return;
    setEscaneado(true);
    const id = parseInt(data);
    if (!id) {
      Alert.alert('Código no válido');
      setEscaneado(false);
      return;
    }
    navigation.replace('Producto', { idProducto: id });
  };

  if (!permiso || permiso.status !== 'granted') {
    return (
      <View style={estilos.contenedor}>
        <Text style={estilos.texto}>Solicitando permiso para cámara...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barCodeTypes: ['qr'] }}
        onBarcodeScanned={escaneado ? undefined : manejarEscaneo}
      />
      <View style={estilos.overlay}>
        <Text style={estilos.hint}>Apunta al código QR del producto</Text>
        <TouchableOpacity style={estilos.boton} onPress={() => navigation.goBack()}>
          <Text style={estilos.textoBoton}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#000000' },
  overlay: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  hint: { color: '#ffffff', marginBottom: 10 },
  boton: { backgroundColor: '#0ea5a4', padding: 10, borderRadius: 8 },
  textoBoton: { color: '#081018', fontWeight: 'bold' },
  texto: { color: '#ffffff' },
});
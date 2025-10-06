import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Inicio from '../screens/inicio';
import Principal from '../screens/principal';
import Escaner from '../screens/escaner';
import Producto from '../screens/producto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StackNavegacion = createStackNavigator();

export default function Stack() {
  const [rutaInicial, setRutaInicial] = useState('Inicio');

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) setRutaInicial('Principal');
    })();
  }, []);

  return (
    <StackNavegacion.Navigator initialRouteName={rutaInicial}>
      <StackNavegacion.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
      <StackNavegacion.Screen name="Principal" component={Principal} />
      <StackNavegacion.Screen name="Escaner" component={Escaner} />
      <StackNavegacion.Screen name="Producto" component={Producto} />
    </StackNavegacion.Navigator>
  );
}
import AsyncStorage from '@react-native-async-storage/async-storage';

//Esta url debe cambiarse en base a la ip del dispositivo o emulador
//Para emulador android puede usar
export const API_URL = 'http://10.0.2.2:3000';

async function obtenerToken() {
  return await AsyncStorage.getItem('token');
}

export async function llamarApi(ruta, opciones = {}) {
  const token = await obtenerToken();
  const headers = opciones.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const respuesta = await fetch(API_URL + ruta, { ...opciones, headers });
  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) throw new Error(datos.msg || 'Error en la API');
  return datos;
}
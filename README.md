# Desafío práctico #3: Sistema de inventario inteligente

## Backend – API REST 
API REST hecha con **Node.js** y **Express**, con autenticación JWT y almacenamiento en memoria.

## Endpoints principales
- `POST /login` → Iniciar sesión
- `GET /productos` → Listar productos
- `GET /productos/:id` → Ver producto
- `PUT /productos/:id` → Actualizar stock

## Usuario de prueba

username: admin
password: 1234

## Cómo ejecutar
Recuerde cambiar las variables de entorno en el archivo .env
```bash
npm install
npm run dev
```

## Frontend – App Móvil

Aplicación móvil desarrollada con **React Native** y **Expo**.

## Funcionalidades principales
- Inicio de sesión con validación de token JWT.
- Escaneo de códigos QR con `expo-camera`.
- Consulta de información de productos.
- Actualización de stock directamente desde la app.

## Cómo ejecutar
Recuerde cambiar la ip en el código dependiendo del dispositivo que use, ya está comentariado en el código donde debe hacer el cambio.
```bash
npm install
npm run start
```
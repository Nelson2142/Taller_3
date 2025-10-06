// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto';

// Usuario de prueba (password = 1234)
const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('1234', 10) }
];

// Productos en memoria
let productos = [
  { id: 1, nombre: 'Tinta UV', stock: 10 },
  { id: 2, nombre: 'Vinil Blanco', stock: 25 },
  { id: 3, nombre: 'Hilo Bordado', stock: 5 }
];

// ---------------- LOGIN ----------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: 'Faltan datos' });

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ msg: 'Usuario no encontrado' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ msg: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '4h' });
  res.json({ token });
});

// ---------------- MIDDLEWARE JWT ----------------
function verificarToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ msg: 'Token requerido' });

  const [bearer, token] = header.split(' ');
  if (bearer !== 'Bearer' || !token)
    return res.status(400).json({ msg: 'Token mal formado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Token inválido' });
    req.user = user;
    next();
  });
}

// ---------------- PRODUCTOS ----------------
app.get('/productos', verificarToken, (req, res) => {
  res.json(productos);
});

app.get('/productos/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (!producto) return res.status(404).json({ msg: 'No encontrado' });
  res.json(producto);
});

app.put('/productos/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (!producto) return res.status(404).json({ msg: 'No encontrado' });

  const { delta, stock } = req.body;

  if (typeof delta === 'number') {
    producto.stock += delta;
  } else if (typeof stock === 'number') {
    producto.stock = stock;
  } else {
    return res.status(400).json({ msg: 'Debe enviar delta o stock' });
  }

  if (producto.stock < 0) producto.stock = 0;
  res.json(producto);
});

// ---------------- INICIAR SERVIDOR ----------------
app.listen(PORT, () => console.log(`✅ API corriendo en http://localhost:${PORT}`));

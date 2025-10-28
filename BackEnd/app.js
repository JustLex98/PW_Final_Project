require("dotenv").config(); // Carga las variables del archivo .env al inicio.

// Línea de prueba para verificar que las variables se carguen.
console.log('Valor de DB_SERVER en Node:', process.env.DB_SERVER); 

const express = require("express");
const cors = require("cors"); // Módulo sugerido por la IA para evitar errores CORS en el navegador.
const authRoutes = require("./routes/authRoutes"); // Importa el archivo de rutas de autenticación.

const app = express();
// Puerto de escucha. Usa la variable de entorno PORT o 3001 por defecto.
const PORT = process.env.PORT || 3001;

// ---------------------------
// MIDDLEWARES GLOBALES
// ---------------------------

// Middleware sugerido por la IA para manejar CORS. Permite la comunicación desde el Frontend (React).
app.use(cors());

// Middleware para procesar solicitudes JSON (permite leer 'req.body' en las rutas POST como login/register).
app.use(express.json());

// Ruta simple para verificar que el servidor base está corriendo.
app.get("/", (req, res) => {
  res.send("Servidor ServiConecta Backend en funcionamiento.");
});

// ---------------------------
// CONEXIÓN DE RUTAS
// ---------------------------

// Conecta las rutas de autenticación importadas.
// Todas las rutas dentro de authRoutes (como /register) ahora son accesibles vía /api/auth/...
app.use("/api/auth", authRoutes);

// ---------------------------
// INICIO DEL SERVIDOR
// ---------------------------

// El servidor empieza a escuchar peticiones en el puerto definido.
app.listen(PORT, () => {
  console.log(
    `✅ Servidor de ServiConecta corriendo en http://localhost:${PORT}`
  );
  console.log(`   Rutas de Auth: http://localhost:${PORT}/api/auth/register`);
});

require("dotenv").config(); // Asegura que las variables de .env estén disponibles

console.log('Valor de DB_SERVER en Node:', process.env.DB_SERVER); // Verifica que las variables de entorno se carguen correctamente

const express = require("express");
const cors = require("cors"); // Middleware para permitir peticiones desde el Frontend (React)
const authRoutes = require("./routes/authRoutes"); // Importa las rutas de autenticación

const app = express();
// Puerto de escucha. Si no está en .env, usa 3001 por defecto.
const PORT = process.env.PORT || 3001;

// ---------------------------
// MIDDLEWARES DE LA APLICACIÓN
// ---------------------------

// Habilitar CORS para permitir que el frontend se comunique con el backend
// En desarrollo, 'cors()' sin argumentos funciona. Para producción, se recomienda restringir a un dominio específico.
app.use(cors());

// Middleware para parsear cuerpos de solicitud JSON (necesario para leer req.body en login y register)
app.use(express.json());

// Middleware de prueba simple para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor ServiConecta Backend en funcionamiento.");
});

// ---------------------------
// CONEXIÓN DE RUTAS
// ---------------------------

// Conectar las rutas de autenticación. Todas las rutas aquí comenzarán con /api/auth
app.use("/api/auth", authRoutes);

// ---------------------------
// INICIO DEL SERVIDOR
// ---------------------------

app.listen(PORT, () => {
  console.log(
    `✅ Servidor de ServiConecta corriendo en http://localhost:${PORT}`
  );
  console.log(`   Rutas de Auth: http://localhost:${PORT}/api/auth/register`);
});

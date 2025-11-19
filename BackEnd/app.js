require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const contractorRoutes = require('./routes/contractorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const publicRoutes = require('./routes/publicRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes'); // <-- 1. IMPORTAR

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("Servidor ServiConecta Backend en funcionamiento.");
});

// CONEXIÓN DE RUTAS
app.use("/api/auth", authRoutes);
app.use('/api/contractor', contractorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/requests', serviceRequestRoutes); // <-- 2. CONECTAR

// INICIO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`✅ Servidor de ServiConecta corriendo en http://localhost:${PORT}`);
});

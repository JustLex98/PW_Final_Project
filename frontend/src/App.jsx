// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import HomeLogged from "./pages/HomeLogged";
import Register from "./pages/Register";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import NotFound from "./pages/NotFound";
import WorkerForm from "./pages/WorkerForm";

// Componente para proteger rutas
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // si no hay token, manda a login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home pública */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Formulario para completar perfil de trabajador */}
        <Route path="/complete-profile" element={<WorkerForm />} />

        {/* Home después de login */}
        <Route path="/inicio" element={<HomeLogged />} />

        {/* Lista de perfiles (pública por ahora) */}
        <Route path="/profiles" element={<Profiles />} />

        {/* Detalle de perfil (protegido por login) */}
        <Route
          path="/profile/:id"
          element={
            <RequireAuth>
              <ProfileDetail />
            </RequireAuth>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

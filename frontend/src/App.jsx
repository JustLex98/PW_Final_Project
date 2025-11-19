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
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<WorkerForm />} />


        {/* si quieres mantener esta página de lista extra */}
        <Route path="/profiles" element={<Profiles />} />

        {/* Detalle protegido: solo logueado */}
        <Route
          path="/profile/:id"
          element={
            <RequireAuth>
              <ProfileDetail />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const location = useLocation();

  // aquí lees el token como lo guardas en el login
  const token = localStorage.getItem("token"); // o "authToken", como lo tengas

  if (!token) {
    // si NO hay token, manda al login y guarda de dónde venía
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // si hay token, deja pasar a la ruta protegida
  return <Outlet />;
};

export default RequireAuth;

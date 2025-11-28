import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const location = useLocation();

  // aquí lee el token 
  const token = localStorage.getItem("token");

  if (!token) {
    // si NO hay token, manda al login
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // si hay token deja pasar 
  return <Outlet />;
};

export default RequireAuth;

// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import HomeLogged from "./pages/HomeLogged";
import Register from "./pages/Register";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import NotFound from "./pages/NotFound";
import WorkerForm from "./pages/WorkerForm";
import ReviewForm from "./pages/ReviewForm";

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

        {/* RUTAS PROTEGIDAS CON RequireAuth */}
        <Route element={<RequireAuth />}>
          <Route path="/profile/:id" element={<ProfileDetail />} />
          <Route path="/profile/:id/review" element={<ReviewForm />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

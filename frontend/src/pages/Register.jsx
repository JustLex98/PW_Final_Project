// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client", // "client" | "worker"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const userRole =
      formData.role === "worker" ? "Contratista" : "Cliente";

    try {
      setLoading(true);

      // 1) REGISTRO
      await api.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userRole,
      });

      // 2) LOGIN AUTOMÁTICO
      const loginRes = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = loginRes.data || {};

      // 3) GUARDAR SESIÓN
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
      }
      if (user?.UserID) {
        localStorage.setItem("userId", user.UserID);
      }
      if (user?.UserRole) {
        localStorage.setItem("userRole", user.UserRole);
      }

      setSuccess("Usuario registrado exitosamente.");

      // 4) NAVEGAR SEGÚN ROL
      if (userRole === "Contratista") {
        navigate("/complete-profile", {
          state: {
            firstName: user?.FirstName || formData.firstName,
            lastName: user?.LastName || formData.lastName,
            email: user?.Email || formData.email,
          },
        });
      } else {
        // Cliente
        navigate("/inicio");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.status === 409
          ? "Este correo ya está registrado."
          : err.response?.data?.message ||
            "Ocurrió un error al registrar. Inténtalo de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-logo">
        <img src="/serviconecta-logo-sin-letras.png" alt="ServiConecta" />
        <span className="auth-logo-text">
          Servi<span className="auth-logo-highlight">Conecta</span>
        </span>
      </div>

      <h1 className="title">Crea tu cuenta</h1>
      <p className="subtitle">
        Regístrate en ServiConecta para ofrecer tus servicios o contratar
        profesionales de confianza.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <select
          className="input"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="client">Quiero contratar profesionales</option>
          <option value="worker">Quiero ofrecer mis servicios</option>
        </select>

        {error && <p className="login-error">{error}</p>}
        {success && (
          <p style={{ color: "lightgreen", marginTop: "4px" }}>{success}</p>
        )}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
}

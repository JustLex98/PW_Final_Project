import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/inicio";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("⚠ Debes ingresar tu correo y contraseña.");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userRole", res.data.role);

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Algo salió mal al iniciar sesión."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="auth-logo">
        <img src="/serviconecta-logo-sin-letras.png" alt="ServiConecta" />
        <span className="auth-logo-text">
          Servi<span className="auth-logo-highlight">Conecta</span>
        </span>
      </div>

      <h1 className="login-title">Iniciar sesión</h1>
      <p className="login-subtitle">
        Ingresa con tu cuenta para contactar trabajadores
        o gestionar tus servicios.
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button className="login-button" type="submit">
          Entrar
        </button>
      </form>

      <p className="login-footer-text">
        ¿No tienes cuenta?{" "}
        <span
          style={{ color: "#ff8c00", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Regístrate aquí
        </span>
      </p>
    </div>
  );
}

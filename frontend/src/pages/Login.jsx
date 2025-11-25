import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // o "../styles/Login.css" según cómo se llame tu archivo

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // que no recargue la página

    if (!email.trim() || !password.trim()) {
      setError("⚠ Debes ingresar tu correo y contraseña.");
      return;
    }

    setError(""); // limpia el mensaje si todo está bien
    navigate("/profiles"); // redirige a la página de perfiles
  };

  return (
    <div className="login-container">
      <div className="auth-logo">
        <img src="/serviconecta-logo-dark.png" alt="ServiConecta" />
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
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <button className="login-button" type="submit">
          Entrar
        </button>
      </form>

      <p className="login-footer-text">
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}

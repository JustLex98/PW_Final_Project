import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("⚠ Debes ingresar tu correo y contraseña.");
      return;
    }

    setError(""); // limpia el mensaje si todo está bien
    navigate("/profiles"); // redirige a la página de perfiles
  };

  return (
    <div className="login-wrapper">
      <h1>Iniciar sesión</h1>
      <form>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>} {/* mensaje de error */}
        <button type="button" onClick={handleLogin}>
          Entrar
        </button>
      </form>
    </div>
  );
}

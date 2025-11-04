import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css"; 

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("⚠ Todos los campos son obligatorios.");
      return;
    }

    setError(""); // limpia el mensaje si todo está bien
    navigate("/profiles");
  };

  return (
    <div className="container">
      <h1 className="title">Crear cuenta</h1>
      <p className="subtitle">
        Estoy buscando a un pro! / Estoy buscando Trabajo!
      </p>
      <form className="form">
        <input
          placeholder="Nombre"
          className="input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>} {/* mensaje de error */}
        <button type="button" className="button" onClick={handleRegister}>
          Registrarme
        </button>
      </form>
    </div>
  );
}

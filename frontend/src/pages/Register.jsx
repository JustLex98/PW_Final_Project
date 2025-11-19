// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState(""); // "cliente" | "contratista"
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("⚠ Todos los campos son obligatorios.");
      return;
    }

    if (!tipoCuenta) {
      setError("⚠ Selecciona si buscas un pro o si buscas trabajo.");
      return;
    }

    setError("");

    // Aquí luego harías el POST a la API para crear el usuario
    // y guardarías el rol (tipoCuenta)

    if (tipoCuenta === "contratista") {
      // lo mando al formulario de perfil de contratista
      navigate("/contractor-profile", {
        state: { nombre, email }, // opcional: para prellenar cosas allá
      });
    } else {
      // cliente normal → ver lista de pros
      navigate("/profiles");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Crear cuenta</h1>

      {/* Selector de tipo de cuenta */}
      <button
        type="button"
        className={`button tipo-cuenta ${
          tipoCuenta === "cliente" ? "tipo-cuenta-activo" : ""
        }`}
        onClick={() => setTipoCuenta("cliente")}
      >
        ¡Estoy buscando a un pro!
      </button>

      <button
        type="button"
        className={`button tipo-cuenta ${
          tipoCuenta === "contratista" ? "tipo-cuenta-activo" : ""
        }`}
        onClick={() => setTipoCuenta("contratista")}
      >
        ¡Estoy buscando Trabajo!
      </button>

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

        {error && <p className="error">{error}</p>}

        <button type="button" className="button" onClick={handleRegister}>
          Registrarme
        </button>
      </form>
    </div>
  );
}

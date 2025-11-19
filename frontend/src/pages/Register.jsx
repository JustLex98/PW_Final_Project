import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "worker", // lex revisa esto
  });

  const [error, setError] = useState("");

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

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Aquí iría tu llamada real al backend:
      // await axios.post("http://tu-backend/api/auth/register", {
      //   email: formData.email,
      //   password: formData.password,
      //   role: formData.role,
      // });

      console.log("Usuario registrado (fake):", formData);

      // Después de registrarse, lo mandamos a llenar su perfil
      navigate("/complete-profile");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al registrar. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="container">
      <div className="auth-logo">
        <img src="/serviconecta-logo-sin-letras.jpg" alt="ServiConecta" />
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
          <option value="worker">Quiero ofrecer mis servicios</option>
          <option value="client">Quiero contratar profesionales</option>
        </select>

        {error && (
          <p
            style={{
              color: "salmon",
              fontSize: "0.9rem",
              margin: 0,
              marginTop: "4px",
            }}
          >
            {error}
          </p>
        )}

        <button className="button" type="submit">
          Registrarme
        </button>
      </form>
    </div>
  );
};

export default Register;

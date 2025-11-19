// src/pages/WorkerForm.jsx
import React, { useState } from "react";
import "../styles/Register.css"; // reutilizamos el estilo del register

const WorkerForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    LastName: "",
    Email: "",
    BusinessName: "",
    PhoneNumber: "",
    Bio: "",
    YearsOfEcperience: "",
    categroies: [],   // ojo: lo dejamos tal como lo escribiste
  });

  const categoriesOptions = [
    "Carpintero",
    "Electricista",
    "Plomero",
    "Pintor",
    "Limpieza",
    "Jardinería",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        // agregar categoría al array
        return {
          ...prev,
          categroies: [...prev.categroies, value],
        };
      } else {
        // quitar categoría del array
        return {
          ...prev,
          categroies: prev.categroies.filter((c) => c !== value),
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del trabajador:", formData);
    alert("Perfil guardado (por ahora solo en consola 😄)");
    // aquí luego haces el POST al backend y rediriges donde quieras
  };

  return (
    <div className="container">
      {/* Logo en esquina */}
      <div className="auth-logo">
        <img src="/serviconecta-logo-dark.png" alt="ServiConecta" />
        <span className="auth-logo-text">
          Servi<span className="auth-logo-highlight">Conecta</span>
        </span>
      </div>

      <h1 className="title">Completa tu perfil</h1>
      <p className="subtitle">
        Esta información aparecerá en tu perfil público de ServiConecta.
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
          name="LastName"
          placeholder="Apellido"
          value={formData.LastName}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="email"
          name="Email"
          placeholder="Correo electrónico"
          value={formData.Email}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="text"
          name="BusinessName"
          placeholder="Nombre del negocio (opcional)"
          value={formData.BusinessName}
          onChange={handleChange}
        />

        <input
          className="input"
          type="tel"
          name="PhoneNumber"
          placeholder="Teléfono de contacto"
          value={formData.PhoneNumber}
          onChange={handleChange}
        />

        <textarea
          className="input"
          name="Bio"
          placeholder="Cuéntanos brevemente sobre ti y lo que haces"
          rows={4}
          value={formData.Bio}
          onChange={handleChange}
        />

        <input
          className="input"
          type="number"
          name="YearsOfEcperience"
          placeholder="Años de experiencia"
          min="0"
          value={formData.YearsOfEcperience}
          onChange={handleChange}
        />

        {/* Categorías (categroies[]) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            Selecciona tus categorías de servicio:
          </span>
          {categoriesOptions.map((cat) => (
            <label
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9rem",
              }}
            >
              <input
                type="checkbox"
                value={cat}
                checked={formData.categroies.includes(cat)}
                onChange={handleCategoryChange}
              />
              {cat}
            </label>
          ))}
        </div>

        <button className="button" type="submit">
          Guardar perfil
        </button>
      </form>
    </div>
  );
};

export default WorkerForm;

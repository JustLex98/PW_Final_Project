
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/register.css"; // reutilizamos el estilo de la tarjeta

export default function ContractorProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nombre, email } = location.state || {};

  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (
      !businessName.trim() ||
      !phoneNumber.trim() ||
      !bio.trim() ||
      !yearsOfExperience.trim()
    ) {
      setError("⚠ Todos los campos son obligatorios.");
      return;
    }

    setError("");

    // Aquí harías tu POST a la API:
    // /api/contractor-profiles
    // body: { businessName, phoneNumber, bio, yearsOfExperience, userName: nombre, email }

    console.log({
      userName: nombre,
      email,
      businessName,
      phoneNumber,
      bio,
      yearsOfExperience,
    });

    // Después de guardar, por ejemplo lo mando a ver los perfiles
    navigate("/profiles");
  };

  return (
    <div className="container">
      <h1 className="title">Completa tu perfil de contratista</h1>

      <div className="form">
        {nombre && (
          <p className="helper-text">
            Creando perfil para <strong>{nombre}</strong> ({email})
          </p>
        )}

        <input
          className="input"
          placeholder="Oficio"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Número de teléfono"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Bio (cuéntale a los clientes sobre ti)"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          className="input"
          type="number"
          min="0"
          placeholder="Años de experiencia"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="button" className="button" onClick={handleSubmit}>
          Guardar perfil
        </button>
      </div>
    </div>
  );
}

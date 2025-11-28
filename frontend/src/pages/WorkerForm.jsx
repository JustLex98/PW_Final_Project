// src/pages/WorkerForm.jsx
import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const WorkerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRegister = location.state || {};

  const [formData, setFormData] = useState({
    firstName: formRegister.firstName || "",
    lastName: formRegister.lastName || "",
    email: formRegister.email || "",
    BusinessName: "",
    PhoneNumber: "",
    Bio: "",
    YearsOfEcperience: "",
    priceMin: "",
    priceMax: "",
    categoryId: "", // un solo servicio principal
  });

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState("");

  // 👇 nuevo: estado para cargar el perfil actual
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  // 1) Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCats(true);
        setCatsError("");
        const res = await api.get("/public/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        setCatsError(
          err.response?.data?.message ||
            "No se pudieron cargar las categorías."
        );
      } finally {
        setLoadingCats(false);
      }
    };

    fetchCategories();
  }, []);

  // 2) Cargar perfil del contratista logueado y rellenar el form
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // si no hay token, no intentamos llamar al backend
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        setProfileError("");

        const res = await api.get("/contractor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data) {
          setFormData((prev) => ({
            ...prev,
            // si algo viene vacío de la BD, dejamos lo que ya teníamos
            firstName: data.FirstName ?? prev.firstName,
            lastName: data.LastName ?? prev.lastName,
            email: data.Email ?? prev.email,
            BusinessName: data.BusinessName || "",
            PhoneNumber: data.PhoneNumber || "",
            Bio: data.Bio || "",
            YearsOfEcperience: data.YearsOfExperience
              ? String(data.YearsOfExperience)
              : "",
            priceMin: data.PriceMin != null ? String(data.PriceMin) : "",
            priceMax: data.PriceMax != null ? String(data.PriceMax) : "",
            categoryId: data.CategoryID ? String(data.CategoryID) : "",
          }));
        }
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setProfileError(
          err.response?.data?.message ||
            "No se pudo cargar tu perfil actual."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // radio: un solo servicio principal
  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para guardar tu perfil.");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        businessName: formData.BusinessName,
        phoneNumber: formData.PhoneNumber,
        bio: formData.Bio,
        yearsOfExperience: Number(formData.YearsOfEcperience || 0),
        priceMin: formData.priceMin ? Number(formData.priceMin) : null,
        priceMax: formData.priceMax ? Number(formData.priceMax) : null,
        // el backend espera un array
        categoryIds: formData.categoryId ? [Number(formData.categoryId)] : [],
      };

      await api.put("/contractor/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Perfil guardado correctamente ✅");
      navigate("/inicio"); // o la ruta que uses como home logueado
    } catch (err) {
      console.error("Error al guardar el perfil:", err);
      alert(
        err.response?.data?.message ||
          "Ocurrió un error al guardar el perfil."
      );
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

      <h1 className="title">Completa tu perfil</h1>
      <p className="subtitle">
        Esta información aparecerá en tu perfil público de ServiConecta.
      </p>

      {(loadingProfile || loadingCats) && (
        <p style={{ color: "white", marginBottom: "10px" }}>
          Cargando datos...
        </p>
      )}
      {profileError && (
        <p style={{ color: "red", marginBottom: "10px" }}>{profileError}</p>
      )}

      <form className="form form--wide" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre</label>
            <input
              className="input"
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Apellido */}
          <div className="form-group">
            <label>Apellido</label>
            <input
              className="input"
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label>Teléfono de contacto</label>
            <input
              className="input"
              type="tel"
              name="PhoneNumber"
              placeholder="Teléfono de contacto"
              value={formData.PhoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Nombre del negocio */}
          <div className="form-group form-group--full">
            <label>Nombre del negocio (opcional)</label>
            <input
              className="input"
              type="text"
              name="BusinessName"
              placeholder="Nombre del negocio (opcional)"
              value={formData.BusinessName}
              onChange={handleChange}
            />
          </div>

          {/* Bio */}
          <div className="form-group form-group--full">
            <label>Cuéntanos brevemente sobre ti y lo que haces</label>
            <textarea
              className="input"
              name="Bio"
              rows={4}
              placeholder="Cuéntanos brevemente sobre ti y lo que haces"
              value={formData.Bio}
              onChange={handleChange}
            />
          </div>

          {/* Años de experiencia */}
          <div className="form-group">
            <label>Años de experiencia</label>
            <input
              className="input"
              type="number"
              name="YearsOfEcperience"
              placeholder="Años de experiencia"
              min="0"
              value={formData.YearsOfEcperience}
              onChange={handleChange}
            />
          </div>

          {/* Título rango */}
          <div className="form-group form-group--full">
            <label style={{ fontWeight: 600 }}>Establece un rango:</label>
          </div>

          {/* Precio mínimo */}
          <div className="form-group">
            <label>Desde...</label>
            <input
              className="input"
              type="number"
              name="priceMin"
              placeholder="Precio mínimo (ej. 10)"
              min="0"
              step="5.0"
              value={formData.priceMin}
              onChange={handleChange}
            />
          </div>

          {/* Precio máximo */}
          <div className="form-group">
            <label>hasta.../ hora</label>
            <input
              className="input"
              type="number"
              name="priceMax"
              placeholder="Precio máximo (ej. 20)"
              min={formData.priceMin || 0}
              step="5.0"
              value={formData.priceMax}
              onChange={handleChange}
            />
          </div>

          {/* Categoría */}
          <div className="form-group form-group--full">
            <label style={{ fontSize: "0.9rem" }}>
              Selecciona tu servicio principal:
            </label>

            {loadingCats && <span>Cargando servicios...</span>}
            {catsError && (
              <span style={{ color: "red", fontSize: "0.85rem" }}>
                {catsError}
              </span>
            )}

            {!loadingCats &&
              !catsError &&
              categories.map((cat) => (
                <label
                  key={cat.CategoryID}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.9rem",
                    marginTop: "2px",
                  }}
                >
                  <input
                    type="radio"
                    name="categoryId"
                    value={cat.CategoryID}
                    checked={
                      String(formData.categoryId) ===
                      String(cat.CategoryID)
                    }
                    onChange={handleCategoryChange}
                  />
                  {cat.CategoryName}
                </label>
              ))}
          </div>
        </div>

        <button className="button" type="submit">
          Guardar perfil
        </button>
      </form>
    </div>
  );
};

export default WorkerForm;

// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ❌ ya no usamos datos mock
// import profiles from "../data/profiles";
import ProfileCard from "../components/ProfileCard";
import api from "../api";
import "../styles/home.css";
import "../styles/profiles.css";

const categories = [
  { id: "carp", label: "Carpintería" },
  { id: "electric", label: "Electricidad" },
  { id: "plumbing", label: "Plomería" },
  { id: "painting", label: "Pintura" },
  { id: "cleaning", label: "Limpieza" },
  { id: "other", label: "Otros servicios" },
];

const Home = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);   // 👈 vienen del backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");

  // 1) Pedir lista pública de contratistas al backend
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setLoading(true);
        setError("");

        // 👈 coincide con /api/public/contractors
        const res = await api.get("/public/contractors");

        // el controller devuelve result.recordset, que Express manda como array
        setProfiles(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
          "No se pudieron cargar los perfiles. Intenta más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  // 2) Filtro por texto (nombre + negocio + categorías)
  const filtered = profiles.filter((p) => {
    const fullName = `${p.FirstName || ""} ${p.LastName || ""}`.trim();
    const business = p.BusinessName || "";
    const cats = p.Categories || ""; // viene como string "Carpintero, Plomero"
    const text = `${fullName} ${business} ${cats}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  // 3) Ordenar (por ahora solo ejemplo; no tienes rating/precio en el query)
  const filteredAndSorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") {
      const na = `${a.FirstName} ${a.LastName}`.toLowerCase();
      const nb = `${b.FirstName} ${b.LastName}`.toLowerCase();
      return na.localeCompare(nb);
    }
    // puedes agregar sortBy === "experience" usando YearsOfExperience, etc.
    return 0;
  });

  return (
    <div className="home">
      {/* header igual */}
      <header className="home-header">
        <div className="home-header-left">
          <img
            src="/serviconecta-logo-sin-letras.png"
            alt="ServiConecta"
            className="home-logo-small"
          />
          <span className="home-brand">
            Servi<span className="home-brand-highlight">Conecta</span>
          </span>
        </div>
        <div className="home-header-actions">
          <button className="btn btn-outline" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
          <button className="btn" onClick={() => navigate("/register")}>
            Registrarme
          </button>
        </div>
      </header>

      {/* hero igual */}
      <section className="home-hero">
        <div>
          <h1 className="home-hero-title">
            Conecta con profesionales para cualquier servicio en tu hogar.
          </h1>
          <p className="home-hero-sub">
            Encuentra carpinteros, electricistas, plomeros y más. Explora los
            perfiles sin iniciar sesión y crea tu cuenta cuando quieras
            contactarlos.
          </p>
          <div className="home-hero-actions">
            <button
              className="btn"
              onClick={() =>
                document
                  .getElementById("profiles-list")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Estoy buscando a un pro
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/register")}>
              Ofrecer mis servicios
            </button>
          </div>
        </div>

        <img
          src="/serviconecta-logo-dark.png"
          alt="ServiConecta"
          className="home-logo"
        />
      </section>

      {/* filtros */}
      <section className="home-filters">
        <input
          className="home-search"
          type="text"
          placeholder="Buscar por nombre, negocio o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="home-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">Ordenar por</option>
          <option value="name">Nombre (A-Z)</option>
          {/* <option value="experience">Más experiencia</option> si luego usas YearsOfExperience */}
        </select>
      </section>

      {/* categorías estáticas igual */}
      <section className="categories-section">
        <h2>Explora por categoría</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <span className="category-icon">▲</span>
              <p>{cat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* listado de perfiles */}
      <section className="profiles-section" id="profiles-list">
        <div className="profiles-header">
          <h2>Perfiles destacados</h2>
          <p>
            Puedes echarle un vistazo rápido a los perfiles sin necesidad de
            iniciar sesión. Para verlos más detalladamente, ¡inicia sesión!
          </p>
        </div>

        {loading && <p>Cargando perfiles...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="profiles-grid">
            {filteredAndSorted.map((p) => (
              <ProfileCard
                key={p.UserID}
                id={p.UserID}
                name={`${p.FirstName} ${p.LastName}`}
                businessName={p.BusinessName}
                bio={p.Bio}
                yearsOfExperience={p.YearsOfExperience}
                categories={p.Categories}
                // opcionales, por ahora no los usas
                // price={...}
                // rating={...}
                // reviews={...}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

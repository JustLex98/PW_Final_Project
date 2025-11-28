import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const HomeLogged = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");

 
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/public/contractors");
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

  const selectedCategoryLabel = (() => {
    if (selectedCategoryId === "all") return null;
    const catObj = categories.find((c) => c.id === selectedCategoryId);
    return catObj ? catObj.label.toLowerCase() : null;
  })();

  const filtered = profiles.filter((p) => {
    const fullName = `${p.FirstName || ""} ${p.LastName || ""}`.trim();
    const business = p.BusinessName || "";
    const bio = p.Bio || "";        
    const cats = p.Categories || "";

   
    const text = `${fullName} ${business} ${bio} ${cats}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (!selectedCategoryLabel) return true;

    const catsNormalized = cats.toLowerCase();
    return catsNormalized.includes(selectedCategoryLabel);
  });

  const filteredAndSorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") {
      const na = `${a.FirstName} ${a.LastName}`.toLowerCase();
      const nb = `${b.FirstName} ${b.LastName}`.toLowerCase();
      return na.localeCompare(nb);
    }
    return 0;
  });

  const handleCategoryClick = (id) => {
    setSelectedCategoryId((prev) => (prev === id ? "all" : id));
  };

  return (
    <div className="home">
      {/* HEADER */}
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
          <button
            className="btn btn-outline"
            onClick={() => navigate("/complete-profile")}
          >
            Editar mi perfil
          </button>

          <button
            className="btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userId");
              localStorage.removeItem("userRole");
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <div>
          <h1 className="home-hero-title">
            Encuentra y administra a tus profesionales de confianza.
          </h1>
          <p className="home-hero-sub">
            Revisa los perfiles, consulta reseñas y contáctalos directamente
            desde ServiConecta.
          </p>
        </div>

        <img
          src="/serviconecta-logo-dark.png"
          alt="ServiConecta"
          className="home-logo"
        />
      </section>

      {/* FILTROS */}
      <section className="home-filters">
        <input
          className="home-search"
          type="text"
          placeholder="Buscar por nombre, negocio, descripción o categoría..."
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
        </select>
      </section>

      {/* CATEGORÍAS */}
      <section className="categories-section">
        <h2>Explora por categoría</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={
                "category-card" +
                (selectedCategoryId === cat.id ? " category-card-active" : "")
              }
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span className="category-icon">▲</span>
              <p>{cat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LISTADO DE PERFILES */}
      <section className="profiles-section" id="profiles-list">
        <div className="profiles-header">
          <h2>Perfiles destacados</h2>
          <p>
            Puedes revisar los perfiles y administrar a tus profesionales de
            confianza desde tu cuenta.
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
                rating={p.AvgRating}       
                reviewsCount={p.ReviewsCount} 
              />
            ))}
          </div>
        )}

      </section>
    </div>
  );
};

export default HomeLogged;

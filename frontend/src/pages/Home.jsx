import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import api from "../api";
import "../styles/home.css";
import "../styles/profiles.css";

const CATEGORY_ORDER = [
  "Carpintería",
  "Electricidad",
  "Plomería",
  "Pintura",
  "Limpieza",
  "Otros servicios",
];

const Home = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  // 1) Cargar contratistas + categorías desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [contractorsRes, categoriesRes] = await Promise.all([
          api.get("/public/contractors"),
          api.get("/public/categories"),
        ]);

        setProfiles(contractorsRes.data || []);

        let cats = (categoriesRes.data || []).map((c) => ({
          id: String(c.CategoryID),
          label: c.CategoryName,
          description: c.Description,
        }));

        const desiredLower = CATEGORY_ORDER.map((s) => s.toLowerCase());
        cats.sort((a, b) => {
          const ia = desiredLower.indexOf(a.label.toLowerCase());
          const ib = desiredLower.indexOf(b.label.toLowerCase());

          if (ia === -1 && ib === -1) {
            // orden alfabético normal
            return a.label.localeCompare(b.label);
          }
          if (ia === -1) return 1; // a va después
          if (ib === -1) return -1; // b va después
          return ia - ib; // según CATEGORY_ORDER
        });

        setCategories(cats);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "No se pudieron cargar los datos. Intenta más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // etiqueta de la categoría seleccionada (texto) para buscar dentro de p.Categories
  const selectedCategoryLabel = (() => {
    if (selectedCategoryId === "all") return null;
    const catObj = categories.find((c) => c.id === selectedCategoryId);
    return catObj ? catObj.label.toLowerCase() : null;
  })();

// 2) Filtro por texto + categoría (incluye descripción/Bio)
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

  // 3) Ordenar perfiles
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
      {/* header */}
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
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
          <button className="btn" onClick={() => navigate("/register")}>
            Registrarme
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="home-hero">
        <div>
          <h1 className="home-hero-title">
            Encuentra y administra a tus profesionales de confianza.
          </h1>
          <p className="home-hero-sub">
            Revisa los perfiles, consulta reseñas y contáctalos directamente
            desde ServiConecta.
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
            <button
              className="btn btn-outline"
              onClick={() => navigate("/register")}
            >
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
          placeholder="Buscar por nombre, negocio, categoría o descripcion..."
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

      {/* categorías en el orden deseado */}
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

      {/* listado de perfiles */}
      <section className="profiles-section" id="profiles-list">
        <div className="profiles-header">
          <h2>Perfiles destacados</h2>
          <p>
            Puedes echarle un vistazo rápido a los perfiles sin necesidad de
            iniciar sesión. Para verlos más detalladamente, ¡inicia sesión!
          </p>
        </div>

        {loading && <p>Cargando datos...</p>}
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
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

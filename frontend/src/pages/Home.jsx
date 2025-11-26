import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profiles from "../data/profiles";
import ProfileCard from "../components/ProfileCard";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none"); 

  const filtered = profiles.filter((p) => {
    const text = `${p.name} ${p.job}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const filteredAndSorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") {
      const ra = a.rating || 0;
      const rb = b.rating || 0;
      return rb - ra; 
    }
    if (sortBy === "price") {
      return (a.price || 0) - (b.price || 0); 
    }
    return 0;
  });

  return (
    <div className="home">
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

      <section className="home-filters">
        <input
          className="home-search"
          type="text"
          placeholder="Buscar por nombre u oficio (ej. plomero, carpintero)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="home-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">Ordenar por</option>
          <option value="rating">Mejor rating</option>
          <option value="price">Menor costo</option>
        </select>
      </section>

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

      <section className="profiles-section" id="profiles-list">
        <div className="profiles-header">
          <h2>Perfiles destacados</h2>
          <p>
            Puedes hecharle un vistazo rápido a los perfiles sin necesidad de
            iniciar sesión. Para verlos más detalladamente, ¡inicia sesión!
          </p>
        </div>

        <div className="profiles-grid">
          {filteredAndSorted.map((p) => (
            <ProfileCard
              key={p.id}
              id={p.id}
              name={p.name}
              job={p.job}
              price={p.price}
              rating={p.rating}
              reviews={p.reviews}
              imageUrl={p.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

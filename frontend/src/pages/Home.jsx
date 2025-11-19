import React from "react";
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

  return (
    <div className="home">
 
      <header className="home-header">
        <div className="home-header-left">
          <img
            src="/serviconecta-logo-sin-letras.jpg"
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
          <p>Puedes ver los perfiles sin iniciar sesión.</p>
        </div>

        <div className="profiles-grid">
          {profiles.map((p) => (
            <ProfileCard
              key={p.id}
              id={p.id}
              name={p.name}
              job={p.job}
              price={p.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

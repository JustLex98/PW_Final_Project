import React from "react";
import { useNavigate } from "react-router-dom";
import profiles from "../data/profiles";
import ProfileCard from "../components/ProfileCard";
import "../styles/home.css";
import "../styles/profiles.css";

const HomeLogged = () => {
  const navigate = useNavigate();

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
          <button className="btn btn-outline" onClick={() => navigate("/complete-profile")}>
            Editar mi perfil
          </button>
          <button
            className="btn"
            onClick={() => {
              // más adelante aquí harás tu logout real
              localStorage.removeItem("isLoggedIn");
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* HERO PARA USUARIO LOGUEADO */}
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
                  .getElementById("profiles-list-logged")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Ver todos los perfiles
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/complete-profile")}
            >
              Completar/editar mi perfil
            </button>
          </div>
        </div>

        <img
          src="/serviconecta-logo-dark.png"
          alt="ServiConecta"
          className="home-logo"
        />
      </section>

      {/* LISTA DE PERFILES (puede ser igual que la home pública) */}
      <section className="profiles-section" id="profiles-list-logged">
        <div className="profiles-header">
          <h2>Profesionales disponibles</h2>
          <p>Puedes revisar sus perfiles y contactarlos cuando quieras.</p>
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

export default HomeLogged;

// src/pages/ProfileDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/profiles.css";

// mismas imágenes que en ProfileCard (ajusta las rutas si cambia algo)
import carpImg from "../assets/carpintero.jpg";
import electricImg from "../assets/electricista.png";
import plumbingImg from "../assets/plomero.jpg";
import paintingImg from "../assets/pintor.jpg";
import cleaningImg from "../assets/limpieza.jpg";
import otherImg from "../assets/otro.jpg";

function getServiceImage(categories) {
  const text = (categories || "").toLowerCase();

  if (text.includes("carpint")) return carpImg;
  if (text.includes("electric")) return electricImg;
  if (text.includes("plomer")) return plumbingImg;
  if (text.includes("pintur")) return paintingImg;
  if (text.includes("limpiez")) return cleaningImg;
  return otherImg;
}

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/public/contractors/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setError(
          err.response?.data?.message ||
            "No se pudo cargar el perfil del contratista."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="home profile-detail-page">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="home profile-detail-page">
        <div className="profile-detail-card">
          <h1 className="profile-detail-name">
            {error || `No existe el perfil #${id}`}
          </h1>
          <button
            className="profile-review-button"
            onClick={() => navigate("/inicio")}
            style={{ marginTop: "20px" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${profile.FirstName} ${profile.LastName}`.trim();
  const mainCategory =
    (profile.Categories || "").split(",")[0]?.trim() || "No especificado";

  // texto de precio
  let priceText = "No especificado";
  if (profile.PriceMin != null && profile.PriceMax != null) {
    priceText = `$${profile.PriceMin} - $${profile.PriceMax}`;
  } else if (profile.PriceMin != null) {
    priceText = `Desde $${profile.PriceMin}`;
  } else if (profile.PriceMax != null) {
    priceText = `Hasta $${profile.PriceMax}`;
  }

  const avatarSrc = getServiceImage(profile.Categories);

  const hasRating =
    profile.avgRating != null && profile.reviewsCount > 0;

  const avgStars = hasRating
    ? Math.max(1, Math.min(5, Math.round(profile.avgRating)))
    : 0;

  return (
    <div className="home profile-detail-page">
      <div className="profile-detail-layout">
        {/* TARJETA IZQUIERDA: DATOS DEL PRO */}
        <div className="profile-detail-card">
          <img
            src={avatarSrc}
            alt={mainCategory}
            className="profile-detail-image"
          />

          <h1 className="profile-detail-name">{fullName}</h1>

          <p className="profile-detail-info">
            Oficio:{" "}
            <span className="profile-detail-value">{mainCategory}</span>
          </p>

          <p className="profile-detail-info">
            Precio:{" "}
            <span className="profile-detail-value">{priceText}</span>
          </p>

          {profile.PhoneNumber && (
            <p className="profile-detail-info">
              Teléfono:{" "}
              <span className="profile-detail-value">
                {profile.PhoneNumber}
              </span>
            </p>
          )}

          {profile.BusinessName && (
            <p className="profile-detail-info">
              Negocio:{" "}
              <span className="profile-detail-value">
                {profile.BusinessName}
              </span>
            </p>
          )}

          {profile.Bio && (
            <p className="profile-detail-info">
              Descripción:{" "}
              <span className="profile-detail-value">
                {profile.Bio}
              </span>
            </p>
          )}

          {profile.YearsOfExperience != null && (
            <p className="profile-detail-info">
              Experiencia:{" "}
              <span className="profile-detail-value">
                {profile.YearsOfExperience} años
              </span>
            </p>
          )}


          <button
            className="profile-review-button"
            onClick={() => navigate("/inicio")}
            style={{ marginTop: "24px" }}
          >
            Volver al inicio
          </button>
        </div>

        {/* TARJETA DERECHA: RESEÑAS */}
        <div className="profile-review-card">
          <h2 className="profile-review-title">Opiniones de clientes</h2>

          <div className="profile-review-summary">
            <span className="profile-review-stars">
              {hasRating
                ? "★".repeat(avgStars)
                : "★★★★★"}
            </span>
            <span className="profile-review-rating">
              {hasRating
                ? `${profile.avgRating.toFixed(
                    1
                  )} de ${profile.reviewsCount} reseñas`
                : "Sé la primera persona en dejar una reseña."}
            </span>
          </div>

          <div className="profile-review-list">
            {profile.reviews && profile.reviews.length > 0 ? (
              profile.reviews.map((r, idx) => (
                <article key={idx} className="profile-review-item">
                  <p className="profile-review-text">
                    {"★".repeat(r.Rating || 0)}{" "}
                    {r.Comment}
                  </p>
                  <p className="profile-review-author">
                    {r.ClientFirstName}
                  </p>
                </article>
              ))
            ) : (
              <p className="profile-review-text">
                Aún no hay reseñas para este profesional.
              </p>
            )}
          </div>

          <button
            className="profile-review-button"
            onClick={() =>
              navigate(`/profile/${profile.UserID}/review`, {
                state: {
                  contractorId: profile.UserID,
                  contractorName: fullName,
                },
              })
            }
          >
            Escribir una reseña
          </button>
        </div>
      </div>
    </div>
  );
}

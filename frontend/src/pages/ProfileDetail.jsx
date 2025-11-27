
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import profiles from "../data/profiles"; 
import "../styles/profiles.css";

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const profile = profiles.find((p) => String(p.id) === String(id));

  // Si no existe el perfil
  if (!profile) {
    return (
      <div className="home profile-detail-page">
        <div className="profile-detail-card">
          <h1 className="profile-detail-name">No existe el perfil #{id}</h1>
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

  const hasRating = profile.rating && profile.reviews;

  return (
    <div className="home profile-detail-page">
      <div className="profile-detail-layout">
        <div className="profile-detail-card"> 
          <img
            src={
              profile.imageUrl ||
              "https://via.placeholder.com/150/333333/ff8c00?text=👤"
            }
            alt={profile.name}
            className="profile-detail-image"
          />

          <h1 className="profile-detail-name">{profile.name}</h1>

          <p className="profile-detail-info">
            Oficio:{" "}
            <span className="profile-detail-value">{profile.job}</span>
          </p>

          <p className="profile-detail-info">
            Precio:{" "}
            <span className="profile-detail-value">
              ${profile.price}/hora
            </span>
          </p>

          {profile.phoneNumber && (
            <p className="profile-detail-info">
              Teléfono:{" "}
              <span className="profile-detail-value">
                {profile.phoneNumber}
              </span>
            </p>
          )}

          <p className="profile-detail-info">
            Descripción:{" "}
            <span className="profile-detail-value">{profile.bio}</span>
          </p>

          {hasRating && (
            <div className="profile-detail-rating">
              <span>{"⭐".repeat(Math.round(profile.rating))}</span>
              <span>
                {profile.rating.toFixed(1)} ({profile.reviews} reseñas)
              </span>
            </div>
          )}

          <button
            className="profile-review-button"
            onClick={() => navigate("/inicio")}
            style={{ marginTop: "24px" }}
          >
            Volver al inicio
          </button>
        </div>

        {/* ===== TARJETA DERECHA: RESEÑAS / OPINIONES ===== */}
        <div className="profile-review-card">
          <h2 className="profile-review-title">Opiniones de clientes</h2>

          <div className="profile-review-summary">
            <span className="profile-review-stars">
              {hasRating
                ? "⭐".repeat(Math.round(profile.rating))
                : "★★★★★"}
            </span>
            <span className="profile-review-rating">
              {hasRating
                ? `${profile.rating.toFixed(1)} de ${
                    profile.reviews
                  } reseñas`
                : "Sé la primera persona en dejar una reseña."}
            </span>
          </div>

          <div className="profile-review-list">
            <article className="profile-review-item">
              <p className="profile-review-text">
                “Muy puntual y profesional. El trabajo quedó excelente.”
              </p>
              <p className="profile-review-author">Ana G.</p>
            </article>

            <article className="profile-review-item">
              <p className="profile-review-text">
                “Lo contraté para una reparación urgente y respondió rápido.
                Lo recomiendo.”
              </p>
              <p className="profile-review-author">Luis R.</p>
            </article>

            <article className="profile-review-item">
              <p className="profile-review-text">
                “Buen trato, precios justos y explica lo que está haciendo.”
              </p>
              <p className="profile-review-author">María P.</p>
            </article>
          </div>

          <button
            className="profile-review-button"
            onClick={() =>
              navigate(`/profile/${profile.id}/review`, {
                state: {
                  contractorId: profile.id,
                  contractorName: profile.name,
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

// src/components/ProfileCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profiles.css";

// 👇 IMPORTA LAS IMÁGENES POR SERVICIO (ajusta los nombres según tus archivos)
import carpImg from "../assets/carpintero.jpg";
import electricImg from "../assets/electricista.png";
import plumbingImg from "../assets/plomero.jpg";
import paintingImg from "../assets/pintor.jpg";
import cleaningImg from "../assets/limpieza.jpg";
import otherImg from "../assets/otro.jpg";

// Decide qué imagen usar según las categorías del contratista
function getServiceImage(categories) {
  const text = (categories || "").toLowerCase();

  if (text.includes("carpint")) return carpImg;
  if (text.includes("electric")) return electricImg;
  if (text.includes("plomer")) return plumbingImg;
  if (text.includes("pintur")) return paintingImg;
  if (text.includes("limpiez")) return cleaningImg;

  // por defecto
  return otherImg;
}

export default function ProfileCard({
  id,
  name,
  businessName,
  bio,
  yearsOfExperience,
  categories,
  rating,        // AvgRating del backend
  reviewsCount,  // ReviewsCount del backend
}) {
  const navigate = useNavigate();

  const avatarSrc = getServiceImage(categories);
  const hasRating = rating != null && reviewsCount > 0;

  // limitar estrellas de 1 a 5 para no romper nada
  const stars = hasRating ? Math.max(1, Math.min(5, Math.round(rating))) : 0;

  return (
    <article className="profile-card" onClick={() => navigate(`/profile/${id}`)}>
      {/* HEADER: avatar + nombre + categorías */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={avatarSrc}
            alt={categories || "Servicio"}
            className="profile-avatar-img"
          />
        </div>

        <div>
          <h3 className="profile-name">{name}</h3>
          {categories && (
            <p className="profile-job">{categories}</p>
          )}
          {businessName && (
            <p className="profile-skills">{businessName}</p>
          )}
        </div>
      </div>

      {/* BIO / DESCRIPCIÓN */}
      {bio && (
        <p className="profile-bio" style={{ fontSize: "0.9rem", color: "var(--light-text-color)", marginBottom: "8px" }}>
          {bio}
        </p>
      )}

      {/* EXPERIENCIA */}
      {yearsOfExperience != null && (
        <p className="profile-price">
          {yearsOfExperience} años de experiencia
        </p>
      )}

      {/* RATING */}
      <div className="profile-rating">
        <span>
          {hasRating ? "⭐".repeat(stars) : "★★★★★"}
        </span>
        <span>
          {hasRating
            ? `${rating.toFixed(1)} (${reviewsCount} reseñas)`
            : "Sin reseñas aún"}
        </span>
      </div>

      {/* FOOTER (puedes añadir un botón si quieres) */}
      <div className="profile-footer">
        <button
          className="profile-review-button"
          onClick={(e) => {
            e.stopPropagation(); // para que no se dispare el onClick del card
            navigate(`/profile/${id}`);
          }}
        >
          Ver perfil
        </button>
      </div>
    </article>
  );
}

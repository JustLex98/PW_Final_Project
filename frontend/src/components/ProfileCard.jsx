// src/components/ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/profiles.css";

const ProfileCard = ({
  id,
  name,
  businessName,
  bio,
  yearsOfExperience,
  categories,
  // opcionales por si luego agregas esto
  price,
  rating,
  reviews,
  imageUrl,
}) => {
  return (
    <Link to={`/profile/${id}`} className="profile-card-link">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={imageUrl || "https://via.placeholder.com/60/333333/ff8c00?text=👤"}
            alt={name}
            className="profile-image"
          />
          <div>
            <h2 className="profile-name">{name}</h2>
            {/* nombre del negocio / oficio */}
            {businessName && (
              <p className="profile-job">{businessName}</p>
            )}
            {/* mini bio */}
            {bio && (
              <p className="profile-bio">
                {bio.length > 80 ? bio.slice(0, 80) + "..." : bio}
              </p>
            )}
          </div>
        </div>

        {/* meta info */}
        {typeof yearsOfExperience === "number" && (
          <p className="profile-meta">
            {yearsOfExperience} año{yearsOfExperience === 1 ? "" : "s"} de experiencia
          </p>
        )}

        {categories && (
          <p className="profile-meta">
            Categorías: {categories}
          </p>
        )}

        {/* solo mostramos precio si realmente viene algo */}
        {price != null && (
          <p className="profile-price">${price}/hr</p>
        )}

        {/* rating opcional */}
        {rating != null && reviews != null && (
          <div className="profile-rating">
            <span>{"⭐".repeat(Math.round(rating))}</span>
            <span>
              {rating.toFixed(1)} ({reviews})
            </span>
          </div>
        )}

        <div className="profile-footer">
          <div className="profile-match-tag">Ver perfil</div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;

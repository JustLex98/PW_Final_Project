// src/components/ProfileCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para poder navegar al detalle
import '../styles/profiles.css'; // Usaremos el CSS de profiles.css para las tarjetas

const ProfileCard = ({ id, name, job, price, rating, reviews, imageUrl }) => {
  return (
    <Link to={`/profile/${id}`} className="profile-card-link"> {/* Enlace al detalle del perfil */}
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={imageUrl || 'https://via.placeholder.com/60/333333/ff8c00?text=👤'} 
            alt={name} 
            className="profile-image" 
          />
          <div>
            <h2 className="profile-name">{name}</h2>
            <p className="profile-job">{job}</p>
          </div>
        </div>
        
        <p className="profile-price">
          ${price}/hr
        </p>

        {rating && reviews && (
          <div className="profile-rating">
            <span>{"⭐".repeat(Math.round(rating))}</span>
            <span>{rating.toFixed(1)} ({reviews})</span>
          </div>
        )}

        <div className="profile-footer">
          <div className="profile-match-tag">
            Great match
          </div>
          <p className="profile-skills">
            ✓ 3/3 skills
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
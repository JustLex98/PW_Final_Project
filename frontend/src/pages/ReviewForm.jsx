import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../styles/profiles.css"; 

export default function ReviewForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();

  const contractorId = location.state?.contractorId || id;
  const contractorName = location.state?.contractorName || "el contratista";

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rating) {
      setError("Por favor selecciona una cantidad de estrellas.");
      return;
    }

    try {
      await api.post(`/reviews/contractor/${contractorId}`, {
        rating,
        comment,
      });

      setSuccess("¡Gracias por tu reseña!");
      setTimeout(() => {
        navigate(`/profile/${contractorId}`);
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Ocurrió un error al guardar la reseña."
      );
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="home profile-detail-page">
      <div className="profile-detail-card">
        <h1 className="profile-detail-name">
          Escribir reseña para {contractorName}
        </h1>

        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label className="profile-detail-info">
              Calificación:
              <div className="star-rating-wrapper">
                {stars.map((star) => {
                  const isFilled = star <= (hoverRating || rating);
                  return (
                    <span
                      key={star}
                      className={`star-icon ${isFilled ? "star-filled" : ""}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </label>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <textarea
              className="profiles-textarea"
              placeholder="Cuenta cómo fue tu experiencia..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          {error && <p className="login-error">{error}</p>}
          {success && (
            <p style={{ color: "lightgreen", marginBottom: "8px" }}>
              {success}
            </p>
          )}

          <button type="submit" className="profile-review-button">
            Enviar reseña
          </button>
        </form>
      </div>
    </div>
  );
}

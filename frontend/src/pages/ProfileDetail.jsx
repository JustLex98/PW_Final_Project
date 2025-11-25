import { useParams } from "react-router-dom";
import profiles from "../data/profiles.js";
import "../styles/profiles.css";

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = profiles.find((p) => String(p.id) === String(id));

  if (!profile)
    return (
      <div
        className="home"
        style={{ display: "grid", placeItems: "center", height: "100vh" }}
      >
        <div className="profile-detail-card">
          <h1 className="profile-detail-name">No existe el perfil #{id}</h1>
        </div>
      </div>
    );

  return (
    <div className="home profile-detail-page">
      <div className="profile-detail-layout">
        {/* TARJETA IZQUIERDA: PERFIL */}
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
          <p className="profile-detail-info">
            Descripción:{" "}
            <span className="profile-detail-value">{profile.bio}</span>
          </p>
        </div>

        {/* TARJETA DERECHA: RESEÑAS (por ahora estático / fake) */}
        <div className="profile-review-card">
          <h2 className="profile-review-title">Opiniones de clientes</h2>

          <div className="profile-review-summary">
            <span className="profile-review-stars">★★★★★</span>
            <span className="profile-review-rating">
              4.9 de 39 reseñas
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

          <button className="profile-review-button">
            Escribir una reseña
          </button>
        </div>
      </div>
    </div>
  );
}

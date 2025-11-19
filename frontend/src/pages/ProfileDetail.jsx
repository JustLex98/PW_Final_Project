
import { useParams } from "react-router-dom";
import profiles from "../data/Profiles.js"; 
import '../styles/profiles.css';

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = profiles.find(p => String(p.id) === String(id));

  if (!profile) return (
    <div className="home" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div className="profile-detail-card">
        <h1 className="profile-detail-name">No existe el perfil #{id}</h1>
      </div>
    </div>
  );

  return (
    <div className="home profile-detail-page"> {}
      <div className="profile-detail-card">
        <img 
          src={profile.imageUrl || 'https://via.placeholder.com/150/333333/ff8c00?text=👤'} 
          alt={profile.name} 
          className="profile-detail-image" 
        />
        <h1 className="profile-detail-name">{profile.name}</h1>
        <p className="profile-detail-info">Oficio: <span className="profile-detail-value">{profile.job}</span></p>
        <p className="profile-detail-info">Precio: <span className="profile-detail-value">${profile.price}/hora</span></p>
        <p className="profile-detail-info">Descripción: <span className="profile-detail-value">{profile.bio}</span></p>
        
        {profile.rating && profile.reviews && (
          <div className="profile-detail-rating">
            <span>{"⭐".repeat(Math.round(profile.rating))}</span>
            <span>{profile.rating.toFixed(1)} ({profile.reviews} reviews)</span>
          </div>
        )}
      </div>
    </div>
  );
}
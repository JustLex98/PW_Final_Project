
import profiles from "../data/Profiles.js"; 
import ProfileCard from "../components/ProfileCard.jsx";
import '../styles/profiles.css'; 

export default function Profiles() {
  return (
    <div className="profiles-page-container home"> 
      <h1 className="profiles-page-title">Los pros perfectos para ti!</h1>
      <div className="profiles-grid">
        {profiles.map(p => (
          <ProfileCard 
            key={p.id} 
            id={p.id} 
            name={p.name} 
            job={p.job} 
            price={p.price} 
            rating={p.rating}
            reviews={p.reviews}
            imageUrl={p.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

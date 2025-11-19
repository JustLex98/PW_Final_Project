import { useState } from "react";
import profiles from "../data/Profiles.js"; 
import ProfileCard from "../components/ProfileCard.jsx";
import "../styles/profiles.css";

export default function Profiles() {
  const [searchJob, setSearchJob] = useState("");

  const filteredProfiles = profiles.filter((p) =>
    p.job.toLowerCase().includes(searchJob.toLowerCase())
  );

  return (
    <div className="profiles-page-container home">
      <h1 className="profiles-page-title">Los pros perfectos para ti!</h1>

      {/* 🔎 Buscador por job */}
      <div className="profiles-search-container">
        <input
          type="text"
          placeholder="Buscar por oficio (ej. Carpintero, Plomero...)"
          className="profiles-search-input"
          value={searchJob}
          onChange={(e) => setSearchJob(e.target.value)}
        />
      </div>

      <div className="profiles-grid">
        {filteredProfiles.map((p) => (
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

import React, { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard.jsx";
import api from "../api";
import "../styles/profiles.css";

export default function Profiles() {
  const [searchJob, setSearchJob] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/public/contractors");
        setProfiles(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "No se pudieron cargar los perfiles. Intenta más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  const filteredProfiles = profiles.filter((p) => {
    const fullName = `${p.FirstName || ""} ${p.LastName || ""}`.toLowerCase();
    const categories = (p.Categories || "").toLowerCase();
    const business = (p.BusinessName || "").toLowerCase();
    const term = searchJob.toLowerCase();

    if (!term) return true;

    return (
      fullName.includes(term) ||
      categories.includes(term) ||
      business.includes(term)
    );
  });

  return (
    <div className="profiles-page-container home">
      <h1 className="profiles-page-title">¡Los pros perfectos para ti!</h1>

      <div className="profiles-search-container">
        <input
          type="text"
          placeholder="Buscar por oficio o categoría (ej. Carpintería, Plomería...)"
          className="profiles-search-input"
          value={searchJob}
          onChange={(e) => setSearchJob(e.target.value)}
        />
      </div>

      {loading && <p>Cargando perfiles...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="profiles-grid">
          {filteredProfiles.map((p) => (
            <ProfileCard
              key={p.UserID}
              id={p.UserID}
              name={`${p.FirstName} ${p.LastName}`}
              businessName={p.BusinessName}
              bio={p.Bio}
              yearsOfExperience={p.YearsOfExperience}
              categories={p.Categories}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  getContractorProfile,
  updateContractorProfile,
  getAllCategories,
} from "../api";
import "../styles/Register.css";

function WorkerForm() {
  const [formData, setFormData] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, categoriesRes] = await Promise.all([
          getContractorProfile(),
          getAllCategories(),
        ]);
        const profileFromAPI = profileRes.data;
        const formattedProfile = {
          businessName: profileFromAPI.BusinessName || "",
          phoneNumber: profileFromAPI.PhoneNumber || "",
          bio: profileFromAPI.Bio || "",
          yearsOfExperience: profileFromAPI.YearsOfExperience || 0,
          categories: profileFromAPI.categories.map((cat) => ({
            categoryId: cat.CategoryID,
            categoryName: cat.CategoryName,
            priceMin: cat.PriceMin,
            priceMax: cat.PriceMax,
          })),
        };
        setFormData(formattedProfile);
        setAllCategories(categoriesRes.data);
      } catch (error) {
        setMessage("Error al cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (e, category) => {
  };
  const handlePriceChange = (categoryId, field, value) => {

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Guardando...");
    try {
      const payload = {
        businessName: formData.businessName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        yearsOfExperience: formData.yearsOfExperience,
        categories: formData.categories.map((cat) => ({
          categoryId: cat.categoryId,
          priceMin: cat.priceMin,
          priceMax: cat.priceMax,
        })),
      };
      const response = await updateContractorProfile(payload);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error al guardar el perfil.");
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Cargando perfil...</p>
      </div>
    );
  if (!formData)
    return (
      <div className="container">
        <p>No se pudo cargar el perfil.</p>
      </div>
    );

  return (
    <div className="container">
      <h1 className="title">Completa tu perfil</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Nombre del negocio"
        />
        <input
          className="input"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Teléfono"
        />
        <textarea
          className="input"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Biografía"
        />
        <input
          className="input"
          type="number"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          placeholder="Años de experiencia"
        />

        <div>
          <span>Selecciona tus categorías de servicio:</span>
          {allCategories.map((cat) => {
            const isChecked = formData.categories.some(
              (c) => c.categoryId === cat.CategoryID
            );
            const currentCategoryData = formData.categories.find(
              (c) => c.categoryId === cat.CategoryID
            );
            return (
              <div key={cat.CategoryID}>
                <label>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCategoryToggle(e, cat)}
                  />
                  {cat.CategoryName}
                </label>
                {isChecked && (
                  <div style={{ marginLeft: "20px" }}>
                    <input
                      type="number"
                      placeholder="Precio Mín."
                      value={currentCategoryData.priceMin || ""}
                      onChange={(e) =>
                        handlePriceChange(
                          cat.CategoryID,
                          "priceMin",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="Precio Máx."
                      value={currentCategoryData.priceMax || ""}
                      onChange={(e) =>
                        handlePriceChange(
                          cat.CategoryID,
                          "priceMax",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button className="button" type="submit">
          Guardar perfil
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default WorkerForm;

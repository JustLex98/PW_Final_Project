import { Link } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/logo.jpg"; 

export default function Home() {
  return (
    <main className="home">
      <section className="home-card">
        <img src={logo} alt="ServiConecta" className="home-logo" />

        <p className="home-sub">
          Conecta <strong>profesionales</strong> con <strong>contratistas</strong> de forma rápida.
          Crea tu perfil, define tu tarifa por hora y deja que te encuentren.
          Si buscas un <em>pro</em>, filtra por oficio, precio y ubicación.
        </p>

        <div className="home-actions">
          <Link to="/login" className="btn btn-outline">Iniciar sesión</Link>
          <Link to="/register" className="btn">Crear cuenta</Link>
        </div>
      </section>
    </main>
  );
}

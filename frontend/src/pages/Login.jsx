import "../styles/Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="auth-logo">
        <img src="/serviconecta-logo-dark.png" alt="ServiConecta" />
        <span className="auth-logo-text">
          Servi<span className="auth-logo-highlight">Conecta</span>
        </span>
      </div>

      <h1 className="login-title">Iniciar sesión</h1>
      <p className="login-subtitle">
        Ingresa con tu cuenta para contactar trabajadores
        o gestionar tus servicios.
      </p>

      <form className="login-form">
        <input
          className="login-input"
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          required
        />
        <button className="login-button" type="submit">
          Entrar
        </button>
      </form>

      <p className="login-footer-text">
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}

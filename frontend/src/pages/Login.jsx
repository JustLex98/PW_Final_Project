import "../styles/login.css"

export default function Login() {
  return (
    <div className="login-wrapper">
      <h1>Iniciar sesión</h1>
      <p className="subtitle"> Bienvenido de vuelta!</p>
      <form>
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <button type="button">Entrar</button>
      </form>
    </div>
  );
}

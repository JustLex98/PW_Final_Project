import '../styles/register.css'; 

export default function Register() {
  return (
    <div className="container">
      <h1 className="title">Crear cuenta</h1>
      <p className="subtitle"> Estoy buscando a un pro! / Estoy buscando Trabajo!</p>
      <form className="form">
        <input 
          placeholder="Nombre" 
          className="input" 
        />
        <input 
          placeholder="Email" 
          className="input" 
        />
        <input 
          placeholder="Password" 
          type="password" 
          className="input" 
        />
        <button 
          type="button" 
          className="button"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}

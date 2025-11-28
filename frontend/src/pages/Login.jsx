import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import '../styles/login.css';

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            await login(formData);
            
            navigate('/inicio'); 

        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
            } else {
                setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
            }
            console.error("Error en el inicio de sesión:", err);
        }
    };

    return (
        <div className="container">
            <div className="auth-logo">
                <img src="/serviconecta-logo-sin-letras.png" alt="ServiConecta" />
                <span className="auth-logo-text">
                    Servi<span className="auth-logo-highlight">Conecta</span>
                </span>
            </div>

            <h1 className="title">Iniciar Sesión</h1>
            <p className="subtitle">Bienvenido de nuevo. Ingresa a tu cuenta.</p>

            <form className="form" onSubmit={handleSubmit}>
                <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="input"
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                
                {error && <p className="error-message">{error}</p>}

                <button className="button" type="submit">
                    Iniciar Sesión
                </button>
            </form>

            <p className="redirect-link">
                ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
}

export default LoginPage;
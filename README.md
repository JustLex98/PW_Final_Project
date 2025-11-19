# Programacion_Web

🌐 ServiConecta: Plataforma Web de Contratación de Servicios

🚀 Overview del Proyecto

ServiConecta es una plataforma web (marketplace local) diseñada para conectar clientes que buscan servicios (plomería, electricidad, etc.) con contratistas profesionales que los ofrecen. Nuestro objetivo principal es resolver la dificultad de encontrar profesionales confiables, proporcionando una interfaz intuitiva (UI/UX) y un entorno seguro para la interacción y la transparencia.

Este documento corresponde al Avance I, que define la investigación, el diseño preliminar y la arquitectura del Producto Mínimo Viable (MVP).

🎯 Objetivos del Proyecto

General
Desarrollar una plataforma web que permita a clientes registrarse para contratar servicios y a contratistas postularse para ofrecerlos, asegurando un entorno confiable y seguro de interacción.

Específicos Clave (Avance I)
Implementar sistemas robustos de registro y autenticación (para clientes y contratistas).
Desarrollar perfiles dinámicos básicos para contratistas.
Asegurar la confidencialidad y protección de los datos de los usuarios.

📦 Producto Mínimo Viable (MVP)

El MVP se enfoca en la funcionalidad esencial para permitir la interacción básica entre las partes, priorizando únicamente la funcionalidad básica.
Funcionalidades Incluidas

Registro Dual: Implementación del sistema de registro y login que distingue entre Clientes y Contratistas.
Perfiles Básicos: Publicación inicial de servicios por parte de los contratistas.

Solicitudes de Servicio: Posibilidad para que los clientes realicen solicitudes de servicio.

Negociación: Inclusión del proceso de obtención y negociación de requisitos.

Excluidos (Fases Posteriores)
Sistema de valoraciones y comentarios de clientes.
Sistema de búsqueda avanzada con filtros.

💻 Arquitectura y Tecnología

El proyecto sigue un patrón de Arquitectura Cliente-Servidor (MVC) para garantizar una separación clara de la lógica, la presentación y los datos.

🛠️ Stack Tecnológico

Frontend (Capa de Presentación)
Tecnología Principal: React.js
Estilización/UI: TailwindCSS
Propósito: Construir interfaces dinámicas, responsivas y asegurar una excelente Experiencia de Usuario (UX).

Backend (Lógica de Negocio/Servidor)
Framework: Node.js con Express.js
Propósito: Gestión eficiente de las peticiones, implementación de la lógica de negocio y exposición de la API REST.

Gestión de Datos
Base de Datos: SQL Server (Relacional)
Propósito: Almacenar y administrar de forma estructurada toda la información de usuarios, servicios y transacciones.

Herramientas Adicionales
Control de Versiones: GitHub

🛡️ Seguridad de la Información

Se priorizará la seguridad en el manejo de datos, incluyendo:

Autenticación basada en JWT (JSON Web Tokens).

Validaciones de entrada para prevenir ataques de Inyección SQL.

Respaldo regular de la base de datos.

📅 Plan de Trabajo (Backlog Inicial)
El equipo está compuesto por un desarrollador Frontend, tres desarrolladores Backend y un especialista en QA.
Las actividades clave definidas para la primera iteració (To Do) incluyen:

Implementación de la autenticación básica.
Diseño inicial de la base de datos.
Prototipo de la interfaz de registro/login.
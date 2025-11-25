// src/data/profiles.js
import carlosImg from "../assets/carlos.jpg";
import mariaImg from "../assets/maria.jpg";
import jorgeImg from "../assets/jorge.jpg";

const profiles = [
  { 
    id: 1, 
    name: "Carlos Pérez", 
    job: "Carpintero",  
    price: 12, 
    bio: "10 años de experiencia.",
    phoneNumber: "7777-1111", 
    imageUrl: carlosImg 
  },
  { 
    id: 2, 
    name: "María López",  
    job: "Electricista", 
    price: 10, 
    bio: "Instalaciones residenciales.", 
    phoneNumber: "7777-2222",
    imageUrl: mariaImg 
  },
  { 
    id: 3, 
    name: "Jorge Hernández", 
    job: "Plomero",   
    price: 15, 
    bio: "Urgencias 24/7.",
    phoneNumber: "7777-3333",
    imageUrl: jorgeImg 
  },
];

export default profiles;

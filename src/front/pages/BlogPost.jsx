import React from "react";
import { useParams, Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Cómo empezar a ahorrar",
    summary: "Guía básica para comenzar tu camino al ahorro inteligente.",
    image: "https://source.unsplash.com/featured/?saving,money",
    content: "Contenido completo sobre cómo ahorrar...\n\nPaso 1: Establece metas claras...\nPaso 2: Crea un presupuesto..."
  },
  {
    id: 2,
    title: "Inversiones para principiantes",
    summary: "Introducción al mundo de las inversiones financieras.",
    image: "https://source.unsplash.com/featured/?investment,finance",
    content: "Contenido completo sobre inversiones...\n\n1. Fondos indexados\n2. Acciones\n3. Bonos..."
  },
  {
    id: 3,
    title: "Errores comunes al manejar tu dinero",
    summary: "Evita estos errores típicos al administrar tus finanzas personales.",
    image: "https://source.unsplash.com/featured/?money,mistakes",
    content: "Contenido sobre errores comunes como gastar más de lo que ganas..."
  },
  {
    id: 4,
    title: "¿Qué es el interés compuesto?",
    summary: "Aprende cómo el interés compuesto puede ayudarte a multiplicar tu dinero.",
    image: "https://source.unsplash.com/featured/?compound,interest",
    content: "El interés compuesto es una herramienta poderosa..."
  }
];

export const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

   if (!post) return <div style={{ padding: "2rem", color: "white", backgroundColor: "#121212" }}>Artículo no encontrado.</div>;

  return (
    <div style={{ padding: "3rem", backgroundColor: "#0a0a0a", minHeight: "100vh", color: "white", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ color: "#b7ff00", fontSize: "3rem", marginBottom: "1.5rem" }}>{post.title}</h1>
      <p style={{ whiteSpace: "pre-line", fontSize: "1.2rem", lineHeight: "1.6rem", color: "#ddd" }}>
        {post.content}
      </p>
      <Link 
        to="/blog" 
        style={{ 
          marginTop: "2rem", 
          display: "inline-block", 
          color: "#b7ff00", 
          fontWeight: "bold",
          textDecoration: "none",
          border: "1.5px solid #b7ff00",
          borderRadius: "30px",
          padding: "0.5rem 1.5rem",
          transition: "background-color 0.3s, color 0.3s"
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = "#b7ff00";
          e.target.style.color = "#000";
        }}
        onMouseLeave={e => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#b7ff00";
        }}
      >
        ← Volver al blog
      </Link>
    </div>
  );
};
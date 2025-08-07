import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Cómo empezar a ahorrar",
    summary: "Guía básica para comenzar tu camino al ahorro inteligente.",
    content: "Contenido completo sobre cómo ahorrar...\n\nPaso 1: Establece metas claras...\nPaso 2: Crea un presupuesto...",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437e1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Inversiones para principiantes",
    summary: "Introducción al mundo de las inversiones financieras.",
    content: "Contenido completo sobre inversiones...\n\n1. Fondos indexados\n2. Acciones\n3. Bonos...",
    image: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?auto=format&fit=crop&w=800&q=80"
  }
];

export const Blog = () => {
  return (
    <div style={{ padding: "3rem", backgroundColor: "#0a0a0a", minHeight: "100vh", color: "white", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#b7ff00" }}>Blog Financiero</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "3rem", color: "#ccc" }}>
        Consejos sobre ahorro, inversión y gestión inteligente de tu dinero.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {blogPosts.map(post => (
          <div
            key={post.id}
            style={{
              backgroundColor: "Grey",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(183, 255, 0, 0.4)",
              padding: "1.8rem",
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "200px"
            }}
          >
            {/* Imagen del post */}
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "1rem"
              }}
            />
            <div>
              <h2 style={{ color: "#b7ff00", fontSize: "1.8rem", marginBottom: "1rem" }}>{post.title}</h2>
              <p style={{ color: "#ddd", fontSize: "1rem", lineHeight: "1.4rem" }}>{post.summary}</p>
            </div>
            <Link
              to={`/blog/${post.id}`}
              style={{
                marginTop: "auto",
                marginTop: "1.5rem",
                color: "#b7ff00",
                fontWeight: "bold",
                textDecoration: "none",
                alignSelf: "flex-start",
                border: "1.5px solid #b7ff00",
                borderRadius: "30px",
                padding: "0.4rem 1.2rem",
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
              Leer más →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

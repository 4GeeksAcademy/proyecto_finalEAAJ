import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Cómo empezar a ahorrar",
    summary: "Guía básica para comenzar tu camino al ahorro inteligente.",
    content: "Contenido completo sobre cómo ahorrar...\n\nPaso 1: Establece metas claras...\nPaso 2: Crea un presupuesto..."
  },
  {
    id: 2,
    title: "Inversiones para principiantes",
    summary: "Introducción al mundo de las inversiones financieras.",
    content: "Contenido completo sobre inversiones...\n\n1. Fondos indexados\n2. Acciones\n3. Bonos..."
  }
];

export const Blog = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Blog Financiero</h1>
      <p style={{ color: "#555" }}>
        Consejos sobre ahorro, inversión y gestión inteligente de tu dinero.
      </p>
      {blogPosts.map(post => (
        <div key={post.id} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
          <h2>{post.title}</h2>
          <p>{post.summary}</p>
          <Link to={`/blog/${post.id}`} style={{ color: "#0D6EFD", textDecoration: "underline" }}>
            Leer más →
          </Link>
        </div>
      ))}
    </div>
  );
};

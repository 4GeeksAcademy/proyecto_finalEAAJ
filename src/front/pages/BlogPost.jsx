import React from "react";
import { useParams, Link } from "react-router-dom";

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

export const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) return <div>Artículo no encontrado.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p style={{ whiteSpace: "pre-line" }}>{post.content}</p>
      <Link to="/blog" style={{ marginTop: "1rem", display: "inline-block", color: "#0D6EFD" }}>
        ← Volver al blog
      </Link>
    </div>
  );
};

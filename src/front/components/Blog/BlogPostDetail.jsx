import React, { useState } from 'react';

function BlogPostDetail({ post, index, handleLike, handleAddComment, onBack }) {

  const [comment, setComment] = useState({ author: '', body: '' });

  const submitComment = (e) => {
    e.preventDefault();
    if (comment.body && comment.author) {
      handleAddComment(index, comment);
      setComment({ author: '', body: '' });
    }
  };

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    } else {
      // Fallback por si no se pasó onBack desde el padre
      window.history.back();
    }
  };

  return (
    <div
      className="post"
      style={{
        backgroundColor: '#faf9f5', // blanco roto
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '900px',
        margin: '2rem auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: '1.6'
      }}
    >
      {/* Botón volver a la página principal del blog (usa onBack pasado desde BlogPage) */}
      <button
        onClick={handleBack}
        style={{
          display: 'inline-block',
          backgroundColor: '#e6e6e6',
          color: '#222',
          padding: '0.45rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.95rem',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
        aria-label="Volver al blog"
      >
        ← Volver al blog
      </button>

      <img
        src={post.image}
        alt={post.title}
        style={{
          width: '100%',
          maxHeight: '500px',
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />

      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333' }}>
        {post.title}
      </h2>
      <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        {new Date(post.createdOn).toLocaleDateString()}
      </p>

      {post.body && post.body.map((line, i) => (
        <p key={i} style={{ marginBottom: '1rem', fontSize: '1.05rem', color: '#444' }}>
          {line}
        </p>
      ))}

      <button
        className="btn btn-default"
        onClick={() => handleLike(index)}
        style={{
          backgroundColor: '#004d00',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        <i className="fa fa-heart" style={{ marginRight: '0.4rem' }} /> Like ({post.likes})
      </button>

      <div className="comments" style={{ marginTop: '2rem' }}>
        {/* Aquí puedes mapear los comentarios actuales y añadir el formulario de añadir comentario */}
        {/* Ejemplo simple del formulario (descomenta si quieres usarlo): */}
        {/*
        <form onSubmit={submitComment}>
          <input
            type="text"
            placeholder="Nombre"
            value={comment.author}
            onChange={(e) => setComment(prev => ({ ...prev, author: e.target.value }))}
            required
          />
          <textarea
            placeholder="Comentario"
            value={comment.body}
            onChange={(e) => setComment(prev => ({ ...prev, body: e.target.value }))}
            required
          />
          <button type="submit">Enviar</button>
        </form>
        */}
      </div>
    </div>
  );
}

export default BlogPostDetail;

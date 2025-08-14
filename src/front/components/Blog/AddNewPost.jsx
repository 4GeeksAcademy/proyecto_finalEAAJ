import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddNewPost({ onAddPost, onCancel }) {
  const [formData, setFormData] = useState({ title: '', image: '', body: '' });
  const navigate = useNavigate();

    const [ titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [texto, setTexto] = useState("");
   


    const handleApiSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "api/articulo/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo,
          autor: autor,
          texto: texto,
          fecha: Date.now(),
          likes: 0,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {

        alert("articulo registrado con éxito ✅"); 
        setTimeout(() => {
          navigate({handleBack});
        }, 1000);
      } else if (response.status >= 400) {
        alert("Error: " + data.msg);
      }
    } catch (error) {
      console.error("Error al enviar el artículo:", error);
      alert("Error al enviar el artículo ❌");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.body && formData.image) {
      onAddPost(formData);
      setFormData({ title: '', image: '', body: '' });
    }
  };

  const handleBack = () => {
    // Si el padre pasó onCancel, lo usamos para cerrar el formulario en el componente padre.
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      // Fallback: navegamos a la ruta principal del blog
      navigate('/blog');
    }
  };

  

  return (
    <div
      style={{
        backgroundColor: '#faf9f5', // blanco roto
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '800px',
        margin: '2rem auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Botón para volver a la página principal del blog */}
      <button
        onClick={handleBack}
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          backgroundColor: '#004d00',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none',
          fontSize: '0.95rem',
          cursor: 'pointer'
        }}
        aria-label="Volver al Blog"
      >
        ← Volver al Blog
      </button>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{ marginBottom: '1rem' }}
        />
        <input
          className="form-control"
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          style={{ marginBottom: '1rem' }}
        />
        <textarea
          className="form-control"
          placeholder="Post content"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows={6}
          style={{ marginBottom: '1rem' }}
        />
        <input
          className="form-control"
          type="text"
          autor="autor"
          placeholder="autor"
          value={formData.autor}
          onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
          style={{ marginBottom: '1rem' }}
        />
        <button
          className="btn btn-success"
          type="submit"
          style={{
            backgroundColor: '#004d00',
            border: 'none',
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Add Post
        </button>
      </form>
    </div>
  );
}

export default AddNewPost;

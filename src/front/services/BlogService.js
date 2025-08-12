// src/services/blogService.js
const API_URL = "https://tu-dominio.com/api/articulo";

// Listar todos los artículos (GET)
export const listarArticulos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener artículos");
  return await res.json();
};

// Crear un artículo (POST) - requiere token
export const crearArticulo = async (titulo, texto) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ titulo, texto }),
  });
  if (!res.ok) throw new Error("Error al crear artículo");
  return await res.json();
};

// Obtener un artículo por ID (GET)
export const obtenerArticulo = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener artículo");
  return await res.json();
};

// Actualizar un artículo (PUT)
export const actualizarArticulo = async (id, titulo, texto) => {
  const res = await fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ titulo, texto }),
  });
  if (!res.ok) throw new Error("Error al actualizar artículo");
  return await res.json();
};

// Eliminar un artículo (DELETE)
export const eliminarArticulo = async (id) => {
  const res = await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar artículo");
  return await res.json();
};

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditarGasto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gasto, setGasto] = useState({ concepto: "", cantidad: "", emoji: "" });
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);

    const fetchGasto = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gasto/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar gasto");

        const data = await res.json();

        
        setGasto({
          concepto: data.gasto.concepto || "",
          cantidad: data.gasto.cantidad || "",
          emoji: data.gasto.emoji || "",
        });
      } catch (err) {
        console.error(err);
        alert("No se pudo cargar el gasto.");
        navigate("/main");
      }
    };

    if (storedToken) fetchGasto();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGasto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gasto/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...gasto,
          cantidad: parseFloat(gasto.cantidad),
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar gasto");

      alert("Gasto actualizado correctamente.");
      navigate("/main"); // o "/" según adónde quieras redirigir
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el gasto.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Editar Gasto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Concepto</label>
          <input
            type="text"
            className="form-control"
            name="concepto"
            value={gasto.concepto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad (€)</label>
          <input
            type="number"
            className="form-control"
            name="cantidad"
            value={gasto.cantidad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Emoji</label>
          <input
            type="text"
            className="form-control"
            name="emoji"
            value={gasto.emoji}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};
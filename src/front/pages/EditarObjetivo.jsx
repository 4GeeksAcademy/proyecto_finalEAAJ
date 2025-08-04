import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditarObjetivo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [fechaLimite, setFechaLimite] = useState("");
    const [descripcion, setDescripcion] = useState("");
  const [token, setToken] = useState("");

    useEffect(() => {
        const savedToken = localStorage.getItem("token") || "";
        if (!savedToken || savedToken.length < 10) {
          navigate("/");
        } 
      }, [navigate]);

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  // 🔹 Cargar objetivo existente
  useEffect(() => {
    if (!token) return;

    const fetchObjetivo = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/objetivo/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error al cargar objetivo");

        const data = await res.json();
        console.log("Objetivo recibido:", data);

        const obj = data.objetivo; 
        setConcepto(obj.titulo || "");
        setCantidad(obj.cantidad_meta || 0);
        setFechaLimite(obj.fecha_limite?.split("T")[0] || ""); 
        setDescripcion(obj.descripcion || "");
      } catch (err) {
        console.error(err);
        navigate("/main");
      }
    };

    fetchObjetivo();
  }, [id, token, navigate]);

  // 🔹 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    const objetivoActualizado = {
      titulo: concepto,
      cantidad_meta: cantidad,
      fecha_limite: fechaLimite,
      descripcion,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/objetivo/update/${id}`, // ✅ RUTA CORRECTA
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(objetivoActualizado),
        }
      );

      if (!res.ok) throw new Error("Error al editar objetivo");
      navigate("/main");
    } catch (err) {
      console.error(err);
      alert("No se pudo editar el objetivo");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h5>Editar objetivo de ahorro</h5>
      <form onSubmit={handleSubmit}>
        {/* Concepto */}
        <div className="mb-3">
          <label className="form-label">Concepto</label>
          <input
            type="text"
            className="form-control"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            required
          />
        </div>

        {/* Cantidad */}
        <div className="mb-3">
          <label className="form-label">
            Cantidad: <strong>{cantidad} €</strong>
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="5000"
            step="50"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
        </div>

        {/* Fecha */}
        <div className="mb-3">
          <label className="form-label">Fecha límite</label>
          <input
            type="date"
            className="form-control"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            required
          />
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};
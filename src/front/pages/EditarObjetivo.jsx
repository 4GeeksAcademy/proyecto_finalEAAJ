import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

export const EditarObjetivo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [fechaLimite, setFechaLimite] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [emoji, setEmoji] = useState("");
  const [frecuencia, setFrecuencia] = useState("diario");
  const [token, setToken] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken || savedToken.length < 10) {
      navigate("/main");
      return;
    }

    setToken(savedToken);

    const fetchObjetivo = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/objetivo/${id}`,
          {
            headers: { Authorization: `Bearer ${savedToken}` },
          }
        );

        if (!res.ok) throw new Error("Error al cargar objetivo");

        const data = await res.json();
        const obj = data.objetivo;
        setTitulo(obj.titulo || "");
        setCantidad(obj.cantidad_meta || 0);
        setFechaLimite(obj.fecha_limite?.split("T")[0] || "");
        setDescripcion(obj.descripcion || "");
        setEmoji(obj.emoji || "");
        setFrecuencia(obj.frecuencia || "diario");
      } catch (err) {
        console.error(err);
        navigate("/main");
      }
    };

    fetchObjetivo();
  }, [id, navigate]);

  const onEmojiClick = (emojiObject) => {
    const emojiChar = emojiObject.emoji;
    if (inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newText =
        titulo.substring(0, start) + emojiChar + titulo.substring(end);
      setTitulo(newText);
      setTimeout(() => {
        input.setSelectionRange(start + emojiChar.length, start + emojiChar.length);
        input.focus();
      }, 0);
    } else {
      setTitulo(titulo + emojiChar);
    }
    setEmoji(emojiChar);
    setShowPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const objetivoActualizado = {
      titulo,
      cantidad_meta: cantidad,
      fecha_limite: fechaLimite,
      descripcion,
      emoji: emoji || "",
      frecuencia,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/objetivo/update/${id}`,
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

      localStorage.setItem("recargarObjetivos", "true");
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
            ref={inputRef}
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPicker(!showPicker)}
              style={{ width: "45px", height: "40px", fontSize: "20px", padding: 0 }}
            >
              {emoji || "😊"}
            </button>
          </div>
          {showPicker && (
            <div style={{ position: "absolute", zIndex: 1000 }}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
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

        {/* Frecuencia de ahorro */}
        <div className="mb-3">
          <label className="form-label">¿Cómo quieres que se calcule tu ahorro?</label>
          <select
            className="form-select"
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
            required
          >
            <option value="diario">Diariamente</option>
            <option value="mensual">Mensualmente</option>
            <option value="anual">Anualmente</option>
          </select>
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label">Descripción (opcional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Explica tu objetivo..."
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};
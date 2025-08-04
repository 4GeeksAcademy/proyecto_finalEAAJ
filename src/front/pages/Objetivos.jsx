import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";



export const Objetivos = () => {
  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [fechaLimite, setFechaLimite] = useState("");
  const [explicacion, setExplicacion] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [token, setToken] = useState("");
  const inputRef = useRef(null);
  
  const navigate = useNavigate();
  



useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    setToken(savedToken);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const nuevoObjetivo = { "titulo":concepto, "cantidad_meta":cantidad, "fecha_limite":fechaLimite, "descripcion":explicacion, "emoji":""};

  try {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "api/objetivo/register", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}` 
  },
  body: JSON.stringify(nuevoObjetivo),
});

    if (!res.ok) throw new Error("Error al guardar objetivo");
    navigate("/main");
  } catch (err) {
    console.error(err);
    alert("No se pudo guardar el objetivo");
  }
};

  const onEmojiClick = (emojiObject) => {
    const emojiChar = emojiObject.emoji;
    if (inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newText =
        concepto.substring(0, start) + emojiChar + concepto.substring(end);
      setConcepto(newText);
      setTimeout(() => {
        input.setSelectionRange(start + emojiChar.length, start + emojiChar.length);
        input.focus();
      }, 0);
    } else {
      setConcepto(concepto + emojiChar);
    }
    setEmoji(emojiChar);
    setShowPicker(false);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h5>Crear objetivo de ahorro</h5>
      <form onSubmit={handleSubmit}>
        {/* Concepto */}
        <div className="mb-3">
          <label className="form-label">Concepto</label>
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
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
            onChange={(e) => setCantidad(e.target.value)}
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

        {/* ✅ Explicación */}
        <div className="mb-3">
          <label className="form-label">Explicación (opcional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={explicacion}
            onChange={(e) => setExplicacion(e.target.value)}
            placeholder="Explica tu objetivo..."
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crear Objetivo
        </button>
      </form>
    </div>
  );
};
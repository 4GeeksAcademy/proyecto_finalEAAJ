
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
  const [frecuencia, setFrecuencia] = useState("diario");
  const [mensaje, setMensaje] = useState("");
  const inputRef = useRef(null);

  const navigate = useNavigate();

  // Validación de token
  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    if (!savedToken || savedToken.length < 10) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const savedToken = localStorage.getItem("token") || "";
    if (!savedToken) {
      alert("Token no disponible. Vuelve a iniciar sesión.");
      return;
    }

    const nuevoObjetivo = {
      titulo: concepto,
      cantidad_meta: cantidad,
      fecha_limite: fechaLimite,
      descripcion: explicacion,
      emoji: emoji || "",
      frecuencia: frecuencia,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/objetivo/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify(nuevoObjetivo),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        throw new Error("Error al guardar objetivo");
      }

      setMensaje(`✅ Objetivo "${concepto}" guardado correctamente.`);
      localStorage.setItem("recargarObjetivos", "true");

      // Espera un poco antes de redirigir para mostrar el mensaje
      setTimeout(() => {
        navigate("/main");
      }, 1500);

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

  // --- ESTILOS INLINE ---
  const containerStyle = {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "25px 30px",
    border: "2px solid #7bff00",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(123, 255, 0, 0.3)",
    backgroundColor: "#fff",
  };

  const baseBtnStyle = {
    backgroundColor: "#7bff00",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    padding: "10px",
    width: "100%",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(123, 255, 0, 0.3)",
  };

  const [btnStyle, setBtnStyle] = useState(baseBtnStyle);

  const handleMouseEnter = () => setBtnStyle({ ...baseBtnStyle, backgroundColor: "#5fd800" });
  const handleMouseLeave = () => setBtnStyle(baseBtnStyle);

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Añadir nuevo objetivo</h1>
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
          <label className="form-label">Cantidad: <strong>{cantidad} €</strong></label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="5000"
            step="50"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            style={{
              outline: "none",
              boxShadow: "none",
              WebkitAppearance: "none",
              background: "#7bff00",
              height: "6px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Fecha límite */}
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

        {/* Frecuencia */}
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

        {/* Explicación */}
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

        {/* Botón */}
        <button
          type="submit"
          style={btnStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Crear Objetivo
        </button>

        {/* Mensaje */}
        {mensaje && (
          <div
            className="text-center mt-3"

          >
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
};

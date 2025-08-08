import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";

export const AddNewGasto = () => {
  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    if (!savedToken || savedToken.length < 10) {
      navigate("/");
    }
  }, [navigate]);

  const onEmojiClick = (emojiObject) => {
    setEmoji(emojiObject.emoji);
    setShowPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!concepto.trim()) {
      alert("El concepto es obligatorio");
      setLoading(false);
      return;
    }

    if (isNaN(cantidad) || parseFloat(cantidad) <= 0) {
      alert("La cantidad debe ser un número mayor que cero");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token. Inicia sesión.");
      setLoading(false);
      return;
    }

    const gastoData = {
      concepto: concepto,
      cantidad: parseFloat(cantidad),
      emoji: emoji || null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}api/gasto/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(gastoData),
      });

      const result = await response.json();

      if (response.ok) {
        const gastosGuardados = JSON.parse(localStorage.getItem("gastos")) || [];
        gastosGuardados.push({
          concepto,
          cantidad: parseFloat(cantidad),
          emoji,
          fecha: new Date().toISOString(),
        });
        localStorage.setItem("gastos", JSON.stringify(gastosGuardados));
        setMensaje(`✅ Gasto guardado: ${concepto} ${emoji} - ${cantidad}€`);
        setTimeout(() => navigate("/main"), 1000);
        setConcepto("");
        setCantidad("");
        setEmoji("");
      } else {
        setMensaje("❌ Error: " + (result.msg || "No se pudo guardar el gasto"));
      }
    } catch (error) {
      setMensaje("❌ Error de conexión al guardar el gasto");
      console.error("Error al enviar:", error);
    } finally {
      setLoading(false);
    }
  };

  // === Estilos ===
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
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Añadir nuevo gasto</h1>
      <form onSubmit={handleSubmit}>
        {/* Concepto */}
        <div className="mb-3">
          <label className="form-label">Concepto del gasto</label>
          <input
            type="text"
            className="form-control"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            placeholder="Ej. Café, Transporte..."
            required
          />
        </div>

        {/* Cantidad */}
        <div className="mb-3">
          <label className="form-label">Cantidad (€)</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Emoji */}
        <div className="mb-3 position-relative">
          <label className="form-label">Emoji (opcional)</label>
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPicker(!showPicker)}
              style={{ width: "45px", height: "40px", fontSize: "20px", padding: 0 }}
            >
              {emoji || "😀"}
            </button>
            {showPicker && (
              <div style={{ position: "absolute", zIndex: 1000 }}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          style={btnStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Gasto"}
        </button>

        {/* Mensaje */}
        {mensaje && (
          <div className="text-center mt-3">
            <p>{mensaje}</p>
          </div>
        )}
      </form>
    </div>
  );
};

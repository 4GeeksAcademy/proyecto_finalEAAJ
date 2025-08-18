import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export const AddNewGasto = () => {
  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const appRef = useRef(null);

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

  const createMoneyAnimation = () => {
    const bill = document.createElement("div");
    bill.className = "money-bill";
    bill.textContent = "💵"; // Puedes usar '💶' para euros

    // Posición inicial aleatoria en la parte superior
    const startX = Math.random() * window.innerWidth;
    bill.style.left = `${startX}px`;
    bill.style.top = "-50px";
    bill.style.position = "fixed";
    bill.style.zIndex = "1000";

    document.body.appendChild(bill);

    gsap.to(bill, {
      y: window.innerHeight + 100,
      rotation: gsap.utils.random(-180, 180),
      duration: gsap.utils.random(2, 4),
      ease: "power1.in",
      onComplete: () => bill.remove(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
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

    // Animación de billetes (5 billetes)
    for (let i = 0; i < 5; i++) {
      setTimeout(createMoneyAnimation, i * 200);
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
        // Animación adicional al guardar con éxito
        for (let i = 0; i < 3; i++) {
          setTimeout(createMoneyAnimation, i * 300);
        }

        /* const gastosGuardados = JSON.parse(localStorage.getItem("gastos")) || [];
        gastosGuardados.push({
          concepto,
          cantidad: parseFloat(cantidad),
          emoji,
          fecha: new Date().toISOString(),
        });
        localStorage.setItem("gastos", JSON.stringify(gastosGuardados)); */

        setMensaje(`✅ Gasto guardado: ${concepto} ${emoji} - ${cantidad}€`);
        setTimeout(() => {
          navigate("/main");
        }, 1500);
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
    <div className="addgasto-container" ref={appRef}>
      <form className="addgasto-form-wrapper" onSubmit={handleSubmit} style={containerStyle}>
        <div className="addgasto-title">
          <h1>¡Añade otro gasto!</h1>
        </div>

        <div className="addgasto-form-content">
          {/* INPUT CONCEPTO */}
          <div className="mb-4">
            <label htmlFor="concepto" className="form-label">
              Concepto del gasto
            </label>
            <input
              type="text"
              id="concepto"
              className="form-control"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Comida, transporte..."
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

          {/* BOTÓN */}
          <div className="mb-3 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary addgasto-btn-guardar"
              disabled={loading}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={btnStyle}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Guardando...
                </>
              ) : (
                "Guardar gasto"
              )}
            </button>
          </div>

          {/* ESTILOS PARA LOS BILLETES */}
          <style>
            {`
              .money-bill {
                width: 40px;
                height: 40px;
                background: #8BC34A;
                color: white;
                font-size: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                pointer-events: none;
                user-select: none;
              }
            `}
          </style>

          {/* Mensaje */}
          {mensaje && (
            <div className="text-center mt-3">
              <p>{mensaje}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

export const AddNewGasto = () => {
  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Obtener user_id desde el perfil
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠️ No hay token. Inicia sesión.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}api/user/profile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.id) {
          setUserId(data.user.id);
        } else {
          setMensaje("⚠️ Error al obtener el perfil del usuario");
        }
        setLoading(false);
      })
      .catch(() => {
        setMensaje("⚠️ Error de red al obtener el perfil");
        setLoading(false);
      });
  }, []);

  const onEmojiClick = (emojiObject) => {
    setEmoji(emojiObject.emoji);
    setShowPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!concepto.trim()) {
      alert("El concepto es obligatorio");
      return;
    }

    if (isNaN(cantidad) || parseFloat(cantidad) <= 0) {
      alert("La cantidad debe ser un número mayor que cero");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token. Inicia sesión.");
      return;
    }

    // Datos para el backend (según tu endpoint)
    const gastoData = {
      user_id: userId,
      sueldo: parseFloat(cantidad),
      is_student: false,
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
        // Guardar localmente el gasto para usar en frontend
        const gastosGuardados = JSON.parse(localStorage.getItem("gastos")) || [];
        gastosGuardados.push({
          concepto,
          cantidad: parseFloat(cantidad),
          emoji,
          fecha: new Date().toISOString(),
        });
        localStorage.setItem("gastos", JSON.stringify(gastosGuardados));

        setMensaje(`✅ Gasto guardado: ${concepto} ${emoji} - ${cantidad}€`);
        setConcepto("");
        setCantidad("");
        setEmoji("");
        setShowPicker(false);
      } else {
        setMensaje("❌ Error: " + (result.msg || "No se pudo guardar el gasto"));
      }
    } catch (error) {
      setMensaje("❌ Error al guardar el gasto");
      console.error("Error al enviar:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando usuario...</div>;
  }

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#ffffff", minHeight: "80vh" }}
    >
      <form
        className="w-100"
        style={{ maxWidth: "600px" }}
        onSubmit={handleSubmit}
      >
        <div
          className="text-center"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          <h1>¡Añade otro gasto!</h1>
        </div>

        <div
          className="p-5 rounded shadow-lg"
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "600px",
            paddingTop: "60px",
            paddingBottom: "60px",
          }}
        >
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

          <div className="mb-4">
            <label htmlFor="cantidad" className="form-label">
              Cantidad (€)
            </label>
            <input
              type="number"
              id="cantidad"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label">Emoji (opcional)</label>
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPicker(!showPicker)}
              >
                {emoji || "😀"}
              </button>
              {showPicker && (
                <div style={{ position: "absolute", zIndex: 999, top: "50px" }}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                backgroundColor: "#b7ff00",
                color: "black",
                border: "1px solid #b7ff00",
              }}
            >
              Guardar gasto
            </button>
          </div>

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

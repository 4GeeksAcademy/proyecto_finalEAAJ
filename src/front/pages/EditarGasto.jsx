import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import Loader from "./Loader.jsx";

export const EditarGasto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gasto, setGasto] = useState({ concepto: "", cantidad: "", emoji: "" });
  const [token, setToken] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const errorShownRef = useRef(false);
  const [mostrarContenido, setMostrarContenido] = useState(false); // 👈 nuevo estado

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);

    if (!storedToken) return;

    const fetchGasto = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}api/gasto/${id}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) {
          const errorMsg = await res.text();
          console.error("Respuesta de error:", errorMsg);
          throw new Error("Error al cargar gasto");
        }

        const data = await res.json();

        setGasto({
          concepto: data.gasto.concepto || "",
          cantidad: data.gasto.cantidad || "",
          emoji: data.gasto.emoji || "",
        });

        // ⏳ Pequeña espera para mostrar todo junto
        setTimeout(() => {
          setMostrarContenido(true);
        }, 200);
      } catch (err) {
        console.error("Fallo al cargar el gasto:", err.message);
        if (!errorShownRef.current) {
          alert("No se pudo cargar el gasto.");
          errorShownRef.current = true;
          navigate("/main");
        }
      }
    };

    fetchGasto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGasto((prev) => ({ ...prev, [name]: value }));
  };

  const onEmojiClick = (emojiObject) => {
    setGasto((prev) => ({ ...prev, emoji: emojiObject.emoji }));
    setShowPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!gasto.concepto.trim()) {
      alert("El concepto es obligatorio");
      setLoading(false);
      return;
    }

    if (isNaN(gasto.cantidad) || parseFloat(gasto.cantidad) <= 0) {
      alert("La cantidad debe ser un número mayor que cero");
      setLoading(false);
      return;
    }

    try {
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

      setMensaje(`✅ Gasto actualizado: ${gasto.concepto} ${gasto.emoji} - ${gasto.cantidad}€`);
      setTimeout(() => {
        navigate("/main");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el gasto.");
    } finally {
      setLoading(false);
    }
  };

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

  if (!mostrarContenido) return <Loader />; 

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Editar gasto</h1>

        <div className="mb-4">
          <label htmlFor="concepto" className="form-label">Concepto del gasto</label>
          <input
            type="text"
            id="concepto"
            name="concepto"
            className="form-control"
            value={gasto.concepto}
            onChange={handleChange}
            placeholder="Ej. Comida, transporte..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cantidad" className="form-label">Cantidad (€)</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            className="form-control"
            value={gasto.cantidad}
            onChange={handleChange}
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
              style={{ width: "45px", height: "40px", fontSize: "20px", padding: 0 }}
            >
              {gasto.emoji || "😀"}
            </button>
            {showPicker && (
              <div style={{ position: "absolute", zIndex: 100 }}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          style={btnStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>

        {mensaje && (
          <div className="text-center mt-3">
            <p>{mensaje}</p>
          </div>
        )}
      </form>
    </div>
  );
};
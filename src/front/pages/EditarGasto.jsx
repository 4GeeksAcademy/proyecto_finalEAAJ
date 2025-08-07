import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

export const EditarGasto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gasto, setGasto] = useState({ concepto: "", cantidad: "", emoji: "" });
  const [token, setToken] = useState("");
  const [showPicker, setShowPicker] = useState(false);


 useEffect(() => {
  const storedToken = localStorage.getItem("token") || "";
  setToken(storedToken);

  const fetchGasto = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}api/gasto/${id}`;
      console.log("URL de fetch:", url);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      console.log("Respuesta:", res);

      if (!res.ok) throw new Error("Error al cargar gasto");

      const data = await res.json();
      console.log("Gasto recibido:", data);

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

  const onEmojiClick = (emojiObject) => {
  setGasto((prev) => ({ ...prev, emoji: emojiObject.emoji }));
  setShowPicker(false);
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

        <div className="mb-3 position-relative">
  <label className="form-label">Emoji</label>
  <div className="d-flex align-items-center gap-3">
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => setShowPicker(!showPicker)}
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
        <button type="submit" className="btn btn-success">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};
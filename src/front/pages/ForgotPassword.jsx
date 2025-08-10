import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!email.includes("@")) {
      setMessage("❌ Introduce un correo válido.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/user/forgotten",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Token generado. Redirigiendo al cambio de contraseña...");
        setEmail("");

        setTimeout(() => {
          navigate("/resetpassword");
        }, 1500);
      } else {
        setMessage(data.msg || "❌ No se pudo generar el token.");
      }
    } catch (error) {
      setMessage("❌ Error de red. Intenta de nuevo más tarde."+import.meta.env.VITE_BACKEND_URL);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center py-24 justify-center bg-gray-100 px-4">
    <div className=" forgot-password card bg-white border-4  rounded-xl shadow-md p-6 max-w-md w-full" style={{ borderColor: "#b7ff00" }}>
      <div className="forgot-password-header text-center mb-6">
        <div className="forgot-password-emoji text-4xl">🔐</div>
        <h3 className="forgot-password-title text-xl font-bold mt-2">
          ¿Olvidaste tu contraseña?
        </h3>
        <p className="forgot-password-subtitle text-gray-600 text-sm">
          Introduce tu correo para generar un nuevo acceso.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="forgot-password-form space-y-4">
        <div className="form-group">
          <label className="form-label block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            type="email"
            className="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b7ff00]"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          className="btn forgot-password-submit w-full py-2 bg-[#b7ff00] text-black font-semibold rounded-md hover:opacity-90 transition disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Generar token"}
        </button>
      </form>

      {message && (
        <div className="forgot-password-message text-center text-sm mt-4">
          {message}
        </div>
      )}
    </div>
  </div>
);
};
import React, { useEffect, useState } from "react";
import { ProfileImageUploader } from "../components/ProfileImageUploader";
import { Link, useNavigate } from "react-router-dom";

const Perfil = () => {
  const navigate = useNavigate(); // ✅ Ahora está dentro del componente

  const [usuario, setUsuario] = useState({
    username: "",
    nombre: "",
    apellido: "",
    email: "",
    pais: "",
    telefono: "",
    sueldo: "",
    situacion: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState("/user-profile.png");
  const [showPopup, setShowPopup] = useState(false); // ✅ Estado para la pop up

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(import.meta.env.VITE_BACKEND_URL + "api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información del usuario");
        return res.json();
      })
      .then(data => {
        const u = data.user;
        setUsuario({
          username: u.username || "",
          nombre: u.firstname || "",
          apellido: u.lastname || "",
          email: u.email || "",
          pais: u.country || "",
          telefono: u.phone || "",
          sueldo: u.sueldo || "",
          situacion: u.is_student ? "estudiante" : (u.is_student === false ? "trabajador" : ""),
        });

        if (u.perfil) setFotoPerfil(u.perfil);
      })
      .catch(err => console.error("Error al cargar el perfil:", err));
  }, []);

  const handleGuardar = () => {
    const token = localStorage.getItem("token");
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usuario.username,
        firstname: usuario.nombre,
        lastname: usuario.apellido,
        email: usuario.email,
        country: usuario.pais,
        phone: usuario.telefono,
        sueldo: Number(usuario.sueldo),
        is_student: usuario.situacion === "estudiante",
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo actualizar el perfil");
        return res.json();
      })
      .then(data => {
        setUsuario(prev => ({
          ...prev,
          username: data.username || prev.username,
          nombre: data.firstname || data.nombre,
          apellido: data.lastname || data.apellido,
          email: data.email || prev.email,
          pais: data.country || prev.pais,
          telefono: data.phone || prev.telefono,
          sueldo: data.sueldo || prev.sueldo,
          situacion: data.is_student ? "estudiante" : "trabajador",
        }));
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("fotoPerfil", fotoPerfil);
        alert("Perfil actualizado con éxito ✅");
      })
      .catch(err => console.error("Error al actualizar el perfil:", err));
  };

  const handleEliminar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay sesión activa.");
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("fotoPerfil");
        alert("✅ Tu cuenta ha sido eliminada correctamente.");
        navigate("/");
      } else {
        const data = await res.json();
        alert("❌ No se pudo eliminar la cuenta: " + (data.msg || "Error desconocido."));
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("❌ Error al eliminar la cuenta. Intenta de nuevo más tarde.");
    } finally {
      setShowPopup(false);
    }
  };

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    boxSizing: "border-box",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxShadow: "0 2px 4px #FBFFE4",
    fontSize: "16px",
    color: "#333",
  };

  return (
    <div
      style={{
        maxWidth: "350px",
        margin: "20px auto",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        border: "5px solid #b7ff00",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <ProfileImageUploader image={fotoPerfil} onImageChange={setFotoPerfil} />
      </div>

      <input type="text" name="username" value={usuario.username} onChange={handleChange} style={inputStyle} placeholder="Usuario" />
      <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} style={inputStyle} placeholder="Nombre" />
      <input type="text" name="apellido" value={usuario.apellido} onChange={handleChange} style={inputStyle} placeholder="Apellidos" />
      <input type="email" name="email" value={usuario.email} onChange={handleChange} style={inputStyle} placeholder="Email" />

      <select name="pais" value={usuario.pais} onChange={handleChange} style={inputStyle}>
        <option value="">Selecciona país</option>
        <option value="Alemania">Alemania</option>
        <option value="Austria">Austria</option>
        <option value="Bélgica">Bélgica</option>
        <option value="Chipre">Chipre</option>
        <option value="Croacia">Croacia</option>
        <option value="Eslovaquia">Eslovaquia</option>
        <option value="Eslovenia">Eslovenia</option>
        <option value="España">España</option>
        <option value="Estonia">Estonia</option>
        <option value="Finlandia">Finlandia</option>
        <option value="Francia">Francia</option>
        <option value="Grecia">Grecia</option>
        <option value="Irlanda">Irlanda</option>
        <option value="Italia">Italia</option>
        <option value="Letonia">Letonia</option>
        <option value="Lituania">Lituania</option>
        <option value="Luxemburgo">Luxemburgo</option>
        <option value="Malta">Malta</option>
        <option value="Países Bajos">Países Bajos</option>
        <option value="Portugal">Portugal</option>
      </select>

      <input
        type="tel"
        name="telefono"
        value={usuario.telefono}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Teléfono (+prefijo)"
      />

      <input
        type="number"
        name="sueldo"
        value={usuario.sueldo}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Sueldo (€)"
      />

      <select name="situacion" value={usuario.situacion} onChange={handleChange} style={inputStyle}>
        <option value="">Selecciona situación</option>
        <option value="estudiante">Soy estudiante</option>
        <option value="trabajador">Tengo trabajo</option>
      </select>

      <button
        onClick={handleGuardar}
        style={{
          backgroundColor: "#B7FF00",
          border: "none",
          padding: "10px",
          width: "100%",
          marginTop: "15px",
          fontWeight: "bold",
          borderRadius: "6px",
          boxShadow: "0 2px 4px #FBFFE4",
          cursor: "pointer",
        }}
      >
        Guardar Cambios
      </button>

      <button
        onClick={() => navigate("/resetpassword")}
        style={{
          display: "block",
          backgroundColor: "#FFA500",
          border: "none",
          padding: "10px",
          width: "100%",
          marginTop: "10px",
          fontWeight: "bold",
          borderRadius: "6px",
          textAlign: "center",
          color: "#000",
          cursor: "pointer",
        }}
      >
        Reset Password
      </button>

      {/* Botón de eliminar usuario */}
      <button
        onClick={() => setShowPopup(true)}
        style={{
          display: "block",
          backgroundColor: "#FF4C4C",
          border: "none",
          padding: "10px",
          width: "100%",
          marginTop: "10px",
          fontWeight: "bold",
          borderRadius: "6px",
          textAlign: "center",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Eliminar Usuario
      </button>

      {/* POPUP MODAL */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              width: "300px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3>⚠️ Confirmar eliminación</h3>
            <p>¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
              <button
                onClick={handleEliminar}
                style={{
                  backgroundColor: "#FF4C4C",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  backgroundColor: "#ccc",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;

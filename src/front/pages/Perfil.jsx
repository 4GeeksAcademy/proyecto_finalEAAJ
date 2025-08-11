import React, { useEffect, useState } from "react";
import { ProfileImageUploader } from "../components/ProfileImageUploader";

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    username: "username",
    nombre: "nombre",
    apellido: "apellido",
    email: "email",
  });

  const [fotoPerfil, setFotoPerfil] = useState("/user-profile.png");
  const [nuevaPassword, setNuevaPassword] = useState("");

  // Obtener datos del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://tu-dominio.com/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información del usuario");
        return res.json();
      })
      .then(data => {
        setUsuario({
          username: data.username || "",
          nombre: data.first_name || data.nombre || "",
          apellido: data.last_name || data.apellido || "",
          email: data.email || "",
        });
        if (data.fotoPerfil) setFotoPerfil(data.fotoPerfil);
      })
      .catch(err => console.error("Error al cargar el perfil:", err));
  }, []);

  // Guardar cambios de perfil en la API
  const handleGuardar = () => {
    const token = localStorage.getItem("token");

    fetch("https://tu-dominio.com/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...usuario, fotoPerfil }),
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo actualizar el perfil");
        return res.json();
      })
      .then(data => {
        setUsuario(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("fotoPerfil", fotoPerfil);
        alert("Perfil actualizado con éxito ✅");
      })
      .catch(err => console.error("Error al actualizar el perfil:", err));
  };

  // Cambiar contraseña
  const handleChangePassword = () => {
    if (!nuevaPassword.trim()) {
      alert("La contraseña no puede estar vacía");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("https://tu-dominio.com/api/user/reset-password", {
      method: "PUT", // O POST según tu API
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: nuevaPassword }),
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cambiar la contraseña");
        return res.json();
      })
      .then(() => {
        alert("Contraseña cambiada con éxito 🔑");
        setNuevaPassword("");
      })
      .catch(err => console.error("Error al cambiar la contraseña:", err));
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
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Imagen de perfil */}
      <div style={{ marginBottom: "20px" }}>
        <ProfileImageUploader image={fotoPerfil} onImageChange={setFotoPerfil} />
      </div>

      {/* Inputs de perfil */}
      <input type="text" name="username" value={usuario.username} onChange={handleChange} style={inputStyle} />
      <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} style={inputStyle} />
      <input type="text" name="apellido" value={usuario.apellido} onChange={handleChange} style={inputStyle} />
      <input type="email" name="email" value={usuario.email} onChange={handleChange} style={inputStyle} />

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

      {/* Cambio de contraseña */}
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaPassword}
        onChange={(e) => setNuevaPassword(e.target.value)}
        style={inputStyle}
      />
      <button
        onClick={handleChangePassword}
        style={{
          backgroundColor: "#FFA500",
          border: "none",
          padding: "10px",
          width: "100%",
          marginTop: "10px",
          fontWeight: "bold",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Reset Password
      </button>
    </div>
  );
};

export default Perfil;

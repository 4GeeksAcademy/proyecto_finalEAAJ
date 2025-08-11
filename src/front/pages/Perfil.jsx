import React, { useEffect, useState } from "react";
import { ProfileImageUploader } from "../components/ProfileImageUploader";

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    username: "Username",
    nombre: "Nombre",
    apellido: "Apellido",
    email: "Email",
  });

  const [fotoPerfil, setFotoPerfil] = useState("/user-profile.png");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPhoto = localStorage.getItem("fotoPerfil");
    const token = localStorage.getItem("token");

    if (storedPhoto) {
      setFotoPerfil(storedPhoto);
    }

    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else if (token) {
      fetch("https://stunning-doodle-g47p9q545xx7f9rv-3001.app.github.dev/api/profile", {
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
          const userData = {
            username: data.username,
            nombre: data.first_name || data.nombre,
            apellido: data.last_name || data.apellido,
            email: data.email,
          };
          setUsuario(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(err => console.error("Error al cargar el perfil:", err));
    }
  }, []);

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = () => {
    localStorage.setItem("user", JSON.stringify(usuario));
    localStorage.setItem("fotoPerfil", fotoPerfil);
    alert("Cambios guardados localmente ✅");
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
      {/* Imagen de perfil con carga */}
      <div style={{ marginBottom: "20px" }}>
        <ProfileImageUploader image={fotoPerfil} onImageChange={setFotoPerfil} />
      </div>

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
          transition: "background-color 0.3s ease",
        }}
      >
        Guardar Cambios
      </button>
    </div>
  );
};

export default Perfil;
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
          pais: data.country || "",
          telefono: data.phone || "",
          sueldo: data.sueldo || "",
          situacion: data.is_student ? "estudiante" : (data.is_student === false ? "trabajador" : ""),
        });
        if (data.fotoPerfil) setFotoPerfil(data.fotoPerfil);
      })
      .catch(err => console.error("Error al cargar el perfil:", err));
  }, []);

  const handleGuardar = () => {
    const token = localStorage.getItem("token");
    fetch("https://tu-dominio.com/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usuario.username,
        first_name: usuario.nombre,
        last_name: usuario.apellido,
        email: usuario.email,
        country: usuario.pais,
        phone: usuario.telefono,
        sueldo: usuario.sueldo,
        is_student: usuario.situacion === "estudiante",
        fotoPerfil,
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
          nombre: data.first_name || data.nombre,
          apellido: data.last_name || data.apellido,
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

      {/* Botón para ir a Reset Password */}
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
      
    </div>
  );
};

export default Perfil;

import React from "react";


import { useState } from "react";

const Perfil = () => {
  const usuario = {
    username: "Username",
    nombre: "nombre",
    apellido: "apellido",
    email: "email",
  };

  const [imageSrc, setImageSrc] = useState("/user-profile.png");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
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
    color: "grey",
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
      <div style={{ marginBottom: "10px", position: "relative" }}>
        <img
          src={imageSrc}
          alt="Foto de perfil"
          style={{
            borderRadius: "50%",
            marginBottom: "8px",
            width: "120px",
            height: "120px",
            objectFit: "cover",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <label
          htmlFor="file-upload"
          style={{
            display: "inline-block",
            padding: "6px 12px",
            cursor: "pointer",
            color: "black",
            fontWeight: "600",
            border: "2px solid #7bff00",
            borderRadius: "6px",
            userSelect: "none",
            fontSize: "14px",
            marginTop: "6px",
          }}
        >
          Cambiar foto
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <input type="text" value={`@${usuario.username}`} readOnly style={inputStyle} />
      <input type="text" value={usuario.nombre} readOnly style={inputStyle} />
      <input type="text" value={usuario.apellido} readOnly style={inputStyle} />
      <input type="email" value={usuario.email} readOnly style={inputStyle} />
    </div>
  );
};

export default Perfil;
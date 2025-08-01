import React from "react";

const Perfil = () => {
  const usuario = {
    username: "juanperez123",
    nombre: "Juan Pérez",
    apellido: "Pérez",
    email: "juan@example.com",
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
  };

  const buttonStyle = {
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
  };

  const handleMouseDown = (e) => {
    e.currentTarget.style.backgroundColor = "#D4FF50";
  };
  const handleMouseUpOrLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#B7FF00";
  };

  const handleBorrarUsuario = () => {
    // Acción para borrar usuario (ejemplo)
    alert("Usuario borrado");
  };

  return (
    <div style={{
      maxWidth: "350px",
      margin: "20px auto",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <div style={{ marginBottom: "10px" }}>
        <img
          src="https://via.placeholder.com/100"
          alt="Foto de perfil"
          style={{ borderRadius: "50%", marginBottom: "8px" }}
        />
        <div style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
          añadir foto
        </div>
      </div>

      <input type="text" value={`@${usuario.username}`} readOnly style={inputStyle} />
      <input type="text" value={usuario.nombre} readOnly style={inputStyle} />
      <input type="text" value={usuario.apellido} readOnly style={inputStyle} />
      <input type="email" value={usuario.email} readOnly style={inputStyle} />

      <button
        style={buttonStyle}
        onClick={handleBorrarUsuario}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        borrar usuario
      </button>
    </div>
  );
};

export default Perfil;

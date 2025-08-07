import React, { useEffect, useState } from "react";

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    username: "Username",
    nombre: "Nombre",
    apellido: "Apellido",
    email: "Email",
  });

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

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
          if (!res.ok) {
            throw new Error("No se pudo obtener la información del usuario");
          }
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
          localStorage.setItem("user", JSON.stringify(userData)); // Guardamos en localStorage
        })
        .catch(err => {
          console.error("Error al cargar el perfil:", err);
        });
    } else {
      console.error("Token no encontrado. El usuario no ha iniciado sesión.");
    }
  }, []);

  
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

  const handleGuardar = () => {
    
    localStorage.setItem("user", JSON.stringify(usuario));
    alert("Cambios guardados localmente ✅");
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
          src="/user-profile.png"
          alt="Foto de perfil"
          style={{ borderRadius: "50%", marginBottom: "8px", width: "120px", height: "120px", objectFit: "cover" }}
        />
        <div style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
          añadir foto
        </div>
      </div>

      <input type="text" name="username" value={usuario.username} onChange={handleChange} style={inputStyle} />
      <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} style={inputStyle} />
      <input type="text" name="apellido" value={usuario.apellido} onChange={handleChange} style={inputStyle} />
      <input type="email" name="email" value={usuario.email} onChange={handleChange} style={inputStyle} />

      <button onClick={handleGuardar} style={{
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
      }}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default Perfil;

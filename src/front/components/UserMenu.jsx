import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const buttonStyle = {
    backgroundColor: "#B7FF00",
    border: "none",
    padding: "10px 15px",
    margin: "5px 0",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 2px 4px #FBFFE4",
    fontWeight: "bold",
    borderRadius: "4px",
    transition: "background-color 0.3s ease"
  };

  const buttonActiveStyle = {
    backgroundColor: "#D4FF50"
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        style={{ ...buttonStyle, width: "auto", padding: "10px 20px" }}
        onClick={() => setOpen(!open)}
      >
        Menú
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          zIndex: 1000,
          borderRadius: "6px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
          <button
            style={buttonStyle}
            onClick={() => navigate("/perfil")}
            onMouseDown={e => e.currentTarget.style.backgroundColor = "#D4FF50"}
            onMouseUp={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
          >
            Perfil
          </button>
          <button
            style={buttonStyle}
            onClick={() => navigate("/formulario")}
            onMouseDown={e => e.currentTarget.style.backgroundColor = "#D4FF50"}
            onMouseUp={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
          >
            Formulario
          </button>
          <button
            style={buttonStyle}
            onClick={handleLogout}
            onMouseDown={e => e.currentTarget.style.backgroundColor = "#D4FF50"}
            onMouseUp={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

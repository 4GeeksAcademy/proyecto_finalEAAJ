import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPerfil = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = () => {
  localStorage.removeItem("token");
  setIsLoggedOut(true);
  setOpen(false);

  setTimeout(() => {
    setIsLoggedOut(false);
  }, 3000); // 3000 ms = 3 segundos
};


  const buttonStyle = {
    backgroundColor: "#0D6EFD",
    color: "white",
    border: "none",
    padding: "10px 15px",
    margin: "5px 10px",
    width: "100%",
    textAlign: "auto",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "50px",
    transition: "background-color 0.1s ease"
  };

  return (
    <div style={{ position: "absolute", top: "28px", right: "200px", display: "inline-block" }}>
      <button
        style={{ ...buttonStyle, width: "auto", padding: "10px 20px" }}
        onClick={() => setOpen(!open)}
      >
        P
      </button>
      {open && (
        <div>
          <div style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "black",
            border: "20px solid black",
            padding: "5px",
            zIndex: 1000,
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <button
              style={buttonStyle}
              onClick={() => navigate("/perfil")}
              onMouseDown={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
              onMouseUp={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
            >
              Perfil
            </button>
            <button
              style={buttonStyle}
              onClick={() => navigate("/formulario")}
              onMouseDown={e => e.currentTarget.style.backgroundColor = "#B7FF00"}
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
          {isLoggedOut && (
            <div style={{ marginTop: "10px", color: "blue" }}>
              Has cerrado sesión.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPerfil;

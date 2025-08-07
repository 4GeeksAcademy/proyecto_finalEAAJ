import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ProfilePic } from "./ProfilePic"; // 👈 Importamos el componente
import "./ProfilePic.css"; // 👈 Importamos los estilos

export const NavbarPrivate = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-light bg-light px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(to left,  #f4ffc4, #b7ff00, #f4ffc4)",
        backgroundSize: "200%",
        transition: "0.3s linear",
        minHeight: "6.6vh",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/main" className="navbar-brand fw-bold fs-4 text-black">
          Mo’Money
        </Link>

        <div className="position-relative" ref={dropdownRef}>
          {/* Botón de imagen de perfil personalizada */}
          <button
            className="btn btn-outline-light rounded-circle p-0"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            style={{
              width: "60px",
              height: "60px",
              overflow: "hidden",
              padding: 0,
              border: "none",
              background: "none",
            }}
          >
            <div style={{ width: "60px", height: "60px", position: "relative" }}>
              <ProfilePic compact={true} />
            </div>
          </button>

          {/* Menú desplegable */}
          {isDropdownOpen && (
            <div
              className="dropdown-menu dropdown-menu-end show mt-2"
              style={{ position: "absolute", right: 0 }}
            >
              <Link className="dropdown-item" to="/perfil">
                Perfil
              </Link>
              <Link className="dropdown-item" to="/editar-formulario">
                Editar Formulario
              </Link>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

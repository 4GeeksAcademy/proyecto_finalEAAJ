import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export const NavbarPrivate = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Cerrar el menú si se hace clic fuera
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
        background: "linear-gradient(to left, #22b455, #1dd1a1, #22b455)",
        backgroundSize: "200%",
        transition: "0.3s linear",
        minHeight: "6.6vh",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/main" className="navbar-brand fw-bold fs-4 text-white">
          Mo’money
        </Link>

        <div className="position-relative" ref={dropdownRef}>
          {/* Botón con imagen de perfil */}
          <button
            className="btn btn-outline-light rounded-circle p-0"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            style={{ width: "60px", height: "60px", overflow: "hidden" }}
          >
            <img
              src="https://i.pravatar.cc/300" // Puedes reemplazar esta URL por la de la imagen de perfil real
              alt="Perfil"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
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
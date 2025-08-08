import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export const NavbarPrivate = () => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLogoDropdownOpen, setLogoDropdownOpen] = useState(false);
  const profileDropdownRef = useRef();
  const logoDropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Cerrar ambos menús si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileDropdownOpen(false);
      }

      if (
        logoDropdownRef.current &&
        !logoDropdownRef.current.contains(e.target)
      ) {
        setLogoDropdownOpen(false);
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
        {/* Logo Mo'Money como dropdown */}
        <div className="position-relative" ref={logoDropdownRef}>
          <div
            className="navbar-brand fw-bold fs-4 text-black"
            style={{ cursor: "pointer" }}
            onClick={() => setLogoDropdownOpen(!isLogoDropdownOpen)}
          >
            Mo’Money ⌄
          </div>

          {isLogoDropdownOpen && (
            <div
              className="dropdown-menu show mt-2"
              style={{ position: "absolute", top: "100%", left: 0 }}
            >
              <Link className="dropdown-item" to="/main" onClick={() => setLogoDropdownOpen(false)}>
                Main
              </Link>
              <Link className="dropdown-item" to="/objetivos" onClick={() => setLogoDropdownOpen(false)}>
                Añadir Objetivos
              </Link>
              <Link className="dropdown-item" to="/addnewgasto" onClick={() => setLogoDropdownOpen(false)}>
                Añadir Gastos
              </Link>
              <Link className="dropdown-item" to="/inversion" onClick={() => setLogoDropdownOpen(false)}>
                Invertir
              </Link>
            </div>
          )}
        </div>

        {/* Perfil a la derecha */}
        <div className="position-relative" ref={profileDropdownRef}Cuckyynala33_
        >
          <button
            className="btn btn-outline-light rounded-circle p-0"
            onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
            style={{ width: "60px", height: "60px", overflow: "hidden" }}
          >
            <img
              src="https://i.pravatar.cc/300"
              alt="Perfil"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>

          {isProfileDropdownOpen && (
            <div
              className="dropdown-menu dropdown-menu-end show mt-2"
              style={{ position: "absolute", right: 0 }}
            >
              <Link className="dropdown-item" to="/perfil" onClick={() => setProfileDropdownOpen(false)}>
                Perfil
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
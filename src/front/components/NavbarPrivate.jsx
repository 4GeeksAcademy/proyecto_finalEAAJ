import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { checkTokenExpiration, refreshTokenWithCooldown } from "../utils/token";

export const NavbarPrivate = () => {
  const navigate = useNavigate();
  const [isLogoDropdownOpen, setLogoDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const logoDropdownRef = useRef();
  const userDropdownRef = useRef();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(import.meta.env.VITE_BACKEND_URL + "api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUsername(data.user.username || "");
      });
  }, []);

  useEffect(() => {
    const expired = checkTokenExpiration();
    if (expired) {
      console.log("El token ha expirado y fue eliminado");
    }
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      refreshTokenWithCooldown();
    };
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("keydown", handleActivity);
    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active: false,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo actualizar el perfil");
        return res.json();
      })
      .catch(err => console.error("Error al actualizar el perfil:", err));
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        logoDropdownRef.current &&
        !logoDropdownRef.current.contains(e.target)
      ) {
        setLogoDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-light bg-light px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(to left,  #f4ffc4, #b7ff00, #f4ffc4)",
        minHeight: "6.6vh",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo Mo'Money como dropdown */}
        <div className="position-relative" ref={logoDropdownRef}>
          <div
            className="navbar-brand fw-bold text-black"
            style={{ cursor: "pointer", fontSize: "2.5vh" }}
            onClick={() => setLogoDropdownOpen(!isLogoDropdownOpen)}
          >
            Mo’Money ⌄
          </div>

          {isLogoDropdownOpen && (
            <div
              className="dropdown-menu show mt-2"
              style={{ position: "absolute", top: "100%", left: 0 }}
            >
              <Link className="dropdown-item" to="/main" onClick={() => setLogoDropdownOpen(false)}>Main</Link>
              <Link className="dropdown-item" to="/objetivos" onClick={() => setLogoDropdownOpen(false)}>Añadir Objetivos</Link>
              <Link className="dropdown-item" to="/addnewgasto" onClick={() => setLogoDropdownOpen(false)}>Añadir Gastos</Link>
              <Link className="dropdown-item" to="/inversion" onClick={() => setLogoDropdownOpen(false)}>Invertir</Link>
              
            </div>
          )}
        </div>

        {/* Bienvenida con dropdown de usuario */}
        <div className="position-relative" ref={userDropdownRef}>
          <span
            style={{ color: "black", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
          >
            Bienvenid@, {username || "Usuario"} ⌄
          </span>

          {isUserDropdownOpen && (
            <div
              className="dropdown-menu dropdown-menu-end show mt-2"
              style={{ position: "absolute", right: 0, top: "100%" }}
            >
              <Link className="dropdown-item" to="/perfil" onClick={() => setUserDropdownOpen(false)}>Perfil</Link>
              <button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
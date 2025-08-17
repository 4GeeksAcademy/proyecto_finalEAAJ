import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { checkTokenExpiration, refreshTokenWithCooldown } from "../utils/token";

export const NavbarPrivate = () => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLogoDropdownOpen, setLogoDropdownOpen] = useState(false);
  const profileDropdownRef = useRef();
  const logoDropdownRef = useRef();
  const [username, setUsername] = useState("");

  useEffect(() => {
    /* const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      return;
    } */
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(import.meta.env.VITE_BACKEND_URL + "api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información del usuario");
        return res.json();
      })
      .then(data => {
        setUsername(data.user.username || "");
      })
    /* const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(
          parsedUser.username ||
          parsedUser.firstname ||
          parsedUser.lastname ||
          parsedUser.nombre ||
          parsedUser.name ||
          ""
        );
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    } */
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

    // Escuchamos cambios de actividad en la página
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // cleanup al desmontar
    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem("token");/* 
    localStorage.removeItem("username");
    localStorage.removeItem("user"); */
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-light bg-light px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(to left,  #f4ffc4, #b7ff00, #f4ffc4)",
        backgroundSize: "100%",
        transition: "0.3s linear",
        minHeight: "6.6vh",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo Mo'Money como dropdown */}
        <div className="position-relative" ref={logoDropdownRef}>
          <div
            className="navbar-brand fw-bold text-white"
            style={{ cursor: "pointer", fontSize: "2.5vh" }}
            onClick={() => setLogoDropdownOpen(!isLogoDropdownOpen)}
          >
            <img
              src="/Mo-moneyIcon2.webp"
              alt="Logo"
              style={{ width: "6vh", height: "6vh" }}
            />
            Mo’money ⌄
          </div>

          {isLogoDropdownOpen && (
            <div
              className="dropdown-menu show mt-2"
              style={{ position: "absolute", top: "100%", left: 0 }}
            >
              <Link
                className="dropdown-item"
                to="/main"
                onClick={() => setLogoDropdownOpen(false)}
              >
                Main
              </Link>
              <Link
                className="dropdown-item"
                to="/objetivos"
                onClick={() => setLogoDropdownOpen(false)}
              >
                Añadir Objetivos
              </Link>
              <Link
                className="dropdown-item"
                to="/addnewgasto"
                onClick={() => setLogoDropdownOpen(false)}
              >
                Añadir Gastos
              </Link>
              <Link
                className="dropdown-item"
                to="/inversion"
                onClick={() => setLogoDropdownOpen(false)}
              >
                Invertir
              </Link>
              <Link
                className="dropdown-item"
                to="/blog"
                onClick={() => setLogoDropdownOpen(false)}
              >
                Conoce nuestro blog
              </Link>
            </div>
          )}
        </div>

        {/* Bienvenida y perfil */}
        <div className="d-flex align-items-center gap-3">
          {/* Texto de bienvenida */}
          <span style={{ color: "black", fontWeight: "bold" }}>
            Bienvenid@, {username || "Usuario"}
          </span>

          {/* Botón de perfil con dropdown */}
          <div className="position-relative" ref={profileDropdownRef}>
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
                style={{ position: "absolute", right: 0, top: "100%" }}
              >
                <Link
                  className="dropdown-item"
                  to="/perfil"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  Perfil
                </Link>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
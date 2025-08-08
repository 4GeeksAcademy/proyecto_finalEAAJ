import { Link } from "react-router-dom";
import { useState } from "react";

export const NavbarLogoDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container-fluid d-flex justify-content-between align-items-center position-relative">
      {/* Marca + Dropdown */}
      <div className="position-relative">
        <div
          className="navbar-brand fw-bold fs-4 text-black"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          Mo’Money ⌄
        </div>

        {/* Dropdown */}
        {open && (
          <div
            className="dropdown-menu show p-2"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              backgroundColor: "white",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "6px",
              zIndex: 1000,
            }}
          >
            <Link
              to="/main"
              className="dropdown-item"
              onClick={() => setOpen(false)}
            >
              Main
            </Link>
            <Link
              to="/objetivos"
              className="dropdown-item"
              onClick={() => setOpen(false)}
            >
              Añadir Objetivos
            </Link>
            <Link
              to="/addnewgasto"
              className="dropdown-item"
              onClick={() => setOpen(false)}
            >
              Añadir Gastos
            </Link>
            <Link
              to="/inversion"
              className="dropdown-item"
              onClick={() => setOpen(false)}
            >
              Invertir
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

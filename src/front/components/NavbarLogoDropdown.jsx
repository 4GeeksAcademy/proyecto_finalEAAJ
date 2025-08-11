import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const getItemStyle = (path) => ({
    backgroundColor: location.pathname === path ? "#b7ff00" : "transparent",
    borderRadius: "4px",
    padding: "6px 10px",
    transition: "background-color 0.2s ease",
  });

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
              style={getItemStyle("/main")}
              onClick={() => setOpen(false)}
            >
              Main
            </Link>
            <Link
              to="/objetivos"
              className="dropdown-item"
              style={getItemStyle("/objetivos")}
              onClick={() => setOpen(false)}
            >
              Añadir Objetivos
            </Link>
            <Link
              to="/addnewgasto"
              className="dropdown-item"
              style={getItemStyle("/addnewgasto")}
              onClick={() => setOpen(false)}
            >
              Añadir Gastos
            </Link>
            <Link
              to="/inversion"
              className="dropdown-item"
              style={getItemStyle("/inversion")}
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
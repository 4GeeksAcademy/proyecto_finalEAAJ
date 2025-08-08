import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBitcoin, FaChartLine, FaPiggyBank } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";

import { Button } from "react-bootstrap";
import { HashLink } from "react-router-hash-link";


export const Main = () => {
  const [objetivos, setObjetivos] = useState([]);
  const [sueldo, setSueldo] = useState(0);
  const [ahorro, setAhorro] = useState(0);
  const [token, setToken] = useState("");
  const [gastos, setGastos] = useState([]);
  const [recargarGastos, setRecargarGastos] = useState(false);
  const [recargarObjetivos, setRecargarObjetivos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    setToken(savedToken);
  }, []);


  // 🔹 Obtener gastos
  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gasto`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener gastos");

        const data = await res.json();
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.gastos)
            ? data.gastos
            : [];
        setGastos(lista);
      } catch (err) {
        console.error(err);
        setGastos([]);
      }
    };

    if (token) fetchGastos();
  }, [token, recargarGastos]);

  useEffect(() => {
    const shouldReload = localStorage.getItem("recargarGastos");
    if (shouldReload === "true") {
      setRecargarGastos((prev) => !prev);
      localStorage.removeItem("recargarGastos");
    }
  }, []);

  useEffect(() => {
    const shouldReload = localStorage.getItem("recargarObjetivos");
    if (shouldReload === "true") {
      setRecargarObjetivos((prev) => !prev);
      localStorage.removeItem("recargarObjetivos");
    }
  }, []);

  // 🔹 Editar gasto
  const handleEditarGasto = (id) => {
    navigate(`/gasto/editar/${id}`);
  };

  // 🔹 Eliminar gasto
  const eliminarGasto = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este gasto?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/gasto/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar");

      setGastos((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el gasto");
    }
  };

  // 🔹 Obtener objetivos
  useEffect(() => {
    if (!token) return;

    const fetchObjetivos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/objetivo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener objetivos");

        const data = await res.json();

        const objetivosAdaptados = Array.isArray(data)
          ? data.map((o) => ({
            id: o.id,
            concepto: o.titulo,
            cantidad: o.cantidad_meta,
            fechaLimite: o.fecha_limite,
            completado: o.completado || false,
            frecuencia: o.frecuencia || "diario",
          }))
          : [];

        setObjetivos(objetivosAdaptados);
        localStorage.setItem("objetivos", JSON.stringify(objetivosAdaptados));
      } catch (err) {
        console.error("Error cargando objetivos:", err);
        setObjetivos([]);
      }
    };

    fetchObjetivos();
  }, [token, recargarObjetivos]);

  useEffect(() => {
    const disponibleGuardado = parseFloat(localStorage.getItem("disponible")) || 0;
    const sueldoNetoGuardado = parseFloat(localStorage.getItem("sueldoNeto")) || 0;
    setSueldo(disponibleGuardado + sueldoNetoGuardado);

    const ahorroGuardado = parseFloat(localStorage.getItem("ahorro")) || 0;

    setSueldo(disponibleGuardado + sueldoNetoGuardado);
    setAhorro(ahorroGuardado);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    if (!savedToken || savedToken.length < 10) {
      navigate("/");
    }
  }, [navigate]);



  const handleProfileUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/user/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSueldo(data.sueldo);
      } else {
        navigate(`/`);
      }
    } catch (error) {
      navigate(`/`);
    }
  };

  const handleGasto = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/gasto",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      const data = await res.json();
      if (res.ok) {

        setResetLoading(false);
      } else {
        setResetLoading(false);
      }
    } catch (error) {
      setResetLoading(false);
    }
  };

  const handleObjetivo = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/objetivo",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      const data = await res.json();
      if (res.ok) {

        setResetLoading(false);
      } else {
        setResetLoading(false);
      }
    } catch (error) {
      setResetLoading(false);
    }
  };



  const calcularAhorroSegunFrecuencia = (cantidad, fechaLimite, frecuencia) => {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diffTiempo = limite - hoy;

    const dias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
    const meses = Math.ceil(dias / 30);
    const años = Math.ceil(dias / 365);

    if (frecuencia === "diario") return dias > 0 ? (cantidad / dias).toFixed(2) : cantidad;
    if (frecuencia === "mensual") return meses > 0 ? (cantidad / meses).toFixed(2) : cantidad;
    if (frecuencia === "anual") return años > 0 ? (cantidad / años).toFixed(2) : cantidad;
    return cantidad;
  };

  const totalGastos = Array.isArray(gastos)
    ? gastos.reduce((acc, g) => acc + Number(g.cantidad || 0), 0)
    : 0;

  const dineroDisponible = sueldo - totalGastos;




  const handleEditarObjetivo = (id) => {
    navigate(`/objetivos/editar/${id}`);
  };

  const eliminarObjetivo = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este objetivo?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/objetivo/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar");

      setObjetivos((prev) => prev.filter((obj) => obj.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el objetivo");
    }
  };

  const marcarComoCompletado = async (id, completado) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/objetivo/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ completado: !completado }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar");

      setObjetivos((prev) =>
        prev.map((obj) =>
          obj.id === id ? { ...obj, completado: !completado } : obj
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el objetivo");
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "white" }}>

      {/* RESUMEN DINERO */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-center p-3" style={{
            backgroundColor: dineroDisponible < ahorro ? "#f8663b" : "#b7ff00",
            border: "none",
            color: dineroDisponible < ahorro ? "white" : "black",
            transition: "background-color 0.3s ease",
          }}>
            <h5>Dinero Total</h5>
            <p className="display-6">{dineroDisponible}€</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-center p-3" style={{ backgroundColor: "#b7ff00", border: "none" }}>
            <h5>Se debería ahorrar</h5>
            <p className="display-6">{ahorro}€</p>
          </div>
        </div>
      </div>

      {/* LISTA DE OBJETIVOS */}
      <div className="container mt-4">
        <div className="text-center mt-3">
          <h3>Lista de Objetivos</h3>

          {objetivos.length === 0 && <p>No hay objetivos aún.</p>}

          <div className="d-flex flex-wrap gap-5 justify-content-center mt-3">
            {objetivos.map((obj) => (
              <div
                key={obj.id}
                style={{
                  position: "relative",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  border: "3px solid #7bff00",
                  backgroundColor: obj.completado ? "#7bff00" : "#ffffff",
                  color: obj.completado ? "#000000" : "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  padding: "5px",
                }}
              >
                <strong>{obj.concepto}</strong>
                <strong><small>{obj.cantidad}€</small></strong>
                <small>{calcularAhorroSegunFrecuencia(obj.cantidad, obj.fechaLimite, obj.frecuencia)} € / {obj.frecuencia}</small>

                <button
                  onClick={() => handleEditarObjetivo(obj.id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    background: "white",
                    border: "none",
                    color: "#7bff00",
                    fontSize: "18px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "background 0.2s ease",
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => eliminarObjetivo(obj.id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "white", 
                    border: "none",
                    color: "#ff0000",     
                    fontSize: "20px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    borderRadius: "50%",  
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "background 0.2s ease",
                  }}
                >
                  ❌
                </button>
                <button
                  onClick={() => marcarComoCompletado(obj.id, obj.completado)}
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "limegreen",
                  }}
                >
                  ✅
                </button>
              </div>
            ))}
          </div>
        </div>


        <div className="text-center mt-4">
          <Link to="/objetivos">
            <button className="btn " style={{ backgroundColor: "#b7ff00", color: "black" }}>+ Crear objetivo</button>
          </Link>
        </div>
      </div>

      {/* PANEL DE GASTOS */}
      <div className="container mt-5">
        <div className="text-center">
          <h3>Lista de Gastos</h3>

          {Array.isArray(gastos) && gastos.length > 0 ? (
            <div className="d-flex flex-wrap gap-5 justify-content-center mt-3">
              {gastos.map((gasto) => (
                <div
                  key={gasto.id}
                  className="card p-3 shadow"
                  style={{ width: "260px", backgroundColor: "white", borderColor: "#b7ff00", position: "relative" }}
                >
                  <h5 className="mb-2">
                    {gasto.concepto} {gasto.emoji || ""}
                  </h5>
                  <p className="fw-bold">{gasto.cantidad} €</p>

                  <button
                    onClick={() => handleEditarGasto(gasto.id)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "5px",
                      background: "transparent",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => eliminarGasto(gasto.id)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "transparent",
                      border: "none",
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay gastos aún.</p>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to="/addnewgasto">
            <button className="btn " style={{ backgroundColor: "#b7ff00", color: "black" }}>➕ Añadir gasto</button>
          </Link>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
        <h3>Lista de ahorro</h3>
        {/* Fila superior: Bitcoin a la izquierda, Acciones a la derecha */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "26rem",
          alignItems: "center",
          marginTop: "2rem"
        }}>
          <div style={{ textAlign: "center" }}>
            <HashLink to="/inversion#bitcoin" style={{ fontSize: "7.5rem", color: "#b7ff00", textDecoration: "none" }}>
              <FaBitcoin />
              <div style={{ marginTop: "0.5rem", color: "black", fontWeight: "bold", fontSize: "1.5rem" }}>
                Criptomonedas
              </div>
            </HashLink>
          </div>

          {/* Fondos */}
          <div style={{ textAlign: "center" }}>
            <HashLink to="/inversion#fondos" style={{ fontSize: "7.5rem", color: "#b7ff00", textDecoration: "none" }}>
              <FaChartLine />
              <div style={{ marginTop: "0.5rem", color: "black", fontWeight: "bold", fontSize: "1.5rem" }}>
                Fondos
              </div>
            </HashLink>
          </div>

          {/* Acciones */}
          <div style={{ textAlign: "center" }}>
            <HashLink to="/inversion#acciones" style={{ fontSize: "7.5rem", color: "#b7ff00", textDecoration: "none" }}>
              <FaPiggyBank />
              <div style={{ marginTop: "0.5rem", color: "black", fontWeight: "bold", fontSize: "1.5rem" }}>
                Acciones
              </div>
            </HashLink>
          </div>

        </div>
      </div>

    </div>
  );
}
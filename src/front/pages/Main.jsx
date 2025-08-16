import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBitcoin, FaChartLine, FaPiggyBank } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import OnboardingTutorial from "./OnboardingTutorial";
//import { motion, AnimatePresence } from "framer-motion";

export const Main = () => {
  const [sueldo, setSueldo] = useState(0);
  const [ahorro, setAhorro] = useState(0);
  const [token, setToken] = useState("");
  const [gastos, setGastos] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [recargarGastos, setRecargarGastos] = useState(false);
  const [recargarObjetivos, setRecargarObjetivos] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [dineroDisponible, setDineroDisponible] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
    if (!token) return;

    const userProfile=()=>{fetch(import.meta.env.VITE_BACKEND_URL + "api/user/profile", {
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
        setSueldo(data.user.sueldo);
        setAhorro((parseFloat(sueldo) * 0.2).toFixed(2));
        const isNewUser = data.user.isNewUser;
        if (isNewUser) {
          setShowTutorial(true);
          fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/update", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isNewUser: false,
            }),
          })
            .then(res => {
              if (!res.ok) throw new Error("No se pudo actualizar el perfil");
              return res.json();
            })
            .catch(err => console.error("Error al actualizar el perfil:", err));
              }
            })
            .catch(err => console.error("Error al cargar el perfil:", err));}  
      if (token) userProfile();
  }, [token, sueldo, ahorro]);

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
        //localStorage.setItem("objetivos", JSON.stringify(objetivosAdaptados));
      } catch (err) {
        console.error("Error cargando objetivos:", err);
        setObjetivos([]);
      }
    };
    fetchObjetivos();
  }, [token, recargarObjetivos]);

  useEffect(() => {
    const disponibleGuardado = parseFloat(localStorage.getItem("disponible"));
    const sueldoNetoGuardado = parseFloat(localStorage.getItem("sueldoNeto"));
    setSueldo(disponibleGuardado + sueldoNetoGuardado);
    const ahorroGuardado = (parseFloat(sueldo) * 0.2).toFixed(2);
    setAhorro(ahorroGuardado);
  }, []);

//Te expulsa si ha expirado el token o no tienes token
  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    if (!savedToken || savedToken.length < 10) {
      navigate("/");
    }
  }, [navigate]);

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

  useEffect(() => {
    const totalGastos = Array.isArray(gastos)
      ? gastos.reduce((acc, g) => acc + Number(g.cantidad || 0), 0) : 0;
    setDineroDisponible(sueldo - totalGastos);
    setAhorro((parseFloat(sueldo) * 0.2).toFixed(2));//He añadido aque la recarga de el ahorro para que se recargue cada vez
  }, [gastos, sueldo]);

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completado: !completado }),
      }
    );

    if (!res.ok) throw new Error("Error al actualizar");

    setObjetivos((prev) =>
      prev.map((obj) => {
        if (obj.id === id) {
          if (!completado) {
            setShowCelebration(true); 
            setTimeout(() => setShowCelebration(false), 2000); 
          }
          return { ...obj, completado: !completado };
        }
        return obj;
      })
    );
  } catch (err) {
    console.error(err);
    alert("No se pudo actualizar el objetivo");
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarContenido(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (!mostrarContenido) {
    return null;
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "white" }}>
      {showTutorial && <OnboardingTutorial onFinish={() => setShowTutorial(false)} />}
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
        <div className="text-center mt-5">
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
          gap: "30vh",
          alignItems: "center",
          marginTop: "2rem"
        }}>
          <div style={{ textAlign: "center" }}>
            <HashLink to="/inversion#bitcoin" style={{ fontSize: "11vh", color: "#b7ff00", textDecoration: "none" }}>
              <FaBitcoin />
              <div style={{ marginTop: "0.5vh", color: "black", fontWeight: "bold", fontSize: "2.5vh" }}>
                Criptomonedas
              </div>
            </HashLink>
          </div>

          {/* Fondos */}
          <div style={{ textAlign: "center" }}>
            <HashLink to="/inversion#fondos" style={{ fontSize: "11vh", color: "#b7ff00", textDecoration: "none" }}>
              <FaChartLine />
              <div style={{ marginTop: "0.5vh", color: "black", fontWeight: "bold", fontSize: "2.5vh" }}>
                Fondos
              </div>
            </HashLink>
          </div>

          {/* Acciones */}
          <div style={{ textAlign: "center" }}>
            <HashLink to="/inversion#acciones" style={{ fontSize: "11vh", color: "#b7ff00", textDecoration: "none" }}>
              <FaPiggyBank />
              <div style={{ marginTop: "0.5vh", color: "black", fontWeight: "bold", fontSize: "2.5vh" }}>
                Acciones
              </div>
            </HashLink>
          </div>

        </div>
      </div>
      {showCelebration && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#c5bebe",
          color: "#000000ff",
          padding: "20px 30px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.99)",
          textAlign: "center",
          fontWeight: "bold",
          zIndex: 10000
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🎉 ¡Enhorabuena!</div>
          <div>¡Objetivo conseguido! Eres un rockstar de las finanzas 💰🎸</div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Main = () => {
  const [objetivos, setObjetivos] = useState([]);
  const [sueldo, setSueldo] = useState(0);
  const [ahorro, setAhorro] = useState(0);
  const [token, setToken] = useState("");
  const [gastos, setGastos] = useState([]);
  const [recargarGastos, setRecargarGastos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    setToken(savedToken);
  }, []);
  useEffect(() => {
    localStorage.setItem("recargarGastos", "true");
    navigate("/main");
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
  }, [token]);

  useEffect(() => {
    const disponibleGuardado = parseFloat(localStorage.getItem("disponible")) || 0;
    const sueldoNetoGuardado = parseFloat(localStorage.getItem("sueldoNeto")) || 0;
    setSueldo(disponibleGuardado + sueldoNetoGuardado);

    const ahorroGuardado = localStorage.getItem("ahorro");
    handleProfileUser();
    if (sueldoGuardado) setSueldo(parseFloat(sueldoGuardado));
    if (ahorroGuardado) setAhorro(parseFloat(ahorroGuardado));
  }, []);
  
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


  
  const calcularDiasRestantes = (fechaLimite) => {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diff = limite - hoy;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
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
    <div className="container-fluid p-4">
      {/* BOTÓN PERFIL */}
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "18px",
          }}
        >
          Perfil
        </button>
      </div>

      {/* RESUMEN DINERO */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-center p-3" style={{
            backgroundColor: dineroDisponible < ahorro ? "#ff4c4c" : "#b7ff00", // rojo si dineroDisponible < ahorro, verde si no
            border: "none",
            color: dineroDisponible < ahorro ? "white" : "black", // letras blancas si rojo, negras si verde
            transition: "background-color 0.3s ease", // transición suave
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

          <div className="d-flex flex-wrap gap-3 justify-content-center mt-3">
            {objetivos.map((obj) => (
              <div
                key={obj.id}
                style={{
                  position: "relative",
                  width: "120px",
                  height: "120px",
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
                <small>{obj.concepto}</small>
                <strong>{obj.cantidad}€</strong>
                <small>{calcularDiasRestantes(obj.fechaLimite)} días</small>

                <button
                  onClick={() => handleEditarObjetivo(obj.id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: "18px",
                    cursor: "pointer",
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
                    background: "transparent",
                    border: "none",
                    color: "red",
                    fontSize: "20px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✖️
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
            <div className="d-flex flex-wrap gap-3 justify-content-center mt-3">
              {gastos.map((gasto) => (
                <div
                  key={gasto.id}
                  className="card p-3 shadow"
                  style={{ width: "220px", backgroundColor: "#f8f9fa", position: "relative" }}
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
    </div>
  );
}
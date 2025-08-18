import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Sphere from "./Sphere.jsx";
import {Icosahedron}  from "../components/Icosahedron";
import Carrusel from "./Carrusel/Carrusel.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl)
        throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const cleanBackendUrl = backendUrl.replace(/\/$/, "");
const response = await fetch(cleanBackendUrl + "/api/hello"); 
      const data = await response.json();

      if (response.ok) dispatch({ type: "set_hello", payload: data.message });

      return data;
    } catch (error) {
      if (error.message)
        throw new Error(
          `Could not fetch the message from the backend.
          Please check if the backend is running and the backend port is public.`
        );
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
 <div className="page" style={{
  
  marginTop: '80px',
  marginBottom: 0 }}>
  {/* SECCIÓN CENTRAL: Quiénes somos + Esfera + Qué hacemos */}
  <section className="container my-5">
    <div className="row align-items-center text-center text-md-center justify-content-center">
      {/* QUIÉNES SOMOS */}
      <div className="col-md-4 mb-4 mb-md-0">
        <h2 className="mb-3">¿Quiénes somos?</h2>
        <p className="lead">
          Somos un equipo joven comprometido con ayudar a otros jóvenes a gestionar su dinero,
          ahorrar, invertir y alcanzar sus metas financieras con herramientas digitales sencillas.
        </p>
      </div>

      {/* ESFERA */}
      <div className="col-md-4 d-flex justify-content-center mb-4 mb-md-0">
        <div style={{marginLeft:"-0.1vh"}}>
        <Sphere />
        </div>
        <div style={{marginLeft:"-31.5vh", marginTop:"4vh"}}>
        <Icosahedron />
        </div>
      </div>

      {/* QUÉ HACEMOS */}
      <div className="col-md-4">
        <h2 className="mb-3">¿Qué hacemos?</h2>
        <p className="lead">
          Ofrecemos una plataforma con funciones para planificar tus gastos, visualizar tu ahorro,
          explorar oportunidades de inversión y conectarte con una comunidad de jóvenes como tú.
        </p>
      </div>
    </div>
  </section>

  {/* SECCIÓN INVERSIÓN */}
  <section className="text-center  p-5  mt-5 mx-auto" style={{ maxWidth: '900px',paddingBottom: 0 }}>
    <h2 className="mb-3">Inversión</h2>
    <p className="lead">
      Descubre cómo hacer que tu dinero trabaje por ti con nuestro <strong>simulador interactivo</strong>, consejos adaptados a jóvenes y explicaciones sin tecnicismos
    </p>
    <Link to="/inversion" className="btn" style={{ backgroundColor: "#7bff00" }}>
      ¡Quiero que mi dinero crezca!
    </Link>
  </section>
  <div className="col-12 d-flex justify-content-center " >
            <Carrusel />
      </div>
</div>

  );
};






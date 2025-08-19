import React, { useState } from "react";
import { FaArrowRight, FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const tutorialSteps = [
  {
    title: "Bienvenido a tu panel",
    description: "Aquí puedes ver un resumen de tu dinero, objetivos, gastos e inversiones.",
    emoji: "👋"
  },
  {
    title: "Dinero Total y Ahorro",
    description: "En la parte superior ves cuánto dinero disponible tienes y cuánto deberías ahorrar.",
    emoji: "💰"
  },
  {
    title: "Lista de Objetivos",
    description: "Aquí defines tus metas de ahorro, su cantidad y el tiempo para cumplirlas.",
    emoji: "🎯"
  },
  {
    title: "Gastos",
    description: "En esta sección puedes registrar, editar o eliminar tus gastos.",
    emoji: "💸"
  },
  {
    title: "Opciones de Inversión",
    description: "Explora criptomonedas, fondos y acciones para hacer crecer tus ahorros.",
    emoji: "📈"
  },
  {
    title: "¡Listo!",
    description: "Ahora ya sabes cómo funciona tu panel. ¡Empieza a gestionar tu dinero!",
    emoji: "🚀"
  },
];

export default function OnboardingTutorial({ onFinish }) {
  const [step, setStep] = useState(0);
  const { title, description, emoji } = tutorialSteps[step];

  const nextStep = () => {
    if (step + 1 < tutorialSteps.length) {
      setStep(step + 1);
    } else {
      localStorage.setItem("hasSeenMainTutorial", "true");
      onFinish();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(245, 245, 245, 0.95)", 
        backdropFilter: "blur(4px)", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        color: "#333",
        padding: "20px",
      }}
    >
      <div style={{
        position: "relative",
        maxWidth: "500px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        textAlign: "center",
        border: "1px solid rgba(0,0,0,0.1)"
      }}>
        {/* Botón de cerrar */}
        <button
          onClick={() => {
            localStorage.setItem("hasSeenMainTutorial", "true");
            onFinish();
          }}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "transparent",
            border: "none",
            color: "#666",
            fontSize: "20px",
            cursor: "pointer",
            transition: "color 0.2s ease",
            ":hover": {
              color: "#b7ff00"
            }
          }}
        >
          <FaTimes />
        </button>

        {/* Contenido animado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "20px",
              color: "#b7ff00" 
            }}>
              {emoji}
            </div>
            <h2 style={{ 
              color: "#222",
              marginBottom: "15px",
              fontSize: "1.8rem",
              fontWeight: "600"
            }}>
              {title}
            </h2>
            <p style={{ 
              fontSize: "1.1rem",
              lineHeight: "1.6",
              marginBottom: "30px",
              color: "#555"
            }}>
              {description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores de progreso */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "25px"
        }}>
          {tutorialSteps.map((_, i) => (
            <div
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: i === step ? "#b7ff00" : "#ddd",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>

        {/* Controles de navegación */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px"
        }}>
          {step > 0 && (
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                color: "#666",
                border: "1px solid #ddd",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                ":hover": {
                  borderColor: "#b7ff00",
                  color: "#b7ff00"
                }
              }}
            >
              <FaArrowLeft /> Anterior
            </button>
          )}

          <button
            onClick={nextStep}
            style={{
              flex: 1,
              backgroundColor: "#b7ff00",
              color: "#000",
              padding: "12px 24px",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              ":hover": {
                backgroundColor: "#a5e600",
                transform: "translateY(-2px)"
              }
            }}
          >
            {step + 1 === tutorialSteps.length ? (
              "¡Entendido!"
            ) : (
              <>
                Siguiente <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

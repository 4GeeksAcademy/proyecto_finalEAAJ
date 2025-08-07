

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export  const Footer =()=> {
  const frases = [




    "Ahorra hoy para invertir mañana 💰",
    "La constancia vence al interés compuesto 📈",
    "Invierte en conocimiento antes que en activos 📚",
    "Cada euro cuenta, cada decisión importa 💡"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const variants = {
    initial: { y: 40, opacity: 0 }, 
    animate: { y: 0, opacity: 1 },   
    exit: { y: -40, opacity: 0 }     
  };

  return (
    <footer
      className="w-full p-4 text-center overflow-hidden"
      style={{
        backgroundColor: "#b7ff00",
        color: "black",
        borderTop: "2px solid #b7ff00",
        height: "60px" // fija altura para evitar saltos
      }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="text-lg font-medium absolute left-1/2 -translate-x-1/2"
        >
          {frases[index]}
        </motion.p>
      </AnimatePresence>
    </footer>
  );
}
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = ({ threshold = 300 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "20px",
          backgroundColor: "#4e73df",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ScrollToTopButton;

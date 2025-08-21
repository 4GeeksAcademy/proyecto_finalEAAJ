import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ParallaxScroll.css';

gsap.registerPlugin(ScrollTrigger);

/* const Navbar = () => {
  const [isLogoDropdownOpen, setLogoDropdownOpen] = useState(false);
  const logoDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (logoDropdownRef.current && !logoDropdownRef.current.contains(e.target)) {
        setLogoDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-light bg-light px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(to left, #f4ffc4, #b7ff00, #f4ffc4)",
        backgroundSize: "100%",
        transition: "0.3s linear",
        minHeight: "6.6vh",
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
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
            Mo'money ⌄
          </div>

          {isLogoDropdownOpen && (
            <div
              className="dropdown-menu show mt-2"
              style={{ position: "absolute", top: "100%", left: 0 }}
            >
              <Link className="dropdown-item" to="/main" onClick={() => setLogoDropdownOpen(false)}>
                Main
              </Link>
              <Link className="dropdown-item" to="/objetivos" onClick={() => setLogoDropdownOpen(false)}>
                Añadir Objetivos
              </Link>
              <Link className="dropdown-item" to="/addnewgasto" onClick={() => setLogoDropdownOpen(false)}>
                Añadir Gastos
              </Link>
              <Link className="dropdown-item" to="/inversion" onClick={() => setLogoDropdownOpen(false)}>
                Invertir
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}; */

const ParallaxScroll = ({ posts = [], onPostSelect, onAddNewPostClick }) => {
  const containerRef = useRef(null);

  // Animación de entrada para las tarjetas (modificado)
  useEffect(() => {
    const cards = gsap.utils.toArray(".post-card");
    
    cards.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
          // Añadido para evitar que desaparezcan
          onLeaveBack: () => gsap.to(card, { opacity: 1, y: 0 }),
          onEnterBack: () => gsap.to(card, { opacity: 1, y: 0 })
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [posts]);

  return (
    <div 
      ref={containerRef}
      className="parallax-scroll-container"
      style={{
        paddingTop: '7vh',
        backgroundColor: '#f8f8f5',
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '80px' // Espacio para el botón y footer
      }}
    >
      {/* <Navbar /> */}

      <div 
        className="posts-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
          padding: '40px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {posts.map((post, index) => (
          <div
            key={index}
            className="post-card"
            onClick={() => onPostSelect(index)}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              opacity: 0, // Inicialmente invisible para la animación
              transform: 'translateY(20px)' // Posición inicial para la animación
            }}
          >
            <div style={{ overflow: 'hidden', height: '200px' }}>
              <img 
                src={post.image || 'https://placehold.co/600x400'} 
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
              />
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ 
                margin: '0 0 10px 0',
                color: '#333',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                {post.title || "Sin título"}
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                margin: '0'
              }}>
                {post.createdOn || "Fecha desconocida"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pestaña para añadir nuevo post (ahora no es fixed) */}
      <div
        className="add-post-tab"
        onClick={onAddNewPostClick}
        style={{
          position: 'relative',
          backgroundColor: '#004d00',
          color: 'white',
          padding: '12px 40px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
          zIndex: 100,
          transition: 'all 0.2s ease',
          width: 'max-content',
          margin: '40px auto',
          textAlign: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#006600';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#004d00';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        + Añadir nuevo post
      </div>
    </div>
  );
};

export default ParallaxScroll;
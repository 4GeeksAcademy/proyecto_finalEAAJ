import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ParallaxScroll.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Navbar = ({ onAddNewPostClick }) => {
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
        {/* Logo Mo'Money dropdown */}
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

        {/* Botón + Añadir Posts verde oscuro (solo símbolo +) */}
        <button
          onClick={onAddNewPostClick}
          className="btn"
          style={{
            backgroundColor: '#004d00',
            color: 'white',
            fontWeight: '700',
            fontSize: '1.8vh',
            padding: '0.3rem 0.7rem',
            borderRadius: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            width: '2.8rem',
            height: '2.8rem',
            lineHeight: 1
          }}
          aria-label="Añadir Posts"
        >
          <span style={{ fontSize: '1.8rem', lineHeight: 1, userSelect: 'none' }}>+</span>
        </button>
      </div>
    </nav>
  );
};

const Footer = () => {
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
        background: "linear-gradient(to left, #f4ffc4, #b7ff00, #f4ffc4)",
        color: "black",
        borderTop: "2px solid #b7ff00",
        height: "80px",
        paddingTop: "4px",
        paddingBottom: "4px",
        position: 'relative'
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
};

const ParallaxScroll = ({ posts = [], onPostSelect, loadMorePosts, onAddNewPostClick }) => {
  const imgGroupRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorCircleRef = useRef(null);
  const loadMoreRef = useRef(null);

  const [activeSection, setActiveSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedPosts, setLoadedPosts] = useState(posts);

  const [useLoadMoreButton, setUseLoadMoreButton] = useState(true);

  const initPosts = useCallback(() => {
    if (!imgGroupRef.current || loadedPosts.length === 0) return;

    imgGroupRef.current.innerHTML = '';

    const postsPerSection = Math.max(3, Math.floor(loadedPosts.length / 3));

    loadedPosts.forEach((post, i) => {
      const box = document.createElement('div');
      box.className = 'imgBox';
      box.dataset.index = i;
      box.dataset.section = Math.floor(i / postsPerSection);
      box.style.position = "relative";

      const img = document.createElement('img');
      img.src = post.image || 'https://placehold.co/600x400';
      img.alt = `${post.title} - ${post.body?.join(' ').substring(0, 50)}...`;

      const overlay = document.createElement('div');
      overlay.style.position = "absolute";
      overlay.style.bottom = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.background = "rgba(0, 0, 0, 0.6)";
      overlay.style.color = "white";
      overlay.style.padding = "10px";
      overlay.style.fontSize = "0.9rem";
      overlay.innerHTML = `<strong>${post.title || "Sin título"}</strong><br/><small>${post.date || "Fecha desconocida"}</small>`;

      box.appendChild(img);
      box.appendChild(overlay);
      imgGroupRef.current.appendChild(box);

      gsap.set(box, { opacity: 0, scale: 0.95, y: 30 });

      ScrollTrigger.create({
        trigger: box,
        start: "top 80%",
        onEnter: () => {
          gsap.to(box, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)',
            onComplete: () => box.classList.add('active')
          });
        }
      });

      box.addEventListener('mouseenter', () => {
        gsap.to(cursorCircleRef.current, { attr: { r: 30, 'stroke-width': 4 }, duration: 0.2 });
        gsap.to(box, { scale: 1.05, zIndex: 30, duration: 0.3 });
      });

      box.addEventListener('mouseleave', () => {
        gsap.to(box, { scale: 1, zIndex: 0, duration: 0.3 });
      });

      box.addEventListener('click', () => onPostSelect(i));
    });

    const sectionElements = document.querySelectorAll('[data-section]');
    const sectionPositions = Array.from(new Set(Array.from(sectionElements).map(el => el.dataset.section)));

    sectionPositions.forEach((section, index) => {
      const firstInSection = document.querySelector(`[data-section="${section}"]`);

      ScrollTrigger.create({
        trigger: firstInSection,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index)
      });
    });

  }, [loadedPosts, onPostSelect]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !loadMorePosts) return;
    setIsLoading(true);
    const newPosts = await loadMorePosts();
    setLoadedPosts((prev) => [...prev, ...newPosts]);
    setIsLoading(false);
  }, [isLoading, loadMorePosts]);

  useEffect(() => {
    if (useLoadMoreButton) return;

    if (loadMoreRef.current && loadMorePosts) {
      const st = ScrollTrigger.create({
        trigger: loadMoreRef.current,
        start: "top 80%",
        onEnter: () => handleLoadMore()
      });

      return () => st.kill();
    }
  }, [useLoadMoreButton, loadMorePosts, handleLoadMore]);

  useEffect(() => {
    if (ScrollTrigger.isTouch === 1) return;

    const handleMouseMove = (e) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 15;

      gsap.to('.imgBox', {
        rotationX: yPos * 0.3,
        rotationY: -xPos * 0.3,
        duration: 1.5,
        ease: 'power1.out',
        transformPerspective: 1000
      });

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    initPosts();
  }, [initPosts]);

  return (
    <div
      className="parallax-scroll-container"
      style={{ paddingTop: '7vh', backgroundColor: '#f8f8f5', minHeight: '100vh' }}
    >
      <Navbar onAddNewPostClick={onAddNewPostClick} />

      <div
        className="imgGroup"
        ref={imgGroupRef}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'center',
          padding: '40px'
        }}
      />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <label style={{ fontSize: '1rem', marginRight: '10px', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={useLoadMoreButton}
            onChange={() => setUseLoadMoreButton(!useLoadMoreButton)}
          />
          {' '}Usar botón para cargar más (Opción 2)
        </label>
      </div>

      {useLoadMoreButton && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            style={{
              backgroundColor: '#004d00',
              color: 'white',
              padding: '0.6rem 1.2rem',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Cargando...' : 'Cargar más posts'}
          </button>
        </div>
      )}

      {!useLoadMoreButton && (
        <div ref={loadMoreRef} style={{ textAlign: 'center', padding: '1rem' }}>
          {isLoading ? 'Cargando más posts...' : ''}
        </div>
      )}

      <svg
        ref={cursorRef}
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}
        width="60"
        height="60"
        viewBox="0 0 60 60"
      >
        <circle
          ref={cursorCircleRef}
          cx="30"
          cy="30"
          r="20"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <Footer />
    </div>
  );
};

export default ParallaxScroll;

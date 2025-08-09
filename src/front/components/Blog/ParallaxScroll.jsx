import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import './ParallaxScroll.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

const ParallaxScroll = ({ posts = [], onPostSelect }) => {
  const appRef = useRef(null);
  const imgGroupRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorCircleRef = useRef(null);
  const cursorCloseRef = useRef(null);
  const detailRef = useRef(null);
  const detailImgRef = useRef(null);
  const detailTxtRef = useRef(null);
  const sidebarRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  // Configuración inicial de los posts
  const initPosts = useCallback(() => {
    if (!imgGroupRef.current || posts.length === 0) return;

    imgGroupRef.current.innerHTML = '';

    // Calculamos el número de columnas basado en el ancho disponible
    const cardWidth = 280;
    const containerWidth = imgGroupRef.current.offsetWidth;
    const gap = 40;
    const cols = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));

    // Creamos secciones para el scroll
    const sections = [];
    const postsPerSection = Math.max(3, Math.floor(posts.length / 3));

    posts.forEach((post, i) => {
      const box = document.createElement('div');
      box.className = 'imgBox';
      box.dataset.index = i;
      box.dataset.section = Math.floor(i / postsPerSection);
      
      const img = document.createElement('img');
      img.src = post.image || 'https://placehold.co/600x400';
      img.alt = `${post.title} - ${post.body?.join(' ').substring(0, 50)}...`;
      
      box.appendChild(img);
      imgGroupRef.current.appendChild(box);

      // Estado inicial para animación
      gsap.set(box, {
        opacity: 0,
        scale: 0.95,
        y: 30
      });

      // Animación de entrada
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

      // Eventos de interacción
      box.addEventListener('mouseenter', () => {
        gsap.to(cursorCircleRef.current, { attr: { r: 30, 'stroke-width': 4 }, duration: 0.2 });
        gsap.to(box, { scale: 1.05, z: 30, duration: 0.3 });
      });

      box.addEventListener('mouseleave', () => {
        gsap.to(box, { scale: 1, z: 0, duration: 0.3 });
      });

      box.addEventListener('click', () => onPostSelect(i));
    });

    // Configurar secciones para el scroll
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
  }, [posts, onPostSelect]);

  // Efecto parallax
  const setupParallax = useCallback(() => {
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

      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll suave a sección
  const scrollToSection = useCallback((index) => {
    const sections = document.querySelectorAll('[data-section]');
    const sectionPositions = Array.from(new Set(Array.from(sections).map(el => el.dataset.section)));
    
    if (index >= 0 && index < sectionPositions.length) {
      const firstInSection = document.querySelector(`[data-section="${sectionPositions[index]}"]`);
      
      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: firstInSection,
          offsetY: 100
        },
        ease: 'power2.inOut'
      });
    }
  }, []);

  // Mostrar/ocultar detalle
  const showDetail = useCallback((img) => {
    const tl = gsap.timeline();
    tl.set(detailTxtRef.current, { textContent: img.alt })
      .set(detailImgRef.current, { background: `url(${img.src}) center/contain no-repeat` })
      .fromTo(detailRef.current, { y: '100%' }, { y: '0%', ease: 'expo.inOut' })
      .to(cursorCircleRef.current, { opacity: 0 }, 0.2)
      .to(cursorCloseRef.current, { opacity: 1 }, 0.4);
  }, []);

  const closeDetail = useCallback(() => {
    gsap.timeline()
      .to(detailRef.current, { y: '100%', ease: 'expo.in', duration: 0.3 })
      .to(cursorCloseRef.current, { opacity: 0 }, 0)
      .to(cursorCircleRef.current, { opacity: 1 }, 0.1);
  }, []);

  useEffect(() => {
    gsap.set(appRef.current, { opacity: 1 });
    initPosts();
    const cleanupParallax = setupParallax();

    if (detailRef.current) {
      detailRef.current.addEventListener('click', closeDetail);
    }

    return () => {
      cleanupParallax?.();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (detailRef.current) {
        detailRef.current.removeEventListener('click', closeDetail);
      }
    };
  }, [initPosts, setupParallax, closeDetail]);

  return (
    <>
      <div className="parallax-container">
        {/* Barra lateral de navegación */}
        <div className="sidebar" ref={sidebarRef}>
          <div className="sidebar-content">
            {[...Array(Math.ceil(posts.length / 3)).keys()].map((i) => (
              <button
                key={i}
                className={`sidebar-item ${activeSection === i ? 'active' : ''}`}
                onClick={() => scrollToSection(i)}
              >
                <span className="sidebar-dot"></span>
                <span className="sidebar-label">Sección {i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div id="app" ref={appRef}>
          <div id="imgGroup" ref={imgGroupRef} />
          
          <div id="detail" ref={detailRef}>
            <div id="detailImg" ref={detailImgRef} />
            <div id="detailTxt" ref={detailTxtRef} />
          </div>

          <svg className="cursor" ref={cursorRef}>
            <circle ref={cursorCircleRef} cx="0" cy="0" r="12" stroke="#fff" strokeWidth="3" fill="none" />
            <path ref={cursorCloseRef} d="M-25,-25 L25,25 M-25,25 L25,-25" stroke="#fff" strokeWidth="3.5" opacity="0" />
          </svg>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ParallaxScroll;
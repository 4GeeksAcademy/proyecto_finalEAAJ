import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ParallaxScroll.css';

gsap.registerPlugin(ScrollTrigger);

const ParallaxScroll = ({ posts = [], onPostSelect }) => {
  const containerRef = useRef(null);

  // Animación de entrada para las tarjetas
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
        paddingBottom: '80px'
      }}
    >
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
              opacity: 0,
              transform: 'translateY(20px)'
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
    </div>
  );
};

export default ParallaxScroll;

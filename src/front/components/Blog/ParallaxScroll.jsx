import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './ParallaxScroll.css';
import './Blog.css';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, ScrollToPlugin);

const ParallaxScroll = ({ posts, onPostSelect }) => {
  const appRef = useRef(null);
  const scrollDistRef = useRef(null);
  const imgGroupRef = useRef(null);
  const headlinesRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorCircleRef = useRef(null);
  const cursorCloseRef = useRef(null);
  const detailRef = useRef(null);
  const detailImgRef = useRef(null);
  const detailTxtRef = useRef(null);

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, ScrollToPlugin);

    gsap.set(appRef.current, { opacity: 1 });

    const initEffect = () => {
      gsap.set(scrollDistRef.current, {
        width: "100%",
        height: gsap.getProperty(appRef.current, "height"),
        onComplete: () => {
          gsap.set([appRef.current, imgGroupRef.current], {
            opacity: 1,
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            perspective: 300
          });

          // Configuración inicial de los posts
          posts.forEach((post, i) => {
            const element = document.getElementById(`post-${i}`);
            if (element) {
              gsap.set(element, {
                opacity: 0,
                y: 100,
                scale: 0.8
              });
            }
          });

          const images = imgGroupRef.current.querySelectorAll('img');
          images.forEach((img, i) => {
            initPost(img, i);
          });

          setupMainAnimation();
        }
      });
    };

    const initPost = (img, i) => {
      const box = document.createElement("div");
      box.id = `post-${i}`;
      box.className = "imgBox";
      box.appendChild(img);
      imgGroupRef.current.appendChild(box);
      
      gsap.set(box, {
        pointerEvents: "none",
        position: "absolute",
        width: 300,
        height: 400,
        overflow: "hidden",
        top: "50%",
        left: "50%",
        x: getRandomPosition(-300, 300),
        y: getRandomPosition(-200, 200),
        xPercent: -50,
        yPercent: -50,
        perspective: 500
      });

      box.onmouseover = () => gsap.to(cursorCircleRef.current, {
        duration: 0.2,
        attr: { r: 30, "stroke-width": 4 }
      });

      box.onclick = () => {
        onPostSelect(i);
        showDetail(img);
      };
    };

    const getRandomPosition = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const setupMainAnimation = () => {
      // ✅ Animación por lotes con ScrollTrigger.batch
      ScrollTrigger.batch(".imgBox", {
        interval: 0.1,
        batchMax: 1,
        onEnter: batch => gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out"
        }),
        start: "top 90%"
      });

      // 🌀 Animación de entrada inicial
      gsap.from(window, {
        duration: 1.5,
        scrollTo: gsap.getProperty(scrollDistRef.current, "height") / 3,
        ease: "power2.in"
      });
    };

    const showDetail = (img) => {
      gsap
        .timeline()
        .set(detailTxtRef.current, { textContent: img.alt }, 0)
        .set(detailImgRef.current, { background: `url(${img.src}) center/contain no-repeat` }, 0)
        .fromTo(detailRef.current, { top: "100%" }, { top: 0, ease: "expo.inOut" }, 0)
        .to(cursorCircleRef.current, { duration: 0.2, opacity: 0 }, 0.2)
        .to(cursorCloseRef.current, { duration: 0.2, opacity: 1 }, 0.4);
    };

    const closeDetail = () => {
      gsap
        .timeline()
        .to(detailRef.current, { top: "100%", ease: "expo.in", duration: 0.3 })
        .to(cursorCloseRef.current, { opacity: 0 }, 0)
        .to(cursorCircleRef.current, { opacity: 1 }, 0.1);
    };

    initEffect();

    if (detailRef.current) {
      detailRef.current.onclick = closeDetail;
    }

    if (ScrollTrigger.isTouch !== 1) {
      let cursorX = gsap.quickTo(cursorRef.current, "x", { duration: 0.3, ease: "power2" });
      let cursorY = gsap.quickTo(cursorRef.current, "y", { duration: 0.3, ease: "power2" });

      const handleMouseMove = (e) => {
        gsap.to(".imgBox", {
          xPercent: (-e.clientX / window.innerWidth) * 100,
          yPercent: -25 - (e.clientY / window.innerHeight) * 50,
          rotateX: 8 - (e.clientY / window.innerHeight) * 16,
          rotateY: -8 + (e.clientX / window.innerWidth) * 16
        });

        cursorX(e.clientX);
        cursorY(e.clientY);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

  }, [posts, onPostSelect]);

  return (
    <>
      <div id="scrollDist" ref={scrollDistRef}></div>

      {/* ✅ Scroll "falso" para activar los triggers */}
      <div id="scrollSpacer">
        {posts.map((_, i) => (
          <div key={i} className="spacer-block"></div>
        ))}
      </div>

      <div id="app" ref={appRef}>
        <svg id="headlines" ref={headlinesRef} fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 586 150">
          <g id="txt1">
            <path d="M40.2,16.9c-5,0-9.1,1-12.3,3.1S23,25.1,23,29.3c0,4.1,1.6,7.3,4.8,9.5s10,4.6,20.5,7.1 c10.5,2.5,18.3,6.1,23.7,10.7c5.3,4.6,8,11.3,8,20.2c0,8.9-3.4,16.1-10.1,21.7c-6.7,5.5-15.5,8.3-26.4,8.3 c-16,0-30.1-5.5-42.5-16.5l10.8-13c10.3,9,21,13.4,32.1,13.4c5.5,0,10-1.2,13.2-3.6c3.3-2.4,4.9-5.5,4.9-9.5s-1.5-7-4.6-9.2 s-8.3-4.2-15.8-6c-7.5-1.8-13.2-3.5-17.1-5c-3.9-1.5-7.4-3.5-10.4-5.9c-6-4.6-9.1-11.6-9.1-21c0-9.4,3.4-16.7,10.3-21.8 C22.2,3.6,30.7,1,40.9,1c6.5,0,13,1.1,19.4,3.2c6.4,2.1,12,5.2,16.6,9.1l-9.2,13c-3-2.7-7.1-5-12.3-6.7 C50.3,17.8,45.2,16.9,40.2,16.9z" />
          </g>
        </svg>

        <div id="imgGroup" ref={imgGroupRef}>
          {posts.map((post, i) => (
            <img 
              key={i}
              id={`img-${i}`}
              src={post.image || 'https://placehold.co/600x400'}
              data-x={getRandomPosition(-300, 300)}
              data-y={getRandomPosition(-200, 200)}
              alt={`${post.title} - ${post.body?.join(' ').substring(0, 50)}...`}
            />
          ))}
        </div>

        <div id="detail" ref={detailRef}>
          <div id="detailImg" ref={detailImgRef}></div>
          <div id="detailTxt" ref={detailTxtRef}></div>
        </div>

        <svg width="100%" height="100%" fill="none" stroke="#fff" ref={cursorRef}>
          <g id="cursor">
            <circle id="cursorCircle" ref={cursorCircleRef} cx="0" cy="0" r="12" strokeWidth="3" />
            <path id="cursorClose" ref={cursorCloseRef} d="M-25,-25 L25,25 M-25,25 L25,-25" opacity="0" strokeWidth="3.5" />
          </g>
        </svg>
      </div>
    </>
  );
};

function getRandomPosition(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default ParallaxScroll;

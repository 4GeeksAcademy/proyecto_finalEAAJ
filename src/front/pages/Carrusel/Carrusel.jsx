import React from 'react';
import styles from './carrusel.module.css';

const Carrusel = () => {
  const logos = [
    "https://simpleicons.org/icons/chartdotjs.svg", 
    "https://simpleicons.org/icons/googleanalytics.svg", 
    "https://simpleicons.org/icons/coinmarketcap.svg", 
    "https://simpleicons.org/icons/coinbase.svg", 
    "https://simpleicons.org/icons/paypal.svg", 
    "https://simpleicons.org/icons/visa.svg", 
    "https://simpleicons.org/icons/ethereum.svg", 
    "https://simpleicons.org/icons/bitcoin.svg"
  ];

const duplicatedLogos = [...logos, ...logos, ...logos];

return (
  <div className={styles.slider}>
    <div className={styles.slideTrack}>
      {duplicatedLogos.map((logo, index) => (
        <div className={styles.slide} key={index}>
          <img src={logo} alt={`logo-${index}`} width="250" height="100" />
        </div>
      ))}
    </div>
  </div>
);
};

export default Carrusel;

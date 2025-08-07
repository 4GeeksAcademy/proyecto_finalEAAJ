import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.css';

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(token !== null);
    };

    checkToken();

    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img
          src={isAuthenticated ? "/Mo-moneyIcon-Al.png" : "https://api.zoviz.com/lfp?b=K2NLr2r0IWQZfbqE&f=btCSiQWhf6m4&d=1"}
          alt="Logo"
          className={styles.logoImg}
        />
      </Link>

      {isAuthenticated ? (
        <div>
          {/* Aquí puedes poner menú de usuario o perfil */}
          <button onClick={handleLogout} className={styles.btnOutline}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login" className={styles.btnOutline}>
            Login
          </Link>
          <Link to="/form" className={styles.btnSolid}>
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};



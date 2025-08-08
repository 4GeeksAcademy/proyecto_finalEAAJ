import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavbarPublic } from "../components/NavbarPublic";
import { NavbarPrivate } from "../components/NavbarPrivate";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
 
export const Layout = () => {
  const location = useLocation();
  const [tieneToken, setTieneToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTieneToken(Boolean(token) && token.length > 10);
  }, [location]);

  return (
    <div className="app">
      <ScrollToTop />

      {/* Navbar */}
      {tieneToken === null ? null : tieneToken ? <NavbarPrivate /> : <NavbarPublic />}

      {/* Contenido principal */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"

import { Footer } from "../components/Footer"
import { NavbarPrivate } from "../components/NavbarPrivate";
import { NavbarPublic } from "../components/NavbarPublic";
import { useLocation } from "react-router-dom";


export const Layout = () => {
  const location = useLocation();
  const rutaActual = location.pathname;

  const rutasPublicas = ["/", "/login", "/form", "/inversion"];
  const esPublica = rutasPublicas.includes(rutaActual);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      
      {/* Navbar */}
      {esPublica ? <NavbarPublic /> : <NavbarPrivate />}

      {/* Contenido principal */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
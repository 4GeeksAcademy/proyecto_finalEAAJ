import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"

import {Footer} from "../components/Footer"
import { NavbarPrivate } from "../components/NavbarPrivate";
import { NavbarPublic } from "../components/NavbarPublic";
import { useLocation } from "react-router-dom";



export const Layout = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "null" && token !== "undefined";

  return (
    <div className="app">
      <ScrollToTop />
      
      {/* Navbar condicional */}
      {isAuthenticated ? <NavbarPrivate /> : <NavbarPublic />}

      {/* Contenido principal */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
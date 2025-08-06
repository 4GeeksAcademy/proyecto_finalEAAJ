import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"

import Footer from "../components/Footer"
import { NavbarPrivate } from "../components/NavbarPrivate";
import { NavbarPublic } from "../components/NavbarPublic";
import { useLocation } from "react-router-dom";


export const Layout = () => {
    const location = useLocation();
    const rutaActual = location.pathname;

    // Define qué rutas son públicas
    const rutasPublicas = ["/", "/login", "/form","/inversion"];

    // Verifica si estás en una ruta pública
    const esPublica = rutasPublicas.includes(rutaActual);

    return (
        <ScrollToTop>
            {esPublica ? <NavbarPublic /> : <NavbarPrivate />}
            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};
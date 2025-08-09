// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Formulario } from "./pages/Formulario";
import { Page404 } from "./pages/Page404";
import { AddNewGasto } from "./pages/AddNewGasto";
import { Loader } from "./pages/Loader";
import { Main } from "./pages/Main";
import { Objetivos } from "./pages/Objetivos";
import { EditarObjetivo } from "./pages/EditarObjetivo";
import { EditarGasto } from "./pages/EditarGasto";
import { Inversion } from "./pages/Inversion";
import Perfil from "./pages/Perfil";
import BlogPage from './pages/BlogPage';
import { NavbarPrivate } from './components/NavbarPrivate';
import ParallaxScroll from './components/Blog/ParallaxScroll';




export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Page404 />} /* loader={<Loader />} */>
      <Route path="/" element={<Home />} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Objetivos" element={<Objetivos />} />
      <Route path="/inversion" element={<Inversion />} />
      <Route path="/objetivos/editar/:id" element={<EditarObjetivo />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/form" element={<Formulario />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gasto/editar/:id" element={<EditarGasto />} />
      <Route path="/addnewgasto" element={<AddNewGasto />} />
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/navbarprivate" element={<NavbarPrivate />} />
      <Route path="/scroll-demo" element={<ParallaxScroll />} />
      
      {/* <Route path="/loader" element={<Loader />} /> Esta pagina es un intento independiente. Alexis */}
    </Route>
  )
);

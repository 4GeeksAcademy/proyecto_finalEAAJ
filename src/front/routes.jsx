// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
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
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Page404 />} /* loader={<Loader />} */>
      <Route path="/" element={<Home />} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Objetivos" element={<Objetivos />} />
      <Route path="/objetivos/editar/:index" element={<EditarObjetivo />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/form" element={<Formulario />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gasto/editar/:id" element={<EditarGasto />} />
      <Route path="/addnewgasto" element={<AddNewGasto />} />
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      {/* <Route path="/loader" element={<Loader />} /> Esta pagina es un intento independiente. Alexis */}
    </Route>
  )
);

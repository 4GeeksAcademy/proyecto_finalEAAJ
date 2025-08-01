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
import Perfil from "./pages/Perfil";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Page404 />}>
      <Route index element={<Home />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="resetpassword" element={<ResetPassword />} />
      <Route path="formulario" element={<Formulario />} />
      <Route path="login" element={<Login />} />
      <Route path="addnewgasto" element={<AddNewGasto />} />
      <Route path="perfil" element={<Perfil />} />
    </Route>
  )
);

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { AuthLayout } from "../layouts/AuthLayout"
import { Dashboard } from "../pages/Dashboard"
import { DeleteAccount } from "../pages/DeleteAccount"
import  Login  from "../pages/Login"
import { Register } from "../pages/Register"
import { LandingPage } from "../pages/LandingPage"
import { Logout } from "../pages/Logout"
import AdmonMain from "../pages/AdmonMain"
import { FormEstudiante } from "../pages/completar/FormEstudiante"
import { FormProfesor } from "../pages/completar/FormProfesor"
import { FormAdministrador } from "../pages/completar/FormAdministrador"
import EstudianteDashboard from "../pages/dashboard/EstudianteDashboard"
import ProfesorDashboard from "../pages/dashboard/ProfesorDashboard"
import { RecuperarContrasena } from "../pages/RecuperarContrasena"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/salir" element={<Logout />} />
            
        </Route>

        <Route element={<AuthLayout/>}>
            <Route path="/admonMain" element={<AdmonMain />} />
            <Route path="/login" element={<Login />} />
            <Route path="/eliminar" element={<DeleteAccount />} />
            <Route path="/registrar" element={<Register />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard/estudiante" element={<EstudianteDashboard />} />
            <Route path="/dashboard/profesor" element={<ProfesorDashboard />} /> 
            <Route path="/recuperar-contrasena/:token" element={<RecuperarContrasena/>} />
            
        </Route>

       

        {/* ✅ Rutas de completar registro — sin layout para que lleguen directo del correo */}
        <Route path="/completar/estudiante/:token" element={<FormEstudiante/>} />
        <Route path="/completar/profesor/:token" element={<FormProfesor />} />
        <Route path="/completar/administrador/:token" element={<FormAdministrador />} />

     


      </Routes>
    
    </BrowserRouter>
  )
}

export default AppRouter
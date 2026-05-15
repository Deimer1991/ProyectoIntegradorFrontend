import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  const headerClass = isLanding
    ? "sticky top-0 z-50 bg-[#080318]/80 backdrop-blur-lg border-b border-white/10"
    : "sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm";

  const logoBg = isLanding ? "bg-white/10" : "bg-[var(--color-secundario)]";
  const titleColor = isLanding ? "text-white" : "text-[var(--color-acento)]";
  const subtitleColor = isLanding ? "text-gray-400" : "text-gray-500";
  const navTextColor = isLanding ? "text-gray-300" : "text-gray-600";
  const navHover = isLanding ? "hover:text-white" : "hover:text-[var(--color-secundario)]";
  const loginBtn = isLanding
    ? "flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
    : "flex items-center gap-2 border border-[var(--color-secundario)] text-[var(--color-secundario)] px-4 py-2 rounded-lg hover:bg-[var(--color-secundario)] hover:text-white transition";
  const registerBtn = isLanding
    ? "flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
    : "flex items-center gap-2 bg-[var(--color-secundario)] text-white px-4 py-2 rounded-lg hover:scale-105 transition";

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className={`${logoBg} text-white p-2 rounded-xl shadow-md`}>
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className={`text-lg font-bold ${titleColor}`}>
              Sistema de Notas
            </h1>
            <p className={`text-xs ${subtitleColor}`}>
              Plataforma Académica
            </p>
          </div>
        </div>

        {/* Navegación central */}
        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${navTextColor}`}>
          {["Inicio", "Funcionalidades", "Nosotros", "Soporte"].map((item) => {
            const paths = { Inicio: "/", Funcionalidades: "/funcionalidades", Nosotros: "/nosotros", Soporte: "/soporte" };
            return (
              <button
                key={item}
                onClick={() => navigate(paths[item])}
                className={`${navHover} transition`}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* Botones derecha */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className={loginBtn}
          >
            <LogIn size={16} />
            Ingresar
          </button>

          <button
            onClick={() => navigate("/registrar")}
            className={registerBtn}
          >
            <UserPlus size={16} />
            Registro
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

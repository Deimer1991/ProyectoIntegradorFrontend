import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  const footerBg = isLanding ? "bg-[#080318] border-t border-white/5" : "bg-[var(--color-secundario)]";
  const textMuted = isLanding ? "text-gray-400" : "text-gray-300";

  return (
    <footer className={`${footerBg} text-white`}>
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo / descripción */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <GraduationCap size={28} />
              </div>
              <h2 className="text-xl font-bold">
                Sistema de Notas
              </h2>
            </div>

            <p className={`text-sm ${textMuted} leading-6`}>
              Plataforma académica moderna para la gestión de estudiantes,
              docentes, calificaciones y programas académicos.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Navegación
            </h3>
            <ul className={`space-y-3 text-sm ${textMuted}`}>
              <li className="hover:text-white cursor-pointer transition">Inicio</li>
              <li className="hover:text-white cursor-pointer transition">Iniciar sesión</li>
              <li className="hover:text-white cursor-pointer transition">Funcionalidades</li>
              <li className="hover:text-white cursor-pointer transition">Soporte</li>
            </ul>
          </div>

          {/* Módulos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Módulos
            </h3>
            <ul className={`space-y-3 text-sm ${textMuted}`}>
              <li>Gestión de estudiantes</li>
              <li>Registro de notas</li>
              <li>Programas académicos</li>
              <li>Reportes académicos</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Contacto
            </h3>

            <div className={`space-y-3 text-sm ${textMuted}`}>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                soporte@sistema.com
              </p>

              <p className="flex items-center gap-2">
                <Phone size={16} />
                +57 300 000 0000
              </p>

              <p className="flex items-center gap-2">
                <MapPin size={16} />
                Medellín, Colombia
              </p>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">

          <p className={`text-sm ${textMuted}`}>
            © 2026 Sistema de Notas Académico. Todos los derechos reservados.
          </p>

          {/* Redes */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <Facebook className="cursor-pointer hover:scale-110 transition" size={18} />
            <Instagram className="cursor-pointer hover:scale-110 transition" size={18} />
            <Linkedin className="cursor-pointer hover:scale-110 transition" size={18} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

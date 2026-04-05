
import { Users, BookOpen, BarChart3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


export const LandingPage = () => {

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    navigate('/registrar'); 
  };

  return (
    
    <section className="bg-[var(--color-primario)] py-24 overflow-hidden relative">

  {/* Fondo decorativo */}
  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primario)] to-white -z-10"></div>

  <div className="max-w-7xl mx-auto px-6">

    <div className="grid md:grid-cols-2 gap-16 items-center">

      {/* TEXTO */}
      <div>

        <span className="inline-flex items-center bg-[var(--color-acento)] text-[var(--color-primario)] font-bold text-sm px-8 py-1 rounded-full">
          Plataforma Académica
        </span>

        <h1 className="text-5xl font-bold text-[var(--color-acento)] mt-6 leading-tight">
          Gestiona estudiantes y
          <span className="text-[var(--color-secundario)]"> calificaciones </span>
          en un solo sistema
        </h1>

        <p className="text-lg text-gray-700 mt-6">
          Un sistema moderno para administrar estudiantes, docentes
          y notas académicas de forma centralizada y eficiente.
        </p>

        <div className="flex gap-4 mt-8">

          {/* BOTÓN PRINCIPAL */}
          <button 
            className="flex items-center gap-2 bg-[var(--color-secundario)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#003326] transition"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
            <ArrowRight size={18} />
          </button>

          {/* BOTÓN SECUNDARIO */}
          <button 
            className="border border-[var(--color-secundario)] text-[var(--color-secundario)] px-6 py-3 rounded-lg hover:bg-[var(--color-secundario)] hover:text-white transition"
            onClick={() => navigate('/dashboard')}
          >
            Ver funcionalidades
          </button>

        </div>

      </div>

      {/* CARD */}
      <div className="bg-[var(--color-secundario)] shadow-2xl rounded-2xl p-8 border border-gray-200">

        <h3 className="font-semibold text-[var(--color-acento)] mb-6">
          Panel de calificaciones
        </h3>

        <div className=" space-y-4">

          <div className="flex justify-between bg-[var(--color-primario)] p-3 rounded-lg">
            <span>Matemáticas</span>
            <span className="font-semibold text-[var(--color-secundario)]">4.5</span>
          </div>

          <div className="flex justify-between bg-[var(--color-primario)] p-3 rounded-lg">
            <span>Programación</span>
            <span className="font-semibold text-[var(--color-secundario)]">4.8</span>
          </div>

          <div className="flex justify-between bg-[var(--color-primario)] p-3 rounded-lg">
            <span>Base de Datos</span>
            <span className="font-semibold text-[var(--color-secundario)]">4.3</span>
          </div>

        </div>

      </div>

    </div>

    {/* FEATURES */}
    <div className=" bg-[var(--color-primario)] grid md:grid-cols-3 gap-8 mt-24">

      <Feature
        icon={<Users className="bg- [var(--color-primario)] text-[var(--color-secundario)]" />}
        title="Gestión de estudiantes"
        text="Administra estudiantes, grupos y programas académicos fácilmente."
      />

      <Feature
        icon={<BookOpen className="text-[var(--color-secundario)]" />}
        title="Registro de calificaciones"
        text="Los docentes pueden registrar notas de manera rápida y sencilla."
      />

      <Feature
        icon={<BarChart3 className="text-[var(--color-secundario)]" />}
        title="Reportes académicos"
        text="Visualiza estadísticas y rendimiento académico en tiempo real."
      />

    </div>

  </div>

</section>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="bg-[var(--color-primario)] p-8 rounded-xl border shadow-sm hover:shadow-lg transition">

      <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-primario)] rounded-lg text-blue-100">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mt-8">
        {title}
      </h3>

      <p className="text-gray-600 mt-3">
        {text}
      </p>

    </div>
  );
}
  


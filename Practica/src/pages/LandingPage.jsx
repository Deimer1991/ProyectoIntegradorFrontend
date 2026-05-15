import { useState, useEffect, useRef, useCallback } from "react";
import { Users, BookOpen, BarChart3, ArrowRight, Sparkles, GraduationCap, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), obs.unobserve(el)), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(start);
    }, 16);
    return () => clearInterval(t);
  }, [inView, end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-shape {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-30px) rotate(90deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
          75% { transform: translateY(-35px) rotate(270deg); }
        }
        @keyframes float-shape2 {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          33% { transform: translateY(-25px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(10px) rotate(240deg) scale(0.9); }
        }
        @keyframes float-shape3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(180deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-gradient { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
        .card-shine {
          position: relative; overflow: hidden;
        }
        .card-shine::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%);
          background-size: 200% 100%;
          opacity: 0; transition: opacity 0.3s;
          pointer-events: none;
        }
        .card-shine:hover::after {
          opacity: 1; animation: shimmer 0.8s ease forwards;
        }
        .scroll-reveal {
          opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.revealed {
          opacity: 1; transform: translateY(0);
        }
        .glass-card {
          background: rgba(255,255,255,0.05); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .hero-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[90vh] flex items-center overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #0f0c29, #1a1145, #0d2137, #0a2e2a)", backgroundSize: "400% 400%" }}
      >
        <div className="absolute inset-0 animate-gradient" style={{ background: "linear-gradient(135deg, #0f0c29, #1a1145, #0d2137, #0a2e2a)", backgroundSize: "400% 400%", opacity: 0.6 }} />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)", animation: "float-shape 12s ease-in-out infinite" }} />
        <div className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #06b6d4, transparent)", animation: "float-shape2 15s ease-in-out infinite" }} />
        <div className="absolute top-1/3 right-[20%] w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #10b981, transparent)", animation: "float-shape3 10s ease-in-out infinite" }} />

        {/* Geometric shapes */}
        <div className="absolute top-[15%] left-[5%] w-16 h-16 border-2 border-white/10 rounded-lg" style={{ animation: "float-shape 8s ease-in-out infinite" }} />
        <div className="absolute top-[60%] left-[8%] w-10 h-10 border-2 border-purple-400/20 rounded-full" style={{ animation: "float-shape2 11s ease-in-out infinite" }} />
        <div className="absolute top-[25%] right-[8%] w-14 h-14 border-2 border-cyan-400/20" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", animation: "float-shape3 9s ease-in-out infinite" }} />
        <div className="absolute bottom-[30%] right-[12%] w-8 h-8 bg-white/5 rounded-full" style={{ animation: "float-shape 7s ease-in-out infinite" }} />
        <div className="absolute top-[45%] left-[50%] w-20 h-20 border border-emerald-400/10 rounded-full" style={{ animation: "float-shape2 13s ease-in-out infinite" }} />

        {/* Animated glow that follows mouse */}
        <div
          className="absolute pointer-events-none opacity-30 blur-[120px] w-96 h-96 rounded-full transition-all duration-700"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.6), transparent)",
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm px-5 py-2 rounded-full mb-8">
                <Sparkles size={14} className="text-purple-300" />
                Plataforma Académica Inteligente
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Gestiona tu</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #a78bfa, #67e8f9, #34d399)",
                    backgroundSize: "200% auto",
                    animation: "gradient-shift 4s ease infinite",
                  }}
                >
                  sistema educativo
                </span>
                <br />
                <span className="text-white/90">con excelencia</span>
              </h1>

              <p className="text-lg text-gray-300/80 mb-10 max-w-lg leading-relaxed">
                Una plataforma centralizada para administrar estudiantes, docentes, calificaciones y reportes académicos con herramientas modernas y en tiempo real.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="group relative inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Comenzar ahora
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-purple-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl font-medium backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <GraduationCap size={18} />
                  Explorar funcionalidades
                </button>
              </div>

              {/* Trusted badges */}
              <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/5">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">U{i}</div>
                  ))}
                </div>
                <p className="text-sm text-gray-400"><span className="text-white font-semibold">400+</span> instituciones confían en nosotros</p>
              </div>
            </div>

            {/* Right: Showcase Card */}
            <div className="hidden md:block animate-slide-up" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
              <div className="relative" style={{ animation: "float-card 6s ease-in-out infinite" }}>
                <style>{`@keyframes float-card { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }`}</style>

                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-emerald-500/20 blur-3xl rounded-3xl" />

                <div className="relative glass-card rounded-2xl p-8 shadow-2xl">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <GraduationCap size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Panel de Control</h3>
                        <p className="text-gray-400 text-xs">Semestre 2026-1</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      En vivo
                    </div>
                  </div>

                  {/* Mini stat cards */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Estudiantes", value: "1,247", color: "from-purple-500 to-purple-600" },
                      { label: "Docentes", value: "89", color: "from-cyan-500 to-cyan-600" },
                      { label: "Grupos", value: "42", color: "from-emerald-500 to-emerald-600" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mini grade list */}
                  <div className="space-y-3">
                    {[
                      { subject: "Matemáticas Avanzadas", grade: "4.5", color: "text-purple-400" },
                      { subject: "Programación Web", grade: "4.8", color: "text-cyan-400" },
                      { subject: "Bases de Datos", grade: "4.3", color: "text-emerald-400" },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-sm text-gray-300">{m.subject}</span>
                        <span className={`font-bold text-sm ${m.color}`}>{m.grade}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BarChart3 size={14} />
                      <span className="text-xs">Rendimiento general</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <Star size={12} className="text-yellow-400/50 fill-yellow-400/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080318] to-transparent" />
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative py-20 bg-[#080318] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Estudiantes Activos", end: 1247, color: "from-purple-500 to-purple-600" },
              { icon: GraduationCap, label: "Docentes", end: 89, color: "from-cyan-500 to-cyan-600" },
              { icon: BookOpen, label: "Materias", end: 156, color: "from-emerald-500 to-emerald-600" },
              { icon: BarChart3, label: "Calificaciones", end: 15320, color: "from-amber-500 to-amber-600" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 text-center hover:bg-white/[0.06] transition-all duration-500"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.end} />
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="relative py-24 bg-[#080318]">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16" style={{ animation: "slide-up 0.8s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm px-5 py-2 rounded-full mb-6">
              <Sparkles size={14} className="text-cyan-300" />
              Todo lo que necesitas
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Potencia tu{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                institución
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Herramientas modernas para la gestión académica, diseñadas para facilitar el trabajo de docentes, estudiantes y administrativos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Gestión de Estudiantes",
                desc: "Administra estudiantes, grupos y programas académicos con una interfaz intuitiva y moderna.",
                gradient: "from-purple-500 to-purple-600",
                glow: "rgba(168,85,247,0.15)",
              },
              {
                icon: BookOpen,
                title: "Registro de Calificaciones",
                desc: "Los docentes pueden registrar y gestionar notas de manera rápida, con soporte para múltiples evaluaciones.",
                gradient: "from-cyan-500 to-cyan-600",
                glow: "rgba(6,182,212,0.15)",
              },
              {
                icon: BarChart3,
                title: "Reportes y Estadísticas",
                desc: "Visualiza el rendimiento académico con dashboards interactivos, gráficos y reportes en tiempo real.",
                gradient: "from-emerald-500 to-emerald-600",
                glow: "rgba(16,185,129,0.15)",
              },
            ].map((feat, i) => (
              <FeatureCard key={i} {...feat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative py-24 bg-[#080318] border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-purple-500 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-500 blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para transformar tu gestión académica?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Únete a las instituciones que ya confían en nuestro sistema y lleva tu institución al siguiente nivel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/registrar')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Crear cuenta gratuita
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

function FeatureCard({ icon: Icon, title, desc, gradient, glow, index }) {
  const [ref, inView] = useInView(0.15);

  return (
    <div
      ref={ref}
      className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 card-shine transition-all duration-700 hover:border-white/[0.15] hover:-translate-y-2 hover:shadow-2xl"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`,
        boxShadow: inView ? `0 0 60px ${glow}` : "none",
      }}
    >
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors inline-flex items-center gap-1">
          Explorar <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const FormProfesor = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [tituloProfesional, setTituloProfesional] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/usuarios/token/${token}`
        );
        if (!response.ok) throw new Error("Token inválido o expirado");
        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/profesores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: usuario.id,
          tituloProfesional,
          especializacion,
        }),
      });

      if (!response.ok) throw new Error("Error al completar registro");

      alert("Registro completado correctamente");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("No se pudo completar el registro.");
    }
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-primario)]">
      <p className="text-white text-lg animate-pulse">Verificando enlace...</p>
    </main>
  );

  if (error) return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-primario)]">
      <p className="text-red-400 text-lg">{error}</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-[var(--color-secundario)]/10"
      >
        <h1 className="text-2xl font-bold text-center text-[var(--color-acento)] mb-4">
          Completar Registro — Profesor
        </h1>

        <p className="text-center text-gray-500 text-sm">
          Hola <strong>{usuario?.nombreCompleto?.nombres}</strong>, completa tu información.
        </p>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Título profesional
          </label>
          <input
            type="text"
            placeholder="Ej: Ingeniero de Sistemas"
            value={tituloProfesional}
            onChange={(e) => setTituloProfesional(e.target.value)}
            required
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Especialización
          </label>
          <input
            type="text"
            placeholder="Ej: Inteligencia Artificial"
            value={especializacion}
            onChange={(e) => setEspecializacion(e.target.value)}
            required
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-[var(--color-secundario)] text-white font-semibold rounded-lg"
          >
            Completar registro
          </button>
        </div>
      </form>
    </main>
  );
};
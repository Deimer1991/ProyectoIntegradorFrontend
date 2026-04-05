import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const FormEstudiante = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [programaId, setProgramaId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sinProgramas, setSinProgramas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Carga usuario y programas al mismo tiempo
        const [usuarioRes, programasRes] = await Promise.all([
          fetch(`http://localhost:8081/api/usuarios/token/${token}`),
          fetch(`http://localhost:8081/api/programas/activos`),
        ]);

        if (!usuarioRes.ok) throw new Error("Token inválido o expirado");

        const usuarioData = await usuarioRes.json();
        const programasData = await programasRes.json();

        setUsuario(usuarioData);
        setProgramas(programasData);

        if (programasData.length === 0) setSinProgramas(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!programaId) {
      alert("Debes seleccionar un programa académico");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/estudiantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: String(usuario.id),
          programaId: String(programaId),
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
      <p className="text-[var(--color-secundario)] text-lg animate-pulse">Verificando enlace...</p>
    </main>
  );

  if (error) return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-primario)]">
      <p className="text-red-400 text-lg">{error}</p>
    </main>
  );

  if (sinProgramas) return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-primario)]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <p className="text-[var(--color-acento)] font-semibold text-lg mb-2">
          No hay programas disponibles
        </p>
        <p className="text-gray-500 text-sm">
          El administrador aún no ha creado programas académicos. Por favor intenta más tarde o contacta al administrador.
        </p>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-[var(--color-secundario)]/10"
      >
        <h1 className="text-2xl font-bold text-center text-[var(--color-acento)] mb-4">
          Completar Registro — Estudiante
        </h1>

        <p className="text-center text-gray-500 text-sm">
          Hola <strong>{usuario?.nombreCompleto?.nombres}</strong>, selecciona tu programa académico.
        </p>

        {/* ✅ Select con programas de la BD */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Programa académico
          </label>
          <select
            value={programaId}
            onChange={e => setProgramaId(e.target.value)}
            required
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg bg-white text-[var(--color-acento)]"
          >
            <option value="">— Selecciona un programa —</option>
            {programas.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.modalidad ? `(${p.modalidad})` : ""}
              </option>
            ))}
          </select>
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
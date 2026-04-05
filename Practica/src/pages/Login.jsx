import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      // ✅ Guarda el token y datos del usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("id", data.id);
      localStorage.setItem("nombres", data.nombres);
      localStorage.setItem("apellidos", data.apellidos);

      // ✅ Redirige según el rol
      switch (data.rol) {
        case "ESTUDIANTE":
          navigate("/dashboard/estudiante");
          break;
        case "PROFESOR":
          navigate("/dashboard/profesor");
          break;
        case "ADMINISTRADOR":
          navigate("/admonMain");
          break;
        case "SUPER_ADMIN": // ✅ mismo panel que el admin
        navigate("/admonMain");
        break;
        default:
          setError("Rol no reconocido");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-acento)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--color-primario)] rounded-2xl shadow-2xl p-8 border border-[var(--color-secundario)]/10">

        <h1 className="text-3xl font-bold text-center text-[var(--color-acento)] mb-2">
          LOGIN
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Accede a la plataforma académica
        </p>

        {/* ✅ Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block font-semibold text-[var(--color-acento)] mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              placeholder="Ingrese su correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[var(--color-secundario)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secundario)] transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--color-acento)] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="contraseña"
              placeholder="Ingrese su contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[var(--color-secundario)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secundario)] transition"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="bg-[var(--color-secundario)] hover:bg-[#003326] text-white font-semibold py-3 px-4 rounded-lg transition shadow-md"
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              onClick={() => navigate('/registrar')}
              className="border border-[var(--color-secundario)] text-[var(--color-secundario)] hover:bg-[var(--color-secundario)] hover:text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Registrar
            </button>

            <button
              type="button"
              className="text-[var(--color-acento)] hover:text-[var(--color-secundario)] font-medium py-2 transition"
            >
              Cambiar Contraseña
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};

export default Login;
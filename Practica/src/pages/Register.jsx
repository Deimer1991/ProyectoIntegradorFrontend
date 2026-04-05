import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "CC",
    documento: "",
    correo: "",
    numeroCelular: "",
    password: "",
    confirmPassword: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validarFormulario = () => {
    let nuevosErrores = {};

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(formData.correo)) {
      nuevosErrores.correo = "Correo electrónico inválido";
    }

    if (!/^\d+$/.test(formData.documento)) {
      nuevosErrores.documento = "Solo se permiten números";
    }

    const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regexPassword.test(formData.password)) {
      nuevosErrores.password =
        "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial";
    }

    if (formData.password !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    // ✅ JSON estructurado exactamente como lo espera el backend
    const payload = {
      nombreCompleto: {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
      },
      tipoDocumento: formData.tipoDocumento,
      documento: formData.documento,
      correo: formData.correo,
      numeroCelular: formData.numeroCelular,
      contraseña: formData.password,
      contraseñaConfirmada: formData.confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:8081/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error al registrar usuario");
        return;
    }

      const data = await response.json();
      console.log("Usuario guardado:", data);
    alert("Usuario registrado correctamente. Revisa tu correo electrónico para continuar con el registro");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert(`No se pudo registrar el usuario: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center px-4 py-8">
      <form
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-[var(--color-secundario)]/10"
        onSubmit={handleRegister}
      >
        <h1 className="text-2xl font-bold text-center text-[var(--color-acento)] mb-4">
          Formulario de Registro
        </h1>

        {/* ✅ name="nombres" coincide con el estado y con NombreCompleto */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Nombres
          </label>
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={formData.nombres}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
        </div>

        {/* ✅ name="apellidos" coincide con el estado y con NombreCompleto */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Apellidos
          </label>
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Tipo de documento
          </label>
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          >
            <option value="CC">Cédula</option>
            <option value="TI">Tarjeta de identidad</option>
            <option value="PP">Pasaporte</option>
            <option value="CE">Cédula extranjera</option>
          </select>
        </div>

        {/* ✅ name="documento" corregido */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Número de documento
          </label>
          <input
            type="text"
            name="documento"
            placeholder="Número de documento"
            value={formData.documento}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
          {errores.documento && (
            <p className="text-red-500 text-sm mt-1">{errores.documento}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Correo electrónico
          </label>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
          {errores.correo && (
            <p className="text-red-500 text-sm mt-1">{errores.correo}</p>
          )}
        </div>

        {/* ✅ name="numeroCelular" corregido — antes decía "numeroDocumento" */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Número de celular
          </label>
          <input
            type="text"
            name="numeroCelular"
            placeholder="Número de celular"
            value={formData.numeroCelular}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
          {errores.password && (
            <p className="text-red-500 text-sm mt-1">{errores.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">
            Confirmar contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-[var(--color-secundario)]/20 rounded-lg"
          />
          {errores.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errores.confirmPassword}
            </p>
          )}
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-[var(--color-secundario)] text-white font-semibold rounded-lg"
          >
            Registrar
          </button>
        </div>
      </form>
    </main>
  );
};
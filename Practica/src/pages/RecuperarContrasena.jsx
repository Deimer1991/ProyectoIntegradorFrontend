import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const RecuperarContrasena = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [tokenValido, setTokenValido] = useState(null);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const validar = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/recuperacion/validar/${token}`
        );
        const data = await response.json();
        setTokenValido(data.valido);
      } catch {
        setTokenValido(false);
      } finally {
        setLoading(false);
      }
    };
    validar();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regex.test(nuevaContrasena)) {
      setError("Mínimo 8 caracteres, una mayúscula, un número y un carácter especial");
      return;
    }
    if (nuevaContrasena !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch("http://localhost:8081/api/recuperacion/cambiar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContrasena }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "No se pudo cambiar la contraseña");
        return;
      }

      alert("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
      navigate("/login");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "var(--color-primario)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--color-secundario)" }}>Verificando enlace...</p>
    </main>
  );

  if (!tokenValido) return (
    <main style={{ minHeight: "100vh", background: "var(--color-primario)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: "40px", margin: "0 0 16px" }}>⏱</p>
        <h2 style={{ margin: "0 0 8px", color: "var(--color-acento)", fontSize: "18px" }}>
          El enlace ha expirado
        </h2>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
          Este link es válido por 1 hora. Por favor solicita uno nuevo desde el login.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{ background: "var(--color-secundario)", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
        >
          Ir al login
        </button>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-primario)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: "white", borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "500", color: "var(--color-acento)", textAlign: "center" }}>
          Nueva contraseña
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#666", textAlign: "center" }}>
          Escribe tu nueva contraseña. Recuerda que debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.
        </p>

        {error && (
          <div style={{ background: "#FCEBEB", border: "1px solid #F09595", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#791F1F" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--color-secundario)", marginBottom: "6px" }}>
            Nueva contraseña
          </label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={e => setNuevaContrasena(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(0,79,57,0.3)", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--color-secundario)", marginBottom: "6px" }}>
            Confirmar contraseña
          </label>
          <input
            type="password"
            value={confirmar}
            onChange={e => setConfirmar(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(0,79,57,0.3)", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          style={{ width: "100%", padding: "12px", background: "var(--color-secundario)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
        >
          {guardando ? "Actualizando..." : "Actualizar contraseña"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{ width: "100%", marginTop: "10px", padding: "10px", background: "none", border: "1px solid rgba(0,79,57,0.3)", color: "var(--color-secundario)", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}
        >
          Cancelar
        </button>
      </form>
    </main>
  );
};
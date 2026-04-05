import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const EstudianteDashboard = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const fileInputRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();

  const [perfil, setPerfil] = useState(null);
  const [seccion, setSeccion] = useState("perfil");
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/estudiantes/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Error al cargar el perfil");
        const data = await response.json();
        setPerfil(data);
        setFormEdit({
          correo: data.correo,
          numeroCelular: data.numeroCelular,
          programaAcademico: data.programaAcademico,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [id]);

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/estudiantes/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ foto: base64 }),
          }
        );
        if (!response.ok) throw new Error("Error al actualizar foto");
        const data = await response.json();
        setPerfil(data);
        alert("Foto actualizada correctamente");
      } catch {
        alert("No se pudo actualizar la foto");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGuardarEdicion = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/estudiantes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formEdit),
        }
      );
      if (!response.ok) throw new Error("Error al guardar");
      const data = await response.json();
      setPerfil(data);
      setEditando(false);
      alert("Datos actualizados correctamente");
    } catch {
      alert("No se pudo guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const iniciales = perfil
    ? `${perfil.nombreCompleto?.nombres?.[0] ?? ""}${perfil.nombreCompleto?.apellidos?.[0] ?? ""}`
    : "ES";

  // ✅ Estilos dinámicos según modo
  const bg = "var(--color-primario)";
  const cardBg = darkMode ? "#2a2a2a" : "white";
  const cardBorder = darkMode ? "1px solid rgba(93,206,165,0.2)" : "1px solid rgba(0,79,57,0.15)";
  const textoP = "var(--color-acento)";
  const textoS = "var(--color-secundario)";
  const metricaBg = darkMode ? "#333" : "var(--color-primario)";
  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    border: darkMode ? "1px solid rgba(93,206,165,0.3)" : "1px solid rgba(0,79,57,0.3)",
    borderRadius: "8px",
    fontSize: "14px",
    color: textoP,
    background: darkMode ? "#333" : "white",
    boxSizing: "border-box",
  };
  const btnPrimario = {
    background: textoS,
    color: darkMode ? "#1a1a1a" : "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  };
  const btnSecundario = {
    background: "none",
    border: `1px solid ${textoS}`,
    color: textoS,
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: textoS }}>Cargando perfil...</p>
    </main>
  );

  if (error) return (
    <main style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "red" }}>{error}</p>
    </main>
  );

  const secciones = [
    { id: "perfil", label: "Mi perfil" },
    { id: "materias", label: "Mis materias" },
    { id: "notas", label: "Mis notas" },
    { id: "horario", label: "Horario" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: bg, padding: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: textoS, fontSize: "22px", fontWeight: "500", margin: 0 }}>
          Sistema de Notas
        </h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* ✅ Toggle modo oscuro */}
          <button onClick={toggleDarkMode} style={btnSecundario}>
            {darkMode ? "☀ Modo claro" : "☾ Modo oscuro"}
          </button>
          <button onClick={handleLogout} style={btnSecundario}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>

          {/* Avatar */}
          <div style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "16px", marginBottom: "8px", textAlign: "center" }}>
            <div
              onClick={() => fileInputRef.current.click()}
              style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 8px", overflow: "hidden", background: darkMode ? "#3a3a3a" : "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${textoS}` }}
            >
              {perfil?.foto
                ? <img src={perfil.foto} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontWeight: "500", fontSize: "18px", color: textoS }}>{iniciales}</span>
              }
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFotoChange} />
            <p style={{ margin: "0 0 2px", fontWeight: "500", fontSize: "14px", color: textoP }}>
              {perfil?.nombreCompleto?.nombres} {perfil?.nombreCompleto?.apellidos}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: textoS }}>Estudiante</p>
            <p style={{ margin: "6px 0 0", fontSize: "11px", color: textoS, opacity: 0.7 }}>
              Clic en la foto para cambiarla
            </p>
          </div>

          {/* Navegación */}
          {secciones.map(item => (
            <button
              key={item.id}
              onClick={() => setSeccion(item.id)}
              style={{
                background: seccion === item.id ? textoS : cardBg,
                color: seccion === item.id ? (darkMode ? "#1a1a1a" : "white") : textoP,
                border: cardBorder,
                borderRadius: "8px",
                padding: "10px 14px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: seccion === item.id ? "500" : "400",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Contenido principal */}
        <div style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "24px" }}>

          {/* ── PERFIL ── */}
          {seccion === "perfil" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "500", color: textoP }}>Mi perfil</h2>
                {!editando
                  ? <button onClick={() => setEditando(true)} style={btnPrimario}>Editar datos</button>
                  : <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditando(false)} style={btnSecundario}>Cancelar</button>
                      <button onClick={handleGuardarEdicion} disabled={guardando} style={btnPrimario}>
                        {guardando ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                }
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Nombres", value: perfil?.nombreCompleto?.nombres, key: null },
                  { label: "Apellidos", value: perfil?.nombreCompleto?.apellidos, key: null },
                  { label: "Documento", value: perfil?.documento, key: null },
                  { label: "Tipo documento", value: perfil?.tipoDocumento, key: null },
                  { label: "Correo", value: perfil?.correo, key: "correo" },
                  { label: "Celular", value: perfil?.numeroCelular, key: "numeroCelular" },
                  { label: "Programa académico", value: perfil?.programa?.nombre, key: null },
                ].map(campo => (
                  <div key={campo.label}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS, fontWeight: "500" }}>{campo.label}</p>
                    {editando && campo.key
                      ? <input
                          value={formEdit[campo.key] || ""}
                          onChange={e => setFormEdit({ ...formEdit, [campo.key]: e.target.value })}
                          style={inputStyle}
                        />
                      : <p style={{ margin: 0, fontSize: "14px", color: textoP }}>{campo.value ?? "—"}</p>
                    }
                  </div>
                ))}
              </div>

              {/* Métricas */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "24px" }}>
                {[
                  { label: "Promedio general", value: "—" },
                  { label: "Materias cursando", value: "—" },
                  { label: "Créditos cursados", value: "—" },
                ].map(m => (
                  <div key={m.label} style={{ background: metricaBg, borderRadius: "8px", padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS }}>{m.label}</p>
                    <p style={{ margin: 0, fontSize: "22px", fontWeight: "500", color: textoP }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MATERIAS ── */}
          {seccion === "materias" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Mis materias</h2>
              <p style={{ color: textoS, fontSize: "14px" }}>
                Módulo de materias — disponible cuando implementemos las tablas de materias.
              </p>
            </div>
          )}

          {/* ── NOTAS ── */}
          {seccion === "notas" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Mis notas</h2>
              <p style={{ color: textoS, fontSize: "14px" }}>
                Módulo de notas — disponible cuando implementemos las tablas de notas.
              </p>
            </div>
          )}

          {/* ── HORARIO ── */}
          {seccion === "horario" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Horario</h2>
              <p style={{ color: textoS, fontSize: "14px" }}>
                Módulo de horario — disponible próximamente.
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default EstudianteDashboard;
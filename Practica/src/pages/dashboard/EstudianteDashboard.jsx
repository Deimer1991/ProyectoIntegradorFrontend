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

  const [matriculas, setMatriculas] = useState([]);
  const [calificacionesMap, setCalificacionesMap] = useState({});
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState(null);

  // ── Estilos dinámicos ──
  const bg = "var(--color-primario)";
  const cardBg = darkMode ? "#2a2a2a" : "white";
  const cardBorder = darkMode ? "1px solid rgba(93,206,165,0.2)" : "1px solid rgba(0,79,57,0.15)";
  const textoP = "var(--color-acento)";
  const textoS = "var(--color-secundario)";
  const metricaBg = darkMode ? "#333" : "var(--color-primario)";
  const inputStyle = {
    width: "100%", padding: "8px 10px",
    border: darkMode ? "1px solid rgba(93,206,165,0.3)" : "1px solid rgba(0,79,57,0.3)",
    borderRadius: "8px", fontSize: "14px", color: textoP,
    background: darkMode ? "#333" : "white", boxSizing: "border-box",
  };
  const btnPrimario = {
    background: textoS, color: darkMode ? "#1a1a1a" : "white",
    border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px",
  };
  const btnSecundario = {
    background: "none", border: `1px solid ${textoS}`, color: textoS,
    padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px",
  };

  // ── Carga inicial ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Carga perfil y matrículas en paralelo
        const [perfilRes, matriculasRes] = await Promise.all([
          fetch(`http://localhost:8081/api/estudiantes/${id}`, { headers }),
          fetch(`http://localhost:8081/api/matriculas/estudiante/${id}`, { headers }),
        ]);

        if (!perfilRes.ok) throw new Error("Error al cargar el perfil");
        if (!matriculasRes.ok) throw new Error("Error al cargar matrículas");

        const perfilData = await perfilRes.json();
        const matriculasData = await matriculasRes.json();

        setPerfil(perfilData);
        setMatriculas(matriculasData.filter(m => m.estado === "ACTIVO"));
        setFormEdit({
          correo: perfilData.correo,
          numeroCelular: perfilData.numeroCelular,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Cargar calificaciones de una matrícula ──
  const cargarCalificaciones = async (matriculaId) => {
    if (calificacionesMap[matriculaId]) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/calificaciones/matricula/${matriculaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCalificacionesMap(prev => ({ ...prev, [matriculaId]: data }));
    } catch {
      alert("No se pudieron cargar las calificaciones");
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/estudiantes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ foto: reader.result }),
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setPerfil(data);
        alert("Foto actualizada correctamente");
      } catch { alert("No se pudo actualizar la foto"); }
    };
    reader.readAsDataURL(file);
  };

  const handleGuardarEdicion = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/estudiantes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formEdit),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPerfil(data);
      setEditando(false);
      alert("Datos actualizados correctamente");
    } catch { alert("No se pudo guardar los cambios"); }
    finally { setGuardando(false); }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const iniciales = perfil
    ? `${perfil.nombreCompleto?.nombres?.[0] ?? ""}${perfil.nombreCompleto?.apellidos?.[0] ?? ""}`
    : "ES";

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

  const PESOS = { PARCIAL_1: 0.20, PARCIAL_2: 0.20, TRABAJO: 0.20, EXAMEN_FINAL: 0.40 };
  const PESOS_M = { 1: 0.30, 2: 0.30, 3: 0.40 };
  const TIPOS_LABEL = { PARCIAL_1: "Parcial 1", PARCIAL_2: "Parcial 2", TRABAJO: "Trabajo", EXAMEN_FINAL: "Examen final" };

  return (
    <main style={{ minHeight: "100vh", background: bg, padding: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: textoS, fontSize: "22px", fontWeight: "500", margin: 0 }}>Sistema de Notas</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={toggleDarkMode} style={btnSecundario}>{darkMode ? "☀ Modo claro" : "☾ Modo oscuro"}</button>
          <button onClick={handleLogout} style={btnSecundario}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "16px", marginBottom: "8px", textAlign: "center" }}>
            <div onClick={() => fileInputRef.current.click()} style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 8px", overflow: "hidden", background: darkMode ? "#3a3a3a" : "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${textoS}` }}>
              {perfil?.foto ? <img src={perfil.foto} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontWeight: "500", fontSize: "18px", color: textoS }}>{iniciales}</span>}
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFotoChange} />
            <p style={{ margin: "0 0 2px", fontWeight: "500", fontSize: "14px", color: textoP }}>{perfil?.nombreCompleto?.nombres} {perfil?.nombreCompleto?.apellidos}</p>
            <p style={{ margin: 0, fontSize: "12px", color: textoS }}>Estudiante</p>
            <p style={{ margin: "6px 0 0", fontSize: "11px", color: textoS, opacity: 0.7 }}>Clic en la foto para cambiarla</p>
          </div>

          {secciones.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} style={{ background: seccion === item.id ? textoS : cardBg, color: seccion === item.id ? (darkMode ? "#1a1a1a" : "white") : textoP, border: cardBorder, borderRadius: "8px", padding: "10px 14px", textAlign: "left", cursor: "pointer", fontSize: "14px", fontWeight: seccion === item.id ? "500" : "400" }}>
              {item.label}
            </button>
          ))}

          {/* Métricas */}
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Materias cursando", value: matriculas.length },
              { label: "Programa", value: perfil?.programa?.nombre ?? "—" },
            ].map(m => (
              <div key={m.label} style={{ background: metricaBg, borderRadius: "8px", padding: "10px 14px" }}>
                <p style={{ margin: "0 0 2px", fontSize: "11px", color: textoS }}>{m.label}</p>
                <p style={{ margin: 0, fontSize: m.label === "Programa" ? "12px" : "20px", fontWeight: "500", color: textoP }}>{m.value}</p>
              </div>
            ))}
          </div>
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
                      <button onClick={handleGuardarEdicion} disabled={guardando} style={btnPrimario}>{guardando ? "Guardando..." : "Guardar"}</button>
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
                      ? <input value={formEdit[campo.key] || ""} onChange={e => setFormEdit({ ...formEdit, [campo.key]: e.target.value })} style={inputStyle} />
                      : <p style={{ margin: 0, fontSize: "14px", color: textoP }}>{campo.value ?? "—"}</p>
                    }
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "24px" }}>
                {[
                  { label: "Materias cursando", value: matriculas.length },
                  { label: "Promedio general", value: (() => {
                    const promedios = matriculas.map(m => {
                      const cals = calificacionesMap[m.id] ?? [];
                      if (cals.length < 12) return null;
                      let total = 0;
                      for (let mo = 1; mo <= 3; mo++) {
                        const pm = cals.filter(c => c.momento === mo).reduce((acc, c) => acc + c.nota * PESOS[c.tipo], 0);
                        total += pm * PESOS_M[mo];
                      }
                      return total;
                    }).filter(p => p !== null);
                    if (promedios.length === 0) return "—";
                    return (Math.round(promedios.reduce((a, b) => a + b, 0) / promedios.length * 100) / 100).toFixed(2);
                  })() },
                  { label: "Programa", value: perfil?.programa?.nombre ?? "—" },
                ].map(m => (
                  <div key={m.label} style={{ background: metricaBg, borderRadius: "8px", padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS }}>{m.label}</p>
                    <p style={{ margin: 0, fontSize: m.label === "Programa" ? "13px" : "22px", fontWeight: "500", color: textoP }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MATERIAS ── */}
          {seccion === "materias" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Mis materias</h2>
              {matriculas.length === 0 ? (
                <p style={{ color: textoS, fontSize: "14px" }}>No tienes materias matriculadas aún.</p>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {matriculas.map(matricula => (
                    <div key={matricula.id} style={{ background: darkMode ? "#333" : "var(--color-primario)", border: cardBorder, borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: "0 0 4px", fontWeight: "500", fontSize: "15px", color: textoP }}>{matricula.grupo?.materia?.nombre}</p>
                        <p style={{ margin: "0 0 2px", fontSize: "13px", color: textoS }}>Grupo: {matricula.grupo?.nombre}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: textoS, opacity: 0.8 }}>
                          Profesor: {matricula.grupo?.profesor?.nombreCompleto?.nombres} {matricula.grupo?.profesor?.nombreCompleto?.apellidos} · Semestre: {matricula.grupo?.semestre ?? "—"}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await cargarCalificaciones(matricula.id);
                          setMatriculaSeleccionada(matricula);
                          setSeccion("notas");
                        }}
                        style={{ ...btnPrimario, padding: "6px 14px", fontSize: "12px" }}
                      >
                        Ver notas
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── NOTAS ── */}
          {seccion === "notas" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "500", color: textoP }}>
                  Mis notas {matriculaSeleccionada ? `— ${matriculaSeleccionada.grupo?.materia?.nombre}` : ""}
                </h2>
                <button onClick={() => setSeccion("materias")} style={{ ...btnSecundario, padding: "6px 14px", fontSize: "12px" }}>
                  ← Volver
                </button>
              </div>

              {matriculaSeleccionada ? (
                <div>
                  {[1, 2, 3].map(momento => {
                    const notas = (calificacionesMap[matriculaSeleccionada.id] ?? []).filter(c => c.momento === momento);
                    const promedio = notas.length === 4
                      ? Math.round(notas.reduce((acc, c) => acc + c.nota * PESOS[c.tipo], 0) * 100) / 100
                      : null;
                    return (
                      <div key={momento} style={{ background: darkMode ? "#333" : "var(--color-primario)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <p style={{ margin: 0, fontWeight: "500", fontSize: "14px", color: textoP }}>
                            Momento {momento} ({momento === 3 ? "40%" : "30%"})
                          </p>
                          {promedio !== null && (
                            <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", background: promedio >= 3 ? "#EAF3DE" : promedio >= 2 ? "#FAEEDA" : "#FCEBEB", color: promedio >= 3 ? "#27500A" : promedio >= 2 ? "#633806" : "#791F1F" }}>
                              Promedio: {promedio.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                          {["PARCIAL_1", "PARCIAL_2", "TRABAJO", "EXAMEN_FINAL"].map(tipo => {
                            const cal = notas.find(c => c.tipo === tipo);
                            return (
                              <div key={tipo} style={{ background: cardBg, borderRadius: "8px", padding: "12px", textAlign: "center", border: cardBorder }}>
                                <p style={{ margin: "0 0 4px", fontSize: "11px", color: textoS }}>{TIPOS_LABEL[tipo]}</p>
                                <p style={{ margin: "0 0 6px", fontSize: "11px", color: textoS, opacity: 0.7 }}>{tipo === "EXAMEN_FINAL" ? "40%" : "20%"}</p>
                                {cal ? (
                                  <span style={{ fontSize: "22px", fontWeight: "500", color: cal.nota >= 3 ? "#27500A" : cal.nota >= 2 ? "#633806" : "#791F1F" }}>
                                    {cal.nota.toFixed(1)}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "18px", color: textoS, opacity: 0.5 }}>—</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Nota final */}
                  {(() => {
                    const todasNotas = calificacionesMap[matriculaSeleccionada.id] ?? [];
                    let notaFinal = null;
                    let completo = true;
                    let totalFinal = 0;
                    for (let m = 1; m <= 3; m++) {
                      const notasMomento = todasNotas.filter(c => c.momento === m);
                      if (notasMomento.length < 4) { completo = false; break; }
                      const pm = notasMomento.reduce((acc, c) => acc + c.nota * PESOS[c.tipo], 0);
                      totalFinal += pm * PESOS_M[m];
                    }
                    if (completo) notaFinal = Math.round(totalFinal * 100) / 100;
                    return (
                      <div style={{ background: notaFinal !== null && notaFinal >= 3 ? "#EAF3DE" : notaFinal !== null ? "#FCEBEB" : darkMode ? "#333" : "var(--color-primario)", borderRadius: "12px", padding: "20px", textAlign: "center", border: cardBorder, marginTop: "8px" }}>
                        <p style={{ margin: "0 0 8px", fontSize: "13px", color: textoS }}>Nota final del curso</p>
                        {notaFinal !== null ? (
                          <p style={{ margin: 0, fontSize: "40px", fontWeight: "500", color: notaFinal >= 3 ? "#27500A" : "#791F1F" }}>
                            {notaFinal.toFixed(2)}
                          </p>
                        ) : (
                          <p style={{ margin: 0, fontSize: "15px", color: textoS }}>Pendiente — faltan notas por registrar</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: textoS, fontSize: "14px", border: cardBorder, borderRadius: "12px" }}>
                  Selecciona una materia desde "Mis materias" para ver tus notas.
                </div>
              )}
            </div>
          )}

          {/* ── HORARIO ── */}
          {seccion === "horario" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Horario</h2>
              <p style={{ color: textoS, fontSize: "14px" }}>Módulo de horario — disponible próximamente.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default EstudianteDashboard;
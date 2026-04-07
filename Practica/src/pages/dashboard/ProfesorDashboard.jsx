import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const ProfesorDashboard = () => {
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

  // ── Estados de grupos y calificaciones ──
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [matriculasGrupo, setMatriculasGrupo] = useState([]);
  const [calificacionesGrupo, setCalificacionesGrupo] = useState([]);
  const [momentoActivo, setMomentoActivo] = useState(1);
  const [loadingGrupo, setLoadingGrupo] = useState(false);
  const [guardandoNota, setGuardandoNota] = useState(false);

  const TIPOS = ["PARCIAL_1", "PARCIAL_2", "TRABAJO", "EXAMEN_FINAL"];
  const TIPOS_LABEL = {
    PARCIAL_1: "Parcial 1",
    PARCIAL_2: "Parcial 2",
    TRABAJO: "Trabajo",
    EXAMEN_FINAL: "Examen final",
  };
  const PESOS = { PARCIAL_1: 0.20, PARCIAL_2: 0.20, TRABAJO: 0.20, EXAMEN_FINAL: 0.40 };
  const PESOS_MOMENTO = { 1: 0.30, 2: 0.30, 3: 0.40 };

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

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [perfilRes, gruposRes] = await Promise.all([
          fetch(`http://localhost:8081/api/profesores/${id}`, { headers }),
          fetch(`http://localhost:8081/api/grupos/profesor/${id}`, { headers }),
        ]);
        if (!perfilRes.ok) throw new Error("Error al cargar el perfil");
        if (!gruposRes.ok) throw new Error("Error al cargar grupos");
        const perfilData = await perfilRes.json();
        const gruposData = await gruposRes.json();
        setPerfil(perfilData);
        setGrupos(gruposData);
        setFormEdit({
          correo: perfilData.correo,
          numeroCelular: perfilData.numeroCelular,
          tituloProfesional: perfilData.tituloProfesional,
          especializacion: perfilData.especializacion,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [id]);

  // ── Cargar matriculas y calificaciones del grupo ──
  const seleccionarGrupo = async (grupo) => {
    setGrupoSeleccionado(grupo);
    setLoadingGrupo(true);
    setMomentoActivo(1);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [matriculasRes, calificacionesRes] = await Promise.all([
        fetch(`http://localhost:8081/api/matriculas/grupo/${grupo.id}`, { headers }),
        fetch(`http://localhost:8081/api/calificaciones/grupo/${grupo.id}`, { headers }),
      ]);
      const matriculasData = await matriculasRes.json();
      const calificacionesData = await calificacionesRes.json();
      setMatriculasGrupo(matriculasData.filter(m => m.estado === "ACTIVO"));
      setCalificacionesGrupo(calificacionesData);
    } catch {
      alert("No se pudo cargar la información del grupo");
    } finally {
      setLoadingGrupo(false);
    }
  };

  // ── Obtener nota de un estudiante en un momento y tipo ──
  const getNota = (matriculaId, momento, tipo) => {
    const cal = calificacionesGrupo.find(
      c => c.matricula.id === matriculaId && c.momento === momento && c.tipo === tipo
    );
    return cal ? cal.nota : "";
  };

  // ── Calcular promedio de un momento para una matrícula ──
  const calcularPromedioMomento = (matriculaId, momento) => {
    let total = 0;
    let tieneTodas = true;
    for (const tipo of TIPOS) {
      const nota = getNota(matriculaId, momento, tipo);
      if (nota === "") { tieneTodas = false; break; }
      total += nota * PESOS[tipo];
    }
    return tieneTodas ? (Math.round(total * 100) / 100) : null;
  };

  // ── Calcular nota final ──
  const calcularNotaFinal = (matriculaId) => {
    let total = 0;
    for (let m = 1; m <= 3; m++) {
      const pm = calcularPromedioMomento(matriculaId, m);
      if (pm === null) return null;
      total += pm * PESOS_MOMENTO[m];
    }
    return Math.round(total * 100) / 100;
  };

  // ── Registrar nota ──
  const registrarNota = async (matriculaId, momento, tipo, nota) => {
    if (nota === "" || isNaN(nota)) return;
    const notaNum = parseFloat(nota);
    if (notaNum < 0 || notaNum > 5) { alert("La nota debe estar entre 0.0 y 5.0"); return; }
    setGuardandoNota(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/calificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          matriculaId: String(matriculaId),
          momento: String(momento),
          tipo,
          nota: String(notaNum),
        }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCalificacionesGrupo(prev => {
        const existe = prev.findIndex(c => c.matricula.id === matriculaId && c.momento === momento && c.tipo === tipo);
        if (existe >= 0) {
          const nuevas = [...prev];
          nuevas[existe] = data;
          return nuevas;
        }
        return [...prev, data];
      });
    } catch {
      alert("No se pudo guardar la nota");
    } finally {
      setGuardandoNota(false);
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/profesores/${id}`, {
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
      const response = await fetch(`http://localhost:8081/api/profesores/${id}`, {
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

  const handleLogout = () => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); };

  const iniciales = perfil
    ? `${perfil.nombreCompleto?.nombres?.[0] ?? ""}${perfil.nombreCompleto?.apellidos?.[0] ?? ""}`
    : "PR";

  const colorNota = (nota) => {
    if (nota === null || nota === "") return {};
    const n = parseFloat(nota);
    if (n >= 3.0) return { background: "#EAF3DE", color: "#27500A" };
    if (n >= 2.0) return { background: "#FAEEDA", color: "#633806" };
    return { background: "#FCEBEB", color: "#791F1F" };
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
    { id: "grupos", label: "Mis grupos" },
    { id: "calificaciones", label: "Calificaciones" },
  ];

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
            <p style={{ margin: 0, fontSize: "12px", color: textoS }}>Profesor</p>
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
              { label: "Grupos activos", value: grupos.filter(g => g.estado === "ACTIVO").length },
              { label: "Total estudiantes", value: matriculasGrupo.length },
            ].map(m => (
              <div key={m.label} style={{ background: metricaBg, borderRadius: "8px", padding: "10px 14px" }}>
                <p style={{ margin: "0 0 2px", fontSize: "11px", color: textoS }}>{m.label}</p>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: "500", color: textoP }}>{m.value}</p>
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
                  { label: "Título profesional", value: perfil?.tituloProfesional, key: "tituloProfesional" },
                  { label: "Especialización", value: perfil?.especializacion, key: "especializacion" },
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
                  { label: "Materias dictando", value: grupos.filter(g => g.estado === "ACTIVO").length },
                  { label: "Total grupos", value: grupos.length },
                  { label: "Estudiantes activos", value: matriculasGrupo.length },
                ].map(m => (
                  <div key={m.label} style={{ background: metricaBg, borderRadius: "8px", padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS }}>{m.label}</p>
                    <p style={{ margin: 0, fontSize: "22px", fontWeight: "500", color: textoP }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GRUPOS ── */}
          {seccion === "grupos" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Mis grupos</h2>
              {grupos.length === 0 ? (
                <p style={{ color: textoS, fontSize: "14px" }}>No tienes grupos asignados aún.</p>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {grupos.map(grupo => (
                    <div key={grupo.id} style={{ background: darkMode ? "#333" : "var(--color-primario)", border: cardBorder, borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: "0 0 4px", fontWeight: "500", fontSize: "15px", color: textoP }}>{grupo.nombre}</p>
                        <p style={{ margin: "0 0 2px", fontSize: "13px", color: textoS }}>{grupo.materia?.nombre}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: textoS, opacity: 0.8 }}>Semestre: {grupo.semestre ?? "—"} · Cupo: {grupo.cupoMaximo ?? "—"}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: grupo.estado === "ACTIVO" ? "#EAF3DE" : "#FCEBEB", color: grupo.estado === "ACTIVO" ? "#27500A" : "#791F1F" }}>{grupo.estado}</span>
                        <button
                          onClick={() => { seleccionarGrupo(grupo); setSeccion("calificaciones"); }}
                          style={{ ...btnPrimario, padding: "6px 14px", fontSize: "12px" }}
                        >
                          Ver calificaciones
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CALIFICACIONES ── */}
          {seccion === "calificaciones" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "500", color: textoP }}>
                  Calificaciones {grupoSeleccionado ? `— ${grupoSeleccionado.nombre}` : ""}
                </h2>
              </div>

              {/* Selector de grupo */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "12px", color: textoS, fontWeight: "500" }}>Selecciona un grupo</p>
                <select
                  value={grupoSeleccionado?.id ?? ""}
                  onChange={e => { const g = grupos.find(gr => gr.id === parseInt(e.target.value)); if (g) seleccionarGrupo(g); }}
                  style={{ ...inputStyle, maxWidth: "360px" }}
                >
                  <option value="">— Selecciona un grupo —</option>
                  {grupos.filter(g => g.estado === "ACTIVO").map(g => (
                    <option key={g.id} value={g.id}>{g.nombre} — {g.materia?.nombre}</option>
                  ))}
                </select>
              </div>

              {grupoSeleccionado && (
                <>
                  {/* Selector de momento */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                    {[1, 2, 3].map(m => (
                      <button
                        key={m}
                        onClick={() => setMomentoActivo(m)}
                        style={{
                          padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500",
                          background: momentoActivo === m ? textoS : cardBg,
                          color: momentoActivo === m ? (darkMode ? "#1a1a1a" : "white") : textoP,
                          border: momentoActivo === m ? "none" : cardBorder,
                        }}
                      >
                        Momento {m} ({m === 3 ? "40%" : "30%"})
                      </button>
                    ))}
                  </div>

                  {loadingGrupo ? (
                    <p style={{ color: textoS, fontSize: "14px" }}>Cargando estudiantes...</p>
                  ) : matriculasGrupo.length === 0 ? (
                    <p style={{ color: textoS, fontSize: "14px" }}>No hay estudiantes matriculados en este grupo.</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "var(--color-secundario)", color: "white" }}>
                            <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: "500" }}>Estudiante</th>
                            {TIPOS.map(tipo => (
                              <th key={tipo} style={{ padding: "10px 12px", textAlign: "center", fontWeight: "500" }}>
                                {TIPOS_LABEL[tipo]}
                                <span style={{ display: "block", fontSize: "10px", opacity: 0.8 }}>
                                  {tipo === "EXAMEN_FINAL" ? "40%" : "20%"}
                                </span>
                              </th>
                            ))}
                            <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "500" }}>Promedio M{momentoActivo}</th>
                            <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "500" }}>Nota final</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matriculasGrupo.map(matricula => {
                            const promedioMomento = calcularPromedioMomento(matricula.id, momentoActivo);
                            const notaFinal = calcularNotaFinal(matricula.id);
                            return (
                              <tr key={matricula.id} style={{ borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                                <td style={{ padding: "10px 12px", color: textoP, fontWeight: "500" }}>
                                  {matricula.estudiante?.nombreCompleto?.nombres} {matricula.estudiante?.nombreCompleto?.apellidos}
                                </td>
                                {TIPOS.map(tipo => {
                                  const notaActual = getNota(matricula.id, momentoActivo, tipo);
                                  return (
                                    <td key={tipo} style={{ padding: "8px 12px", textAlign: "center" }}>
                                      <input
                                        type="number"
                                        min="0" max="5" step="0.1"
                                        defaultValue={notaActual}
                                        onBlur={e => registrarNota(matricula.id, momentoActivo, tipo, e.target.value)}
                                        style={{
                                          width: "64px", padding: "4px 6px", textAlign: "center",
                                          border: `1px solid ${darkMode ? "rgba(93,206,165,0.3)" : "rgba(0,79,57,0.3)"}`,
                                          borderRadius: "6px", fontSize: "13px",
                                          background: darkMode ? "#333" : "white",
                                          color: textoP,
                                        }}
                                      />
                                    </td>
                                  );
                                })}
                                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                  {promedioMomento !== null ? (
                                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", ...colorNota(promedioMomento) }}>
                                      {promedioMomento.toFixed(1)}
                                    </span>
                                  ) : <span style={{ color: textoS, fontSize: "12px" }}>—</span>}
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                  {notaFinal !== null ? (
                                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", ...colorNota(notaFinal) }}>
                                      {notaFinal.toFixed(2)}
                                    </span>
                                  ) : <span style={{ color: textoS, fontSize: "12px" }}>—</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <p style={{ margin: "12px 0 0", fontSize: "12px", color: textoS }}>
                        Las notas se guardan automáticamente al salir del campo. Escala: 0.0 a 5.0
                      </p>
                    </div>
                  )}
                </>
              )}

              {!grupoSeleccionado && (
                <div style={{ textAlign: "center", padding: "40px", color: textoS, fontSize: "14px", border: cardBorder, borderRadius: "12px" }}>
                  Selecciona un grupo para ver y registrar calificaciones.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default ProfesorDashboard;
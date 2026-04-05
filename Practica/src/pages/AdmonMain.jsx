import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AdmonMain = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const fileInputRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();

  // ── Estados principales ──
  const [perfil, setPerfil] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [seccion, setSeccion] = useState("usuarios");

  // ── Estados de programas ──
  const [modalPrograma, setModalPrograma] = useState(false);
  const [programaEditando, setProgramaEditando] = useState(null);
  const [formPrograma, setFormPrograma] = useState({ nombre: "", descripcion: "", modalidad: "" });

  // ── Estados de materias expandidas por programa ──
  const [programaExpandido, setProgramaExpandido] = useState(null);
  const [materiasMap, setMateriasMap] = useState({});
  const [programaActivo, setProgramaActivo] = useState(null);
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");

  // ── Estados del catálogo global de materias ──
  const [catalogoMaterias, setCatalogoMaterias] = useState([]);
  const [modalMateria, setModalMateria] = useState(false);
  const [materiaEditando, setMateriaEditando] = useState(null);
  const [formMateria, setFormMateria] = useState({ nombre: "" });

  // ── Estilos dinámicos ──
  const bg = "var(--color-primario)";
  const cardBg = darkMode ? "#2a2a2a" : "white";
  const cardBorder = darkMode ? "1px solid rgba(93,206,165,0.2)" : "1px solid rgba(0,79,57,0.15)";
  const textoP = "var(--color-acento)";
  const textoS = "var(--color-secundario)";
  const metricaBg = darkMode ? "#333" : "var(--color-primario)";
  const tableBg = darkMode ? "#1e1e1e" : "white";
  const theadBg = "var(--color-secundario)";
  const trHover = darkMode ? "#333" : "#f9f9f9";
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
        const [perfilRes, usuariosRes, programasRes, materiasRes] = await Promise.all([
          fetch(`http://localhost:8081/api/administradores/${id}`, { headers }),
          fetch("http://localhost:8081/api/usuarios", { headers }),
          fetch("http://localhost:8081/api/programas", { headers }),
          fetch("http://localhost:8081/api/materias", { headers }),
        ]);
        if (!perfilRes.ok) throw new Error("Error al cargar el perfil");
        if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
        if (!programasRes.ok) throw new Error("Error al cargar programas");
        if (!materiasRes.ok) throw new Error("Error al cargar materias");
        const perfilData = await perfilRes.json();
        const usuariosData = await usuariosRes.json();
        const programasData = await programasRes.json();
        const materiasData = await materiasRes.json();
        setPerfil(perfilData);
        setUsuarios(usuariosData);
        setProgramas(programasData);
        setCatalogoMaterias(materiasData);
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
    fetchData();
  }, [id]);

  // ── Foto del admin ──
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/administradores/${id}`, {
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

  // ── Guardar edición de perfil ──
  const handleGuardarEdicion = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/administradores/${id}`, {
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

  // ── Cambiar rol ──
  const cambiarRol = async (usuarioId, nuevoRol) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/usuarios/${usuarioId}/rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      if (!response.ok) throw new Error();
      const usuarioActualizado = await response.json();
      setUsuarios(prev => prev.map(u => u.id === usuarioId ? usuarioActualizado : u));
    } catch { alert("No se pudo cambiar el rol."); }
  };

  // ── Enviar correo ──
  const enviarCorreo = async (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario.rol) { alert("Debes asignar un rol antes de enviar el correo."); return; }
    if (usuario.estado !== "ACTIVO") { alert("El usuario debe estar ACTIVO."); return; }
    if (usuario.rol === "ESTUDIANTE" && programas.filter(p => p.estado === "ACTIVO").length === 0) {
      alert("Debes crear al menos un programa académico antes de enviar el correo a un estudiante.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/usuarios/${usuarioId}/enviar-correo`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setUsuarios(prev => prev.map(u =>
        u.id === usuarioId ? { ...u, envioCorreo: "ENVIADO", registro: "PENDIENTE" } : u
      ));
      alert("Correo enviado correctamente.");
    } catch { alert("No se pudo enviar el correo."); }
  };

  // ── Programas: abrir modal crear ──
  const abrirCrearPrograma = () => {
    setProgramaEditando(null);
    setFormPrograma({ nombre: "", descripcion: "", modalidad: "" });
    setModalPrograma(true);
  };

  // ── Programas: abrir modal editar ──
  const abrirEditarPrograma = (programa) => {
    setProgramaEditando(programa);
    setFormPrograma({
      nombre: programa.nombre,
      descripcion: programa.descripcion ?? "",
      modalidad: programa.modalidad ?? "",
    });
    setModalPrograma(true);
  };

  // ── Programas: guardar ──
  const guardarPrograma = async () => {
    if (!formPrograma.nombre.trim()) { alert("El nombre del programa es obligatorio"); return; }
    try {
      const token = localStorage.getItem("token");
      const url = programaEditando
        ? `http://localhost:8081/api/programas/${programaEditando.id}`
        : "http://localhost:8081/api/programas";
      const method = programaEditando ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formPrograma),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (programaEditando) {
        setProgramas(prev => prev.map(p => p.id === data.id ? data : p));
      } else {
        setProgramas(prev => [...prev, data]);
      }
      setModalPrograma(false);
      alert(programaEditando ? "Programa actualizado" : "Programa creado correctamente");
    } catch { alert("No se pudo guardar el programa"); }
  };

  // ── Programas: eliminar ──
  const eliminarPrograma = async (programaId) => {
    if (!confirm("¿Estás seguro de desactivar este programa?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/programas/${programaId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setProgramas(prev => prev.map(p => p.id === programaId ? { ...p, estado: "INACTIVO" } : p));
      alert("Programa desactivado correctamente");
    } catch { alert("No se pudo desactivar el programa"); }
  };

  // ── Materias por programa: toggle expandir ──
  const togglePrograma = async (programa) => {
    if (programaExpandido === programa.id) { setProgramaExpandido(null); return; }
    setProgramaExpandido(programa.id);
    setMostrarAsignar(false);
    if (!materiasMap[programa.id]) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/api/materias/programa/${programa.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        setMateriasMap(prev => ({ ...prev, [programa.id]: data }));
      } catch { alert("No se pudieron cargar las materias"); }
    }
  };

  // ── Materias por programa: asignar ──
  const asignarMateria = async (programaId) => {
    if (!materiaSeleccionada) { alert("Selecciona una materia"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/materias/programa/${programaId}/asignar/${materiaSeleccionada}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "No se pudo asignar la materia");
        return;
      }
      const data = await response.json();
      setMateriasMap(prev => ({
        ...prev,
        [programaId]: [...(prev[programaId] ?? []), data],
      }));
      setMateriaSeleccionada("");
      setMostrarAsignar(false);
    } catch { alert("No se pudo asignar la materia"); }
  };

  // ── Materias por programa: quitar ──
  const quitarMateria = async (programaId, materiaId) => {
    if (!confirm("¿Quitar esta materia del programa?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/materias/programa/${programaId}/quitar/${materiaId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error();
      setMateriasMap(prev => ({
        ...prev,
        [programaId]: prev[programaId].filter(pm => pm.materia.id !== materiaId),
      }));
    } catch { alert("No se pudo quitar la materia"); }
  };

  // ── Catálogo global: abrir modal crear ──
  const abrirCrearMateria = () => {
    setMateriaEditando(null);
    setFormMateria({ nombre: "" });
    setModalMateria(true);
  };

  // ── Catálogo global: abrir modal editar ──
  const abrirEditarMateria = (materia) => {
    setMateriaEditando(materia);
    setFormMateria({ nombre: materia.nombre });
    setModalMateria(true);
  };

  // ── Catálogo global: guardar ──
  const guardarMateria = async () => {
    if (!formMateria.nombre.trim()) { alert("El nombre es obligatorio"); return; }
    try {
      const token = localStorage.getItem("token");
      const url = materiaEditando
        ? `http://localhost:8081/api/materias/${materiaEditando.id}`
        : "http://localhost:8081/api/materias";
      const method = materiaEditando ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: formMateria.nombre }),
      });
      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "No se pudo guardar");
        return;
      }
      const data = await response.json();
      if (materiaEditando) {
        setCatalogoMaterias(prev => prev.map(m => m.id === data.id ? data : m));
      } else {
        setCatalogoMaterias(prev => [...prev, data]);
      }
      setModalMateria(false);
      alert(materiaEditando ? "Materia actualizada" : "Materia creada correctamente");
    } catch { alert("No se pudo guardar la materia"); }
  };

  // ── Catálogo global: desactivar ──
  const desactivarMateria = async (materiaId) => {
    if (!confirm("¿Desactivar esta materia del catálogo?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/materias/${materiaId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setCatalogoMaterias(prev => prev.map(m =>
        m.id === materiaId ? { ...m, estado: "INACTIVO" } : m
      ));
    } catch { alert("No se pudo desactivar la materia"); }
  };

  // ── Logout ──
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const iniciales = perfil
    ? `${perfil.nombreCompleto?.nombres?.[0] ?? ""}${perfil.nombreCompleto?.apellidos?.[0] ?? ""}`
    : "AD";

  if (loading) return (
    <main style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: textoS }}>Cargando...</p>
    </main>
  );

  if (error) return (
    <main style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "red" }}>{error}</p>
    </main>
  );

  const secciones = [
    { id: "usuarios", label: "Base de datos" },
    { id: "programas", label: "Programas académicos" },
    { id: "materias", label: "Catálogo de materias" },
    { id: "perfil", label: "Mi perfil" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: bg, padding: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: textoS, fontSize: "22px", fontWeight: "500", margin: 0 }}>
          Sistema de Notas — Administración
        </h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={toggleDarkMode} style={btnSecundario}>
            {darkMode ? "☀ Modo claro" : "☾ Modo oscuro"}
          </button>
          <button onClick={handleLogout} style={btnSecundario}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
            <p style={{ margin: 0, fontSize: "12px", color: textoS }}>
              {perfil?.rol === "SUPER_ADMIN" ? "Super Administrador" : "Administrador"}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "11px", color: textoS, opacity: 0.7 }}>
              Clic en la foto para cambiarla
            </p>
          </div>

          {secciones.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} style={{
              background: seccion === item.id ? textoS : cardBg,
              color: seccion === item.id ? (darkMode ? "#1a1a1a" : "white") : textoP,
              border: cardBorder, borderRadius: "8px", padding: "10px 14px",
              textAlign: "left", cursor: "pointer", fontSize: "14px",
              fontWeight: seccion === item.id ? "500" : "400",
            }}>
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Total usuarios", value: usuarios.length },
              { label: "Activos", value: usuarios.filter(u => u.estado === "ACTIVO").length },
              { label: "Pendientes", value: usuarios.filter(u => u.registro !== "COMPLETO").length },
              { label: "Programas activos", value: programas.filter(p => p.estado === "ACTIVO").length },
              { label: "Materias en catálogo", value: catalogoMaterias.filter(m => m.estado === "ACTIVO").length },
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

          {/* ── USUARIOS ── */}
          {seccion === "usuarios" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>
                Base de datos general
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", background: tableBg }}>
                  <thead>
                    <tr style={{ background: theadBg, color: "white" }}>
                      {["ID", "Fecha Registro", "Actualización", "Nombre", "Apellido", "Tipo Doc", "Documento", "Correo", "Celular", "Contraseña", "Confirmación", "Rol", "Estado", "Correo", "Registro"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "left", fontWeight: "500", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuario => (
                      <tr key={usuario.id}
                        style={{ borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}
                        onMouseEnter={e => e.currentTarget.style.background = trHover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.id}</td>
                        <td style={{ padding: "8px 12px", color: textoP, whiteSpace: "nowrap" }}>
                          {usuario.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleString("es-CO") : "—"}
                        </td>
                        <td style={{ padding: "8px 12px", color: textoP, whiteSpace: "nowrap" }}>
                          {usuario.fechaModificacion ? new Date(usuario.fechaModificacion).toLocaleString("es-CO") : "—"}
                        </td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.nombreCompleto?.nombres ?? "—"}</td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.nombreCompleto?.apellidos ?? "—"}</td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.tipoDocumento ?? "—"}</td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.documento ?? "—"}</td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.correo ?? "—"}</td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.numeroCelular ?? "—"}</td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.contraseña ?? "—"}</td>
                        <td style={{ padding: "8px 12px", color: textoP }}>{usuario.contraseñaConfirmada ?? "—"}</td>
                        <td style={{ padding: "8px 12px" }}>
                          <select
                            value={usuario.rol ?? ""}
                            onChange={e => cambiarRol(usuario.id, e.target.value)}
                            disabled={usuario.envioCorreo === "ENVIADO" || usuario.rol === "SUPER_ADMIN"}
                            style={{ border: `1px solid ${textoS}`, borderRadius: "6px", padding: "4px 8px", fontSize: "12px", background: darkMode ? "#333" : "white", color: textoP, cursor: "pointer" }}
                          >
                            <option value="" disabled>— Pendiente —</option>
                            <option value="ESTUDIANTE">Estudiante</option>
                            <option value="PROFESOR">Profesor</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                            {usuario.rol === "SUPER_ADMIN" && <option value="SUPER_ADMIN">Super Admin</option>}
                          </select>
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500",
                            background: usuario.estado === "ACTIVO" ? "#EAF3DE" : "#FCEBEB",
                            color: usuario.estado === "ACTIVO" ? "#27500A" : "#791F1F",
                          }}>
                            {usuario.estado ?? "INACTIVO"}
                          </span>
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          <button
                            onClick={() => enviarCorreo(usuario.id)}
                            disabled={!usuario.rol || usuario.registro === "COMPLETO"}
                            style={{
                              padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "500", border: "none",
                              cursor: !usuario.rol || usuario.registro === "COMPLETO" ? "not-allowed" : "pointer",
                              background: usuario.registro === "COMPLETO" ? "#888" : usuario.envioCorreo === "ENVIADO" ? "#EF9F27" : "#E24B4A",
                              color: "white", opacity: !usuario.rol || usuario.registro === "COMPLETO" ? 0.6 : 1, whiteSpace: "nowrap",
                            }}
                          >
                            {usuario.registro === "COMPLETO" ? "Completo" : usuario.envioCorreo === "ENVIADO" ? "Reenviar" : "Enviar correo"}
                          </button>
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500",
                            background: usuario.registro === "COMPLETO" ? "#EAF3DE" : usuario.registro === "PENDIENTE" ? "#EEEDFE" : "#F1EFE8",
                            color: usuario.registro === "COMPLETO" ? "#27500A" : usuario.registro === "PENDIENTE" ? "#3C3489" : "#444441",
                          }}>
                            {usuario.registro ?? "INCOMPLETO"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usuarios.length === 0 && (
                  <p style={{ textAlign: "center", color: textoS, marginTop: "24px", fontSize: "14px" }}>
                    No hay usuarios registrados aún.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── PROGRAMAS ACADÉMICOS ── */}
          {seccion === "programas" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "500", color: textoP }}>Programas académicos</h2>
                <button onClick={abrirCrearPrograma} style={btnPrimario}>+ Nuevo programa</button>
              </div>

              {modalPrograma && (
                <div style={{ background: darkMode ? "#1a1a1a" : "#f5f5f5", border: cardBorder, borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "500", color: textoP }}>
                    {programaEditando ? "Editar programa" : "Nuevo programa"}
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS, fontWeight: "500" }}>Nombre <span style={{ color: "red" }}>*</span></p>
                      <input value={formPrograma.nombre} onChange={e => setFormPrograma({ ...formPrograma, nombre: e.target.value })} placeholder="Ej: Ingeniería de Sistemas" style={inputStyle} />
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS, fontWeight: "500" }}>Modalidad <span style={{ fontSize: "11px", opacity: 0.6 }}>(opcional)</span></p>
                      <select value={formPrograma.modalidad} onChange={e => setFormPrograma({ ...formPrograma, modalidad: e.target.value })} style={inputStyle}>
                        <option value="">— Sin modalidad —</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Mixto">Mixto</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS, fontWeight: "500" }}>Descripción <span style={{ fontSize: "11px", opacity: 0.6 }}>(opcional)</span></p>
                    <textarea value={formPrograma.descripcion} onChange={e => setFormPrograma({ ...formPrograma, descripcion: e.target.value })} placeholder="Descripción del programa..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => setModalPrograma(false)} style={btnSecundario}>Cancelar</button>
                    <button onClick={guardarPrograma} style={btnPrimario}>{programaEditando ? "Guardar cambios" : "Crear programa"}</button>
                  </div>
                </div>
              )}

              {programas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: textoS, fontSize: "14px", border: cardBorder, borderRadius: "12px" }}>
                  No hay programas creados aún. Crea el primero para habilitar el registro de estudiantes.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: theadBg, color: "white" }}>
                      {["", "ID", "Nombre", "Modalidad", "Descripción", "Estado", "Acciones"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: "500" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {programas.map(programa => (
                      <>
                        <tr key={programa.id}
                          style={{ borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}
                          onMouseEnter={e => e.currentTarget.style.background = trHover}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "10px 8px", textAlign: "center" }}>
                            <button onClick={() => togglePrograma(programa)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: textoS }}>
                              {programaExpandido === programa.id ? "▼" : "▶"}
                            </button>
                          </td>
                          <td style={{ padding: "10px 12px", color: textoP }}>{programa.id}</td>
                          <td style={{ padding: "10px 12px", color: textoP, fontWeight: "500" }}>{programa.nombre}</td>
                          <td style={{ padding: "10px 12px", color: textoP }}>{programa.modalidad ?? "—"}</td>
                          <td style={{ padding: "10px 12px", color: textoP, maxWidth: "200px" }}>
                            {programa.descripcion ? programa.descripcion.length > 50 ? programa.descripcion.substring(0, 50) + "..." : programa.descripcion : "—"}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500",
                              background: programa.estado === "ACTIVO" ? "#EAF3DE" : "#FCEBEB",
                              color: programa.estado === "ACTIVO" ? "#27500A" : "#791F1F",
                            }}>{programa.estado}</span>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button onClick={() => abrirEditarPrograma(programa)} style={{ ...btnSecundario, padding: "4px 10px", fontSize: "12px" }}>Editar</button>
                              {programa.estado === "ACTIVO" && (
                                <button onClick={() => eliminarPrograma(programa.id)} style={{ background: "none", border: "1px solid #E24B4A", color: "#E24B4A", padding: "4px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>Desactivar</button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Materias del programa expandido */}
                        {programaExpandido === programa.id && (
                          <tr key={`mat-${programa.id}`}>
                            <td colSpan={7} style={{ padding: "0 0 0 40px", background: darkMode ? "#222" : "#f5faf8" }}>
                              <div style={{ padding: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "500", color: textoS }}>
                                    Materias asignadas a: {programa.nombre}
                                  </p>
                                  {programa.estado === "ACTIVO" && (
                                    <button
                                      onClick={() => { setProgramaActivo(programa); setMostrarAsignar(true); setMateriaSeleccionada(""); }}
                                      style={{ ...btnPrimario, padding: "4px 12px", fontSize: "12px" }}
                                    >
                                      + Asignar materia
                                    </button>
                                  )}
                                </div>

                                {/* Panel asignar materia */}
                                {mostrarAsignar && programaActivo?.id === programa.id && (
                                  <div style={{ background: darkMode ? "#2a2a2a" : "white", border: cardBorder, borderRadius: "8px", padding: "14px", marginBottom: "12px" }}>
                                    <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "500", color: textoP }}>
                                      Selecciona una materia del catálogo
                                    </p>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                      <select
                                        value={materiaSeleccionada}
                                        onChange={e => setMateriaSeleccionada(e.target.value)}
                                        style={{ ...inputStyle, flex: 1 }}
                                      >
                                        <option value="">— Selecciona una materia —</option>
                                        {catalogoMaterias
                                          .filter(m => m.estado === "ACTIVO")
                                          .filter(m => !(materiasMap[programa.id] ?? []).some(pm => pm.materia.id === m.id))
                                          .map(m => (
                                            <option key={m.id} value={m.id}>{m.nombre}</option>
                                          ))
                                        }
                                      </select>
                                      <button onClick={() => asignarMateria(programa.id)} style={{ ...btnPrimario, padding: "8px 14px" }}>Asignar</button>
                                      <button onClick={() => setMostrarAsignar(false)} style={{ ...btnSecundario, padding: "8px 14px" }}>Cancelar</button>
                                    </div>
                                    {catalogoMaterias.filter(m => m.estado === "ACTIVO").length === 0 && (
                                      <p style={{ margin: "8px 0 0", fontSize: "12px", color: textoS }}>
                                        No hay materias en el catálogo. Ve a "Catálogo de materias" para crear una.
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* Lista materias del programa */}
                                {!materiasMap[programa.id] ? (
                                  <p style={{ fontSize: "13px", color: textoS }}>Cargando...</p>
                                ) : materiasMap[programa.id].length === 0 ? (
                                  <p style={{ fontSize: "13px", color: textoS }}>No hay materias asignadas a este programa.</p>
                                ) : (
                                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                    <thead>
                                      <tr style={{ background: darkMode ? "#333" : "#e0f0ea" }}>
                                        <th style={{ padding: "8px 12px", textAlign: "left", color: textoS, fontWeight: "500" }}>ID</th>
                                        <th style={{ padding: "8px 12px", textAlign: "left", color: textoS, fontWeight: "500" }}>Nombre</th>
                                        <th style={{ padding: "8px 12px", textAlign: "left", color: textoS, fontWeight: "500" }}>Estado</th>
                                        <th style={{ padding: "8px 12px", textAlign: "left", color: textoS, fontWeight: "500" }}>Acciones</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {materiasMap[programa.id].map(pm => (
                                        <tr key={pm.id} style={{ borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                                          <td style={{ padding: "8px 12px", color: textoP }}>{pm.materia.id}</td>
                                          <td style={{ padding: "8px 12px", color: textoP }}>{pm.materia.nombre}</td>
                                          <td style={{ padding: "8px 12px" }}>
                                            <span style={{
                                              padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "500",
                                              background: pm.materia.estado === "ACTIVO" ? "#EAF3DE" : "#FCEBEB",
                                              color: pm.materia.estado === "ACTIVO" ? "#27500A" : "#791F1F",
                                            }}>{pm.materia.estado}</span>
                                          </td>
                                          <td style={{ padding: "8px 12px" }}>
                                            <button
                                              onClick={() => quitarMateria(programa.id, pm.materia.id)}
                                              style={{ background: "none", border: "1px solid #E24B4A", color: "#E24B4A", padding: "3px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}
                                            >
                                              Quitar
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── CATÁLOGO DE MATERIAS ── */}
          {seccion === "materias" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "500", color: textoP }}>Catálogo de materias</h2>
                <button onClick={abrirCrearMateria} style={btnPrimario}>+ Nueva materia</button>
              </div>

              {modalMateria && (
                <div style={{ background: darkMode ? "#1a1a1a" : "#f5f5f5", border: cardBorder, borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "500", color: textoP }}>
                    {materiaEditando ? "Editar materia" : "Nueva materia"}
                  </h3>
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS, fontWeight: "500" }}>Nombre <span style={{ color: "red" }}>*</span></p>
                    <input
                      value={formMateria.nombre}
                      onChange={e => setFormMateria({ nombre: e.target.value })}
                      placeholder="Ej: Cálculo diferencial"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => setModalMateria(false)} style={btnSecundario}>Cancelar</button>
                    <button onClick={guardarMateria} style={btnPrimario}>{materiaEditando ? "Guardar cambios" : "Crear materia"}</button>
                  </div>
                </div>
              )}

              {catalogoMaterias.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: textoS, fontSize: "14px", border: cardBorder, borderRadius: "12px" }}>
                  No hay materias en el catálogo. Crea la primera para poder asignarla a los programas.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: theadBg, color: "white" }}>
                      {["ID", "Nombre", "Estado", "Acciones"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: "500" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {catalogoMaterias.map(materia => (
                      <tr key={materia.id}
                        style={{ borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}
                        onMouseEnter={e => e.currentTarget.style.background = trHover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "10px 12px", color: textoP }}>{materia.id}</td>
                        <td style={{ padding: "10px 12px", color: textoP, fontWeight: "500" }}>{materia.nombre}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500",
                            background: materia.estado === "ACTIVO" ? "#EAF3DE" : "#FCEBEB",
                            color: materia.estado === "ACTIVO" ? "#27500A" : "#791F1F",
                          }}>{materia.estado}</span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => abrirEditarMateria(materia)} style={{ ...btnSecundario, padding: "4px 10px", fontSize: "12px" }}>Editar</button>
                            {materia.estado === "ACTIVO" && (
                              <button onClick={() => desactivarMateria(materia.id)} style={{ background: "none", border: "1px solid #E24B4A", color: "#E24B4A", padding: "4px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>Desactivar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

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
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default AdmonMain;
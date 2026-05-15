import { useState } from "react";
import { BarChart3, BookOpen, GraduationCap, Users, Building2, Shield, TrendingUp, TrendingDown } from "lucide-react";
import StatCard from "../components/charts/StatCard";
import PieChartCard from "../components/charts/PieChartCard";
import {
  useResumen,
  useDistribucionProgramas,
  useModalidad,
  useRanking,
  useProgramasList,
} from "../hooks/useAnalytics";

export default function AnalyticsDashboard({ refreshKey = 0 }) {
  const [programaFiltro, setProgramaFiltro] = useState("");
  const filters = programaFiltro ? { programa_id: Number(programaFiltro) } : {};

  const { resumen } = useResumen(refreshKey);
  const { programasList } = useProgramasList(refreshKey);
  const { programas, loading: loadP, error: errP } = useDistribucionProgramas(refreshKey);
  const { modalidad, loading: loadMod, error: errMod } = useModalidad(filters, refreshKey);
  const { ranking, loading: loadRank, error: errRank } = useRanking(filters, refreshKey);

  const selectStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    background: "white",
    minWidth: "220px",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#111827" }}>Reportes Académicos</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>Dashboard de análisis académico</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>Filtrar por programa:</label>
          <select value={programaFiltro} onChange={e => setProgramaFiltro(e.target.value)} style={selectStyle}>
            <option value="">Todos los programas</option>
            {(programasList || []).map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "14px" }}>
          <StatCard title="Estudiantes" value={resumen?.total_estudiantes ?? "—"} icon={Users} color="blue" />
          <StatCard title="Profesores" value={resumen?.total_profesores ?? "—"} icon={GraduationCap} color="green" />
          <StatCard title="Administrativos" value={resumen?.total_administrativos ?? "—"} icon={Shield} color="purple" />
          <StatCard title="Programas" value={resumen?.total_programas ?? "—"} icon={Building2} color="amber" />
          <StatCard title="Materias" value={resumen?.total_materias ?? "—"} icon={BookOpen} color="rose" />
          <StatCard title="Grupos" value={resumen?.total_grupos ?? "—"} icon={BarChart3} color="cyan" />
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "18px" }}>
          <PieChartCard
            title="Estudiantes por Programa"
            data={programas}
            dataKey="cantidad_estudiantes"
            loading={loadP}
            error={errP}
            height={400}
          />
          <PieChartCard
            title="Estudiantes por Modalidad"
            data={modalidad}
            dataKey="cantidad_estudiantes"
            nameKey="modalidad"
            loading={loadMod}
            error={errMod}
            height={400}
          />
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "18px" }}>
          <div style={{ borderRadius: "12px", border: "1px solid #e5e7eb", background: "white", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <TrendingUp color="#22c55e" size={20} />
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1f2937" }}>Top 10 Mejores Estudiantes</h3>
            </div>
            {loadRank ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[1,2,3,4,5].map(i => <div key={i} style={{ height: "24px", borderRadius: "6px", background: "#f3f4f6" }} />)}
              </div>
            ) : errRank ? (
              <p style={{ color: "#ef4444", fontSize: "13px" }}>{errRank}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(ranking?.mejores || []).map((est, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", background: i < 3 ? "#f0fdf4" : "#f9fafb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "50%", fontSize: "12px", fontWeight: "700", background: i === 0 ? "#22c55e" : i === 1 ? "#86efac" : i === 2 ? "#bbf7d0" : "#e5e7eb", color: i < 3 ? "white" : "#374151" }}>{i + 1}</span>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "13px", color: "#374151" }}>{est.nombres} {est.apellidos}</span>
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>{est.programa ?? "—"}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#16a34a" }}>{est.promedio?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ borderRadius: "12px", border: "1px solid #e5e7eb", background: "white", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <TrendingDown color="#ef4444" size={20} />
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1f2937" }}>Top 10 Peores Estudiantes</h3>
            </div>
            {loadRank ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[1,2,3,4,5].map(i => <div key={i} style={{ height: "24px", borderRadius: "6px", background: "#f3f4f6" }} />)}
              </div>
            ) : errRank ? (
              <p style={{ color: "#ef4444", fontSize: "13px" }}>{errRank}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(ranking?.peores || []).map((est, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", background: i < 3 ? "#fef2f2" : "#f9fafb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "50%", fontSize: "12px", fontWeight: "700", background: i === 0 ? "#ef4444" : i === 1 ? "#fca5a5" : i === 2 ? "#fecaca" : "#e5e7eb", color: i < 3 ? "white" : "#374151" }}>{i + 1}</span>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "13px", color: "#374151" }}>{est.nombres} {est.apellidos}</span>
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>{est.programa ?? "—"}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#dc2626" }}>{est.promedio?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";

export function useAnalyticsData(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

export function useResumen(refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.resumen(), [refreshKey]);
  return { resumen: state.data, ...state };
}

export function useDesempenoMaterias(filters = {}, refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.desempeno.materias(filters), [JSON.stringify(filters), refreshKey]);
  return { materias: state.data, ...state };
}

export function useDistribucionProgramas(refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.distribucion.programas(), [refreshKey]);
  return { programas: state.data, ...state };
}

export function useRanking(filters = {}, refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.desempeno.ranking(filters), [JSON.stringify(filters), refreshKey]);
  return { ranking: state.data, ...state };
}

export function useOcupacionGrupos(filters = {}, refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.distribucion.ocupacionGrupos(filters), [JSON.stringify(filters), refreshKey]);
  return { grupos: state.data, ...state };
}

export function useProfesoresDesempeno(filters = {}, refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.profesores.desempeno(filters), [JSON.stringify(filters), refreshKey]);
  return { profesores: state.data, ...state };
}

export function useProgramasList(refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.programasList(), [refreshKey]);
  return { programasList: state.data, ...state };
}

export function usePromedioProgramas(filters = {}, refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.desempeno.promedioProgramas(filters), [JSON.stringify(filters), refreshKey]);
  return { promediosProgramas: state.data, ...state };
}

export function useMatriculadosAno(filters = {}, refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.distribucion.matriculadosAno(filters), [JSON.stringify(filters), refreshKey]);
  return { matriculadosAno: state.data, ...state };
}

export function useModalidad(filters = {}, refreshKey = 0) {
  const state = useAnalyticsData(() => analyticsService.distribucion.modalidad(filters), [JSON.stringify(filters), refreshKey]);
  return { modalidad: state.data, ...state };
}

import api from "./api";

const BASE = "/api/analytics";

const _get = (url, params) => api.get(url, { params }).then((r) => r.data);

export const analyticsService = {
  resumen: () => _get(`${BASE}/resumen`),

  programasList: () => _get(`${BASE}/programas`),
  annosList: () => _get(`${BASE}/annos`),

  desempeno: {
    estudiantes: (params) => _get(`${BASE}/desempeno/estudiantes`, params),
    tiposEvaluacion: () => _get(`${BASE}/desempeno/tipos-evaluacion`),
    materias: (params) => _get(`${BASE}/desempeno/materias`, params),
    grupos: () => _get(`${BASE}/desempeno/grupos`),
    ranking: (params) => _get(`${BASE}/desempeno/ranking`, params),
    bajoRendimiento: (params) => _get(`${BASE}/desempeno/bajo-rendimiento`, params),
    promedioProgramas: (params) => _get(`${BASE}/desempeno/promedio-programas`, params),
  },

  distribucion: {
    programas: () => _get(`${BASE}/distribucion/programas`),
    semestres: () => _get(`${BASE}/distribucion/semestres`),
    ocupacionGrupos: (params) => _get(`${BASE}/distribucion/ocupacion-grupos`, params),
    materiasDemandadas: () => _get(`${BASE}/distribucion/materias-demandadas`),
    modalidad: (params) => _get(`${BASE}/distribucion/modalidad`, params),
    matriculadosAno: (params) => _get(`${BASE}/distribucion/matriculados-ano`, params),
  },

  profesores: {
    cargaAcademica: () => _get(`${BASE}/profesores/carga-academica`),
    estudiantes: () => _get(`${BASE}/profesores/estudiantes`),
    desempeno: (params) => _get(`${BASE}/profesores/desempeno`, params),
  },

  health: () => _get(`${BASE}/health`),
};

import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Extrae un mensaje legible sin importar la forma del error que devuelva el backend
// (GlobalExceptionHandler devuelve { campo: "mensaje" } en validaciones
// o { error: "mensaje" } en IllegalArgumentException)
export function extraerMensajeError(err) {
  if (err.code === 'ERR_NETWORK') {
    return 'No se pudo conectar con el backend en http://localhost:8080. ¿Está corriendo la app de Spring Boot?'
  }
  const data = err?.response?.data
  if (!data) return 'Ocurrió un error inesperado.'
  if (typeof data === 'string') return data
  if (data.error) return data.error
  const valores = Object.values(data)
  if (valores.length > 0) return valores.join(' · ')
  return 'Ocurrió un error inesperado.'
}

// --- Clientes ---
export const ClientesAPI = {
  listar: () => api.get('/clientes').then(r => r.data),
  crear: (data) => api.post('/clientes', data).then(r => r.data),
  actualizar: (id, data) => api.put(`/clientes/${id}`, data).then(r => r.data),
  eliminar: (id) => api.delete(`/clientes/${id}`),
}

// --- Técnicos ---
export const TecnicosAPI = {
  listar: () => api.get('/tecnicos').then(r => r.data),
  crear: (data) => api.post('/tecnicos', data).then(r => r.data),
  actualizar: (id, data) => api.put(`/tecnicos/${id}`, data).then(r => r.data),
  eliminar: (id) => api.delete(`/tecnicos/${id}`),
}

// --- Solicitudes ---
export const SolicitudesAPI = {
  listar: () => api.get('/solicitudes').then(r => r.data),
  crear: (data) => api.post('/solicitudes', data).then(r => r.data),
  actualizar: (id, data) => api.put(`/solicitudes/${id}`, data).then(r => r.data),
  eliminar: (id) => api.delete(`/solicitudes/${id}`),
  asignarTecnico: (id, idTecnico) => api.put(`/solicitudes/${id}/tecnico/${idTecnico}`).then(r => r.data),
  cambiarEstado: (id, estado) => api.put(`/solicitudes/${id}/estado`, null, { params: { estado } }).then(r => r.data),
}

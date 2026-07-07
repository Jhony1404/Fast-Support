import { useEffect, useState } from 'react'
import { SolicitudesAPI, TecnicosAPI, extraerMensajeError } from '../api'
import Panel from './Panel'

const SOLICITUD_VACIA = {
  cliente: { nombre: '', email: '', telefono: '', empresa: '' },
  descripcion: '',
  prioridad: 'MEDIA',
}

const ESTADOS = ['ABIERTA', 'EN_PROGRESO', 'RESUELTA', 'CERRADA']

const ESTADO_LABEL = {
  ABIERTA: 'Abierta',
  EN_PROGRESO: 'En progreso',
  RESUELTA: 'Resuelta',
  CERRADA: 'Cerrada',
}

function EstadoBadge({ estado }) {
  const clases = {
    ABIERTA: { color: 'var(--estado-abierta)', bg: 'var(--estado-abierta-bg)' },
    EN_PROGRESO: { color: 'var(--estado-progreso)', bg: 'var(--estado-progreso-bg)' },
    RESUELTA: { color: 'var(--estado-resuelta)', bg: 'var(--estado-resuelta-bg)' },
    CERRADA: { color: 'var(--estado-cerrada)', bg: 'var(--estado-cerrada-bg)' },
  }[estado] || { color: 'var(--text-mute)', bg: '#eee' }

  return (
    <span className="badge" style={{ color: clases.color, background: clases.bg }}>
      {ESTADO_LABEL[estado] || estado}
    </span>
  )
}

function PrioridadBadge({ prioridad }) {
  const clase = {
    ALTA: 'prio-alta',
    MEDIA: 'prio-media',
    BAJA: 'prio-baja',
  }[prioridad?.toUpperCase()] || 'prio-media'

  return <span className={`badge-prioridad ${clase}`}>{prioridad}</span>
}

export default function SolicitudesView({ onChangeCount }) {
  const [solicitudes, setSolicitudes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(SOLICITUD_VACIA)
  const [errorForm, setErrorForm] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [asignandoId, setAsignandoId] = useState(null)

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const [dataSolicitudes, dataTecnicos] = await Promise.all([
        SolicitudesAPI.listar(),
        TecnicosAPI.listar().catch(() => []),
      ])
      setSolicitudes(dataSolicitudes)
      setTecnicos(dataTecnicos)
      onChangeCount?.(dataSolicitudes.length)
    } catch (err) {
      setError(extraerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  function abrirCrear() {
    setEditando(null)
    setForm(SOLICITUD_VACIA)
    setErrorForm(null)
    setPanelAbierto(true)
  }

  function abrirEditar(s) {
    setEditando(s)
    setForm({
      cliente: { nombre: s.cliente?.nombre || '', email: s.cliente?.email || '', telefono: s.cliente?.telefono || '', empresa: s.cliente?.empresa || '' },
      descripcion: s.descripcion || '',
      prioridad: s.prioridad || 'MEDIA',
    })
    setErrorForm(null)
    setPanelAbierto(true)
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setErrorForm(null)
    try {
      if (editando) {
        await SolicitudesAPI.actualizar(editando.id, form)
      } else {
        await SolicitudesAPI.crear(form)
      }
      setPanelAbierto(false)
      await cargar()
    } catch (err) {
      setErrorForm(extraerMensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(s) {
    if (!confirm(`¿Eliminar la solicitud #${s.id}?`)) return
    try {
      await SolicitudesAPI.eliminar(s.id)
      await cargar()
    } catch (err) {
      setError(extraerMensajeError(err))
    }
  }

  async function asignarTecnico(solicitudId, idTecnico) {
    if (!idTecnico) return
    setAsignandoId(solicitudId)
    try {
      await SolicitudesAPI.asignarTecnico(solicitudId, idTecnico)
      await cargar()
    } catch (err) {
      setError(extraerMensajeError(err))
    } finally {
      setAsignandoId(null)
    }
  }

  async function cambiarEstado(solicitudId, estado) {
    try {
      await SolicitudesAPI.cambiarEstado(solicitudId, estado)
      await cargar()
    } catch (err) {
      setError(extraerMensajeError(err))
    }
  }

  return (
    <div>
      <div className="main-header">
        <div>
          <h1>Solicitudes</h1>
          <p>Tickets de soporte reportados por los clientes.</p>
        </div>
        <button className="btn-primary" onClick={abrirCrear}>+ Nueva solicitud</button>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      <div className="table-card">
        {cargando ? (
          <div className="loading-row">Cargando solicitudes…</div>
        ) : solicitudes.length === 0 ? (
          <div className="empty-state">
            <div className="icon">◌</div>
            <h3>No hay solicitudes todavía</h3>
            <p>Crea la primera solicitud de soporte para empezar.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Cliente</th>
                <th>Descripción</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Técnico</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map(s => (
                <tr key={s.id}>
                  <td className="ticket-id">SR-{String(s.id).padStart(4, '0')}</td>
                  <td>
                    <div className="cell-strong">{s.cliente?.nombre}</div>
                    <div className="cell-mute">{s.cliente?.empresa}</div>
                  </td>
                  <td style={{ maxWidth: 220 }}>{s.descripcion}</td>
                  <td><PrioridadBadge prioridad={s.prioridad} /></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <EstadoBadge estado={s.estado} />
                      <select
                        value={s.estado}
                        onChange={(e) => cambiarEstado(s.id, e.target.value)}
                        style={{ fontSize: 11, padding: '3px 6px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--paper)' }}
                      >
                        {ESTADOS.map(estado => (
                          <option key={estado} value={estado}>{ESTADO_LABEL[estado]}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    {s.tecnico ? (
                      <div className="cell-strong">{s.tecnico.nombre}</div>
                    ) : (
                      <select
                        defaultValue=""
                        disabled={asignandoId === s.id}
                        onChange={(e) => asignarTecnico(s.id, e.target.value)}
                        style={{ fontSize: 12.5, padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--paper)' }}
                      >
                        <option value="" disabled>Asignar técnico…</option>
                        {tecnicos.map(t => (
                          <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn-icon" title="Editar" onClick={() => abrirEditar(s)}>✎</button>
                      <button className="btn-icon danger" title="Eliminar" onClick={() => eliminar(s)}>×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panelAbierto && (
        <Panel title={editando ? `Editar solicitud SR-${String(editando.id).padStart(4, '0')}` : 'Nueva solicitud'} onClose={() => setPanelAbierto(false)}>
          <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {errorForm && <div className="banner banner-error">{errorForm}</div>}

            <div className="subsection-label">Datos del cliente</div>
            <div className="field">
              <label>Nombre</label>
              <input required value={form.cliente.nombre} onChange={e => setForm({ ...form, cliente: { ...form.cliente, nombre: e.target.value } })} placeholder="Alejandro Cruz" />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Email</label>
                <input required type="email" value={form.cliente.email} onChange={e => setForm({ ...form, cliente: { ...form.cliente, email: e.target.value } })} placeholder="alejandro@empresa.com" />
              </div>
              <div className="field">
                <label>Teléfono</label>
                <input required value={form.cliente.telefono} onChange={e => setForm({ ...form, cliente: { ...form.cliente, telefono: e.target.value } })} placeholder="+51 999 999 999" />
              </div>
            </div>
            <div className="field">
              <label>Empresa</label>
              <input required value={form.cliente.empresa} onChange={e => setForm({ ...form, cliente: { ...form.cliente, empresa: e.target.value } })} placeholder="TechCorp" />
            </div>

            <hr className="fieldset-divider" />

            <div className="subsection-label">Detalles de la solicitud</div>
            <div className="field">
              <label>Descripción del problema</label>
              <textarea required value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="El equipo no enciende…" />
            </div>
            <div className="field">
              <label>Prioridad</label>
              <select value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })}>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>

            <div className="panel-actions">
              <button type="button" className="btn-secondary" onClick={() => setPanelAbierto(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear solicitud'}
              </button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  )
}

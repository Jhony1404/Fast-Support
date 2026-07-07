import { useEffect, useState } from 'react'
import { TecnicosAPI, extraerMensajeError } from '../api'
import Panel from './Panel'

const TECNICO_VACIO = { nombre: '', email: '', especialidad: '', disponible: true }

export default function TecnicosView({ onChangeCount }) {
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(TECNICO_VACIO)
  const [errorForm, setErrorForm] = useState(null)
  const [guardando, setGuardando] = useState(false)

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const data = await TecnicosAPI.listar()
      setTecnicos(data)
      onChangeCount?.(data.length)
    } catch (err) {
      setError(extraerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  function abrirCrear() {
    setEditando(null)
    setForm(TECNICO_VACIO)
    setErrorForm(null)
    setPanelAbierto(true)
  }

  function abrirEditar(tecnico) {
    setEditando(tecnico)
    setForm({ nombre: tecnico.nombre, email: tecnico.email, especialidad: tecnico.especialidad, disponible: tecnico.disponible })
    setErrorForm(null)
    setPanelAbierto(true)
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setErrorForm(null)
    try {
      if (editando) {
        await TecnicosAPI.actualizar(editando.id, form)
      } else {
        await TecnicosAPI.crear(form)
      }
      setPanelAbierto(false)
      await cargar()
    } catch (err) {
      setErrorForm(extraerMensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(tecnico) {
    if (!confirm(`¿Eliminar al técnico "${tecnico.nombre}"?`)) return
    try {
      await TecnicosAPI.eliminar(tecnico.id)
      await cargar()
    } catch (err) {
      setError(extraerMensajeError(err))
    }
  }

  return (
    <div>
      <div className="main-header">
        <div>
          <h1>Técnicos</h1>
          <p>Equipo disponible para atender solicitudes de soporte.</p>
        </div>
        <button className="btn-primary" onClick={abrirCrear}>+ Nuevo técnico</button>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      <div className="table-card">
        {cargando ? (
          <div className="loading-row">Cargando técnicos…</div>
        ) : tecnicos.length === 0 ? (
          <div className="empty-state">
            <div className="icon">◌</div>
            <h3>Todavía no hay técnicos</h3>
            <p>Agrega uno para poder asignarlo a las solicitudes.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Email</th>
                <th>Disponibilidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tecnicos.map(t => (
                <tr key={t.id}>
                  <td className="ticket-id">#{t.id}</td>
                  <td className="cell-strong">{t.nombre}</td>
                  <td>{t.especialidad}</td>
                  <td className="cell-mute">{t.email}</td>
                  <td>
                    <span className={t.disponible ? 'disponible-si' : 'disponible-no'}>
                      {t.disponible ? '● Disponible' : '○ No disponible'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn-icon" title="Editar" onClick={() => abrirEditar(t)}>✎</button>
                      <button className="btn-icon danger" title="Eliminar" onClick={() => eliminar(t)}>×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panelAbierto && (
        <Panel title={editando ? 'Editar técnico' : 'Nuevo técnico'} onClose={() => setPanelAbierto(false)}>
          <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {errorForm && <div className="banner banner-error">{errorForm}</div>}

            <div className="field">
              <label>Nombre</label>
              <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="María López" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="maria@empresa.com" />
            </div>
            <div className="field">
              <label>Especialidad</label>
              <input required value={form.especialidad} onChange={e => setForm({ ...form, especialidad: e.target.value })} placeholder="Redes y hardware" />
            </div>
            <div className="field checkbox-field">
              <input
                type="checkbox"
                id="disponible"
                checked={form.disponible}
                onChange={e => setForm({ ...form, disponible: e.target.checked })}
              />
              <label htmlFor="disponible" style={{ margin: 0 }}>Disponible para asignación</label>
            </div>

            <div className="panel-actions">
              <button type="button" className="btn-secondary" onClick={() => setPanelAbierto(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear técnico'}
              </button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ClientesAPI, extraerMensajeError } from '../api'
import Panel from './Panel'

const CLIENTE_VACIO = { nombre: '', email: '', telefono: '', empresa: '' }

export default function ClientesView({ onChangeCount }) {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [editando, setEditando] = useState(null) // null = crear, objeto = editar
  const [form, setForm] = useState(CLIENTE_VACIO)
  const [errorForm, setErrorForm] = useState(null)
  const [guardando, setGuardando] = useState(false)

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const data = await ClientesAPI.listar()
      setClientes(data)
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
    setForm(CLIENTE_VACIO)
    setErrorForm(null)
    setPanelAbierto(true)
  }

  function abrirEditar(cliente) {
    setEditando(cliente)
    setForm({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono, empresa: cliente.empresa })
    setErrorForm(null)
    setPanelAbierto(true)
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setErrorForm(null)
    try {
      if (editando) {
        await ClientesAPI.actualizar(editando.id, form)
      } else {
        await ClientesAPI.crear(form)
      }
      setPanelAbierto(false)
      await cargar()
    } catch (err) {
      setErrorForm(extraerMensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(cliente) {
    if (!confirm(`¿Eliminar al cliente "${cliente.nombre}"?`)) return
    try {
      await ClientesAPI.eliminar(cliente.id)
      await cargar()
    } catch (err) {
      setError(extraerMensajeError(err))
    }
  }

  return (
    <div>
      <div className="main-header">
        <div>
          <h1>Clientes</h1>
          <p>Empresas y contactos que reportan solicitudes de soporte.</p>
        </div>
        <button className="btn-primary" onClick={abrirCrear}>+ Nuevo cliente</button>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      <div className="table-card">
        {cargando ? (
          <div className="loading-row">Cargando clientes…</div>
        ) : clientes.length === 0 ? (
          <div className="empty-state">
            <div className="icon">◌</div>
            <h3>Todavía no hay clientes</h3>
            <p>Crea el primero para poder generar solicitudes de soporte.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id}>
                  <td className="ticket-id">#{c.id}</td>
                  <td className="cell-strong">{c.nombre}</td>
                  <td>{c.empresa}</td>
                  <td className="cell-mute">{c.email}</td>
                  <td className="cell-mute">{c.telefono}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn-icon" title="Editar" onClick={() => abrirEditar(c)}>✎</button>
                      <button className="btn-icon danger" title="Eliminar" onClick={() => eliminar(c)}>×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panelAbierto && (
        <Panel title={editando ? 'Editar cliente' : 'Nuevo cliente'} onClose={() => setPanelAbierto(false)}>
          <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {errorForm && <div className="banner banner-error">{errorForm}</div>}

            <div className="field">
              <label>Nombre</label>
              <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Alejandro Cruz" />
            </div>
            <div className="field">
              <label>Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="alejandro@empresa.com" />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input required value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="555-1234" />
            </div>
            <div className="field">
              <label>Empresa</label>
              <input required value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} placeholder="TechCorp" />
            </div>

            <div className="panel-actions">
              <button type="button" className="btn-secondary" onClick={() => setPanelAbierto(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear cliente'}
              </button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  )
}

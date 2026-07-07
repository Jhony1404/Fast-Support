import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ClientesView from './components/ClientesView'
import TecnicosView from './components/TecnicosView'
import SolicitudesView from './components/SolicitudesView'

export default function App() {
  const [vista, setVista] = useState('solicitudes')
  const [counts, setCounts] = useState({ clientes: 0, tecnicos: 0, solicitudes: 0 })

  return (
    <div className="app-shell">
      <Sidebar vista={vista} setVista={setVista} counts={counts} />
      <main className="main">
        {vista === 'solicitudes' && (
          <SolicitudesView onChangeCount={(n) => setCounts(c => ({ ...c, solicitudes: n }))} />
        )}
        {vista === 'clientes' && (
          <ClientesView onChangeCount={(n) => setCounts(c => ({ ...c, clientes: n }))} />
        )}
        {vista === 'tecnicos' && (
          <TecnicosView onChangeCount={(n) => setCounts(c => ({ ...c, tecnicos: n }))} />
        )}
      </main>
    </div>
  )
}

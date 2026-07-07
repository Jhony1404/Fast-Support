export default function Sidebar({ vista, setVista, counts }) {
  const items = [
    { key: 'solicitudes', label: 'Solicitudes', count: counts.solicitudes },
    { key: 'clientes', label: 'Clientes', count: counts.clientes },
    { key: 'tecnicos', label: 'Técnicos', count: counts.tecnicos },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        FAST<span>Support</span>
      </div>

      <nav className="sidebar-nav">
        {items.map(item => (
          <button
            key={item.key}
            className={vista === item.key ? 'active' : ''}
            onClick={() => setVista(item.key)}
          >
            <span>{item.label}</span>
            <span className="count">{item.count}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        API: localhost:8080/api<br />
        Frontend: localhost:5173
      </div>
    </aside>
  )
}

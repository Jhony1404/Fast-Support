export default function Panel({ title, onClose, children }) {
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="panel">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

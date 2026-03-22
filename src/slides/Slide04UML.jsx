import UMLDiagram from '../diagrams/UMLDiagram'

export default function Slide04UML() {
  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>UML Class Diagram</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="badge">Structure</span>
          <span className="badge success">Static View</span>
        </div>
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 10 }}>
        The relationship between the Client, Proxy, and RealSubject.
      </p>

      <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
        <UMLDiagram />
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

import { useEffect } from 'react'
import UMLDiagram from '../diagrams/UMLDiagram'

const MAX_STEP = 5

export default function Slide04UML({ onIntercept, slideStep, advanceStep }) {
  useEffect(() => {
    onIntercept?.(() => {
      if (slideStep < MAX_STEP) { advanceStep(); return true }
      return false
    })
  }, [slideStep])

  return (
    <div className="slide-shell">
      <h2 className="slide-title">The Structure</h2>
      <p className="slide-subtitle">Press → to build the diagram step by step.</p>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <UMLDiagram step={slideStep} />
      </div>

      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        {Array.from({ length: MAX_STEP + 1 }).map((_, i) => (
          <div key={i} style={{
            width:8, height:8, borderRadius:'50%',
            background: slideStep >= i ? 'var(--primary)' : 'var(--border)',
            transition:'background 300ms',
          }} />
        ))}
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const ROWS = [
  ['Controls ACCESS to the real object',  'Adds FUNCTIONALITY to the real object'],
  ['CAN refuse to call the real object',  'Always calls through to the real object'],
  ['Manages object lifecycle',            'Enhances behaviour after creation'],
  ['Client often unaware of the proxy',   'Client chooses which decorator to apply'],
  ['Example: Spring @Cacheable',          'Example: Java BufferedReader'],
]

export default function Slide10Comparison() {
  const tableRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = tableRef.current?.querySelectorAll('tbody tr')
      if (!rows) return
      gsap.fromTo(rows,
        { opacity:0, y:8 },
        { opacity:1, y:0, duration:0.35, stagger:0.12, ease:'power2.out', delay:0.3 }
      )
    }, tableRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="slide-shell">
      <h2 className="slide-title">Wait... isn't this the Decorator?</h2>
      <p className="slide-subtitle">A common and important confusion worth clarifying.</p>

      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <table className="cmp-table" ref={tableRef} style={{ maxWidth:860 }}>
          <thead>
            <tr>
              <th style={{ color:'var(--primary)' }}>🛡 Proxy</th>
              <th style={{ color:'var(--text-secondary)' }}>🎨 Decorator</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([proxy, deco], i) => (
              <tr key={i} style={{ opacity:0 }}>
                <td style={{ fontWeight:500 }}>{proxy}</td>
                <td style={{ color:'var(--text-secondary)' }}>{deco}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="callout-gold" style={{ marginTop:28, maxWidth:860, fontSize:16 }}>
          Proxy is about <strong>CONTROL</strong>.&nbsp;&nbsp;&nbsp;Decorator is about <strong>ENHANCEMENT</strong>.
        </div>
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

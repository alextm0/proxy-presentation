import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CARDS = [
  { icon:'🔒', title:'Protective', desc:'Controls WHO can access the real object', example:'Security guard at a building' },
  { icon:'⚡', title:'Lazy / Caching', desc:'Controls WHEN the real object is created or called', example:'Waiter taking your order (buffering)' },
  { icon:'📡', title:'Remote', desc:'Represents a DISTANT object locally', example:'Bank ATM — local proxy to your remote account' },
]

export default function Slide03Intuition() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.intuition-card',
        { opacity:0, y:20 },
        { opacity:1, y:0, duration:0.45, stagger:0.15, ease:'power2.out', delay:0.3 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="slide-shell" ref={containerRef}>
      <h2 className="slide-title">A Proxy is a smart middleman.</h2>
      <p className="slide-subtitle">Same interface. Smarter behavior.</p>

      <div className="three-col" style={{ marginTop:16 }}>
        {CARDS.map(c => (
          <div key={c.title} className="intuition-card card card-gold-left" style={{ opacity:0 }}>
            <div style={{ fontSize:32, marginBottom:10 }}>{c.icon}</div>
            <h3 style={{ color:'var(--primary)', fontSize:16, fontWeight:700, marginBottom:6 }}>{c.title}</h3>
            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.55, marginBottom:10 }}>{c.desc}</p>
            <p style={{ fontSize:12, color:'var(--text-faint)', borderTop:'1px solid var(--border)', paddingTop:8 }}>
              Real world: {c.example}
            </p>
          </div>
        ))}
      </div>

      <div className="callout-gold" style={{ marginTop:24, maxWidth:700, textAlign:'left' }}>
        💡 Ask yourself: what is the proxy <em>controlling</em>? That's the key question.
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

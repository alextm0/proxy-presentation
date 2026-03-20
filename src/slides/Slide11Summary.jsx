import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CARDS = [
  { icon:'🐢', title:'Lazy Loading',    desc:'Object is expensive to create — delay until needed' },
  { icon:'🔐', title:'Access Control',  desc:'Not everyone should access the real object' },
  { icon:'💾', title:'Caching',         desc:'Same input, same output? Cache the real call' },
  { icon:'📋', title:'Logging / Audit', desc:'Need a transparent audit trail of all calls' },
  { icon:'🌐', title:'Remote Object',   desc:'The real object lives on another machine' },
]

export default function Slide11Summary() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.summary-card',
        { opacity:0, y:20 },
        { opacity:1, y:0, duration:0.4, stagger:0.12, ease:'power2.out', delay:0.2 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="slide-shell" ref={containerRef}>
      <h2 className="slide-title">When do you reach for Proxy?</h2>
      <p className="slide-subtitle">Five use-cases worth remembering.</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginTop:8, maxWidth:900 }}>
        {CARDS.map(c => (
          <div key={c.title} className="summary-card card card-gold-left" style={{ opacity:0, padding:'18px 20px' }}>
            <span style={{ fontSize:28 }}>{c.icon}</span>
            <h3 style={{ color:'var(--primary)', fontSize:15, fontWeight:700, margin:'8px 0 4px' }}>{c.title}</h3>
            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 }}>{c.desc}</p>
          </div>
        ))}

        <div className="callout-gold" style={{ gridColumn:'1 / -1', fontSize:14, textAlign:'left' }}>
          You've already used Proxy today — Spring @Cacheable, OkHttp interceptors, Vue reactivity.
          <br/><strong>Now you'll recognize it everywhere.</strong>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginTop:20, flexWrap:'wrap' }}>
        <a href="https://refactoring.guru/design-patterns/proxy" target="_blank" rel="noopener noreferrer" className="chip">📖 refactoring.guru/proxy</a>
        <a href="https://github.com/spring-projects/spring-framework" target="_blank" rel="noopener noreferrer" className="chip">☕ spring-projects/spring-framework</a>
        <a href="https://github.com/square/okhttp" target="_blank" rel="noopener noreferrer" className="chip">🔗 square/okhttp</a>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

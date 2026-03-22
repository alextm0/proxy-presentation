import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Slide12Conclusion() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.conclusion-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
      )
      
      gsap.fromTo('.final-badge',
        { scale: 0 },
        { scale: 1, duration: 0.8, delay: 1, ease: 'back.out(1.7)' }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="slide-shell" ref={containerRef} style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      
      <div className="conclusion-item badge" style={{ marginBottom: 30 }}>
        Summary & Takeaways
      </div>

      <h1 className="conclusion-item" style={{ fontSize: 64, fontWeight: 800, marginBottom: 40 }}>
        Controlled <span className="gold-shimmer">Access</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1000px', margin: '0 auto 60px' }}>
        {[
          { title: 'When to use', items: ['Lazy Creation', 'Access Control', 'Remote Objects'] },
          { title: 'Key Benefits', items: ['Transparency', 'Lifecycle Mgmt', 'Efficiency'] },
          { title: 'Real World', items: ['Spring @Cacheable', 'OkHttp Interceptors', 'Vue Reactivity'] }
        ].map((col, i) => (
          <div key={i} className="conclusion-item" style={{ textAlign: 'left' }}>
            <h3 style={{ color: 'var(--primary)', fontSize: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginBottom: '15px' }}>
              {col.title}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {col.items.map((item, ii) => (
                <li key={ii} style={{ marginBottom: '8px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--primary)' }}>✔</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="conclusion-item" style={{ 
        padding: '30px 50px', 
        background: 'var(--surface)', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius)',
        maxWidth: '800px'
      }}>
        <p style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
          "The Proxy pattern isn't about adding features — it's about <span style={{ color: 'var(--primary)' }}>owning the boundary</span> between the client and the service."
        </p>
      </div>

      <div className="final-badge" style={{ 
        marginTop: '50px', 
        padding: '12px 24px', 
        background: 'var(--primary)', 
        color: '#fff', 
        borderRadius: '30px',
        fontWeight: 800,
        fontSize: '20px',
        boxShadow: '0 10px 25px rgba(184, 150, 12, 0.3)'
      }}>
        Any Questions?
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

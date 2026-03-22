import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COMPARISON_POINTS = [
  { 
    axis: 'Creation', 
    proxy: 'Creates the object itself (Lazy)', 
    deco: 'Receives object from outside',
    icon: '🏗️'
  },
  { 
    axis: 'Decision', 
    proxy: 'Can refuse to call (Gatekeeper)', 
    deco: 'Must call through (Wrapper)',
    icon: '🛑'
  },
  { 
    axis: 'Visibility', 
    proxy: 'Invisible to the Client', 
    deco: 'Explicitly chosen by Client',
    icon: '🔍'
  },
  { 
    axis: 'Focus', 
    proxy: 'Access & Lifecycle Control', 
    deco: 'Features & Extra Behaviour',
    icon: '🎯'
  }
]

const PROXY_EXAMPLES = ['Spring @Cacheable', 'OkHttp Interceptor', 'Vue reactive()']
const DECO_EXAMPLES  = ['BufferedReader', 'UnmodifiableList', 'Java I/O streams']

export default function Slide09Comparison() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header and title
      gsap.fromTo(['.slide-title', '.slide-subtitle'], 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      )

      // The two pillars
      gsap.fromTo('.comp-pillar', 
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
      )

      // Comparison rows
      gsap.fromTo('.comp-row',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 1 }
      )

      // Example chips
      gsap.fromTo('.example-chip',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)', delay: 1.8 }
      )

      // Final callout
      gsap.fromTo('.comp-callout',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 2.2 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="slide-shell" ref={containerRef}>
      <h2 className="slide-title">Wait… isn't this the Decorator?</h2>
      <p className="slide-subtitle">The structure is identical, but the <strong>intent</strong> is opposite.</p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
        
        {/* The Comparison Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flex: 1 }}>
          
          {/* Proxy Pillar */}
          <div className="comp-pillar" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderTop: '6px solid var(--primary)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px' }}>🛡️</div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Intent</span>
                <h3 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)', margin: 0, lineHeight: 1 }}>CONTROL</h3>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {COMPARISON_POINTS.map((p, i) => (
                <div key={i} className="comp-row" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px', 
                  padding: '12px 0', 
                  borderBottom: i < COMPARISON_POINTS.length - 1 ? '1px solid var(--border)' : 'none' 
                }}>
                  <span style={{ fontSize: '18px', width: '24px' }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>{p.axis}</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{p.proxy}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '20px' }}>
              {PROXY_EXAMPLES.map(ex => (
                <span key={ex} className="example-chip badge" style={{ background: 'var(--primary-faded)', borderColor: 'var(--primary)', color: 'var(--primary)' }}>{ex}</span>
              ))}
            </div>
          </div>

          {/* Decorator Pillar */}
          <div className="comp-pillar" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderTop: '6px solid #546E7A',
            borderRadius: 'var(--radius)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px' }}>🎨</div>
              <div>
                <span style={{ fontSize: '11px', color: '#546E7A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Intent</span>
                <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#546E7A', margin: 0, lineHeight: 1 }}>ENHANCE</h3>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {COMPARISON_POINTS.map((p, i) => (
                <div key={i} className="comp-row" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px', 
                  padding: '12px 0', 
                  borderBottom: i < COMPARISON_POINTS.length - 1 ? '1px solid var(--border)' : 'none' 
                }}>
                  <span style={{ fontSize: '18px', width: '24px', opacity: 0.5 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>{p.axis}</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#546E7A' }}>{p.deco}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '20px' }}>
              {DECO_EXAMPLES.map(ex => (
                <span key={ex} className="example-chip badge" style={{ background: '#ECEFF1', borderColor: '#B0BEC5', color: '#546E7A' }}>{ex}</span>
              ))}
            </div>
          </div>

        </div>

        {/* Final Conclusion Box */}
        <div className="comp-callout" style={{
          background: 'linear-gradient(135deg, #FFF8E1, #FFFDE7)',
          border: '1px solid var(--border)',
          borderLeft: '8px solid var(--primary)',
          borderRadius: 'var(--radius-sm)',
          padding: '20px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text)',
          boxShadow: '0 4px 15px rgba(184, 150, 12, 0.08)',
          lineHeight: 1.5
        }}>
          The Proxy <strong>owns</strong> the object and decides <strong>if</strong> it's used.<br/>
          The Decorator <strong>wraps</strong> an existing object to add <strong>features</strong>.
        </div>

      </div>

      <div className="bottom-rule" />
    </div>
  )
}

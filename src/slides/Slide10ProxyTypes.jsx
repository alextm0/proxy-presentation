import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Illustrations = {
  Virtual: ({ color }) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      {/* Background Page */}
      <rect x="12" y="8" width="40" height="48" rx="4" fill="white" stroke={color} strokeWidth="2" strokeDasharray="4 2" opacity="0.4" />
      {/* Placeholder Image Icon */}
      <rect x="20" y="16" width="24" height="18" rx="2" stroke={color} strokeWidth="1.5" strokeDasharray="2 1" opacity="0.5" />
      <path d="M22 30 L28 22 L34 28 L38 24 L42 29" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Real Image appearing */}
      <g className="virtual-reveal">
        <rect x="12" y="8" width="40" height="48" rx="4" fill={color} opacity="0.1" />
        <rect x="12" y="8" width="40" height="48" rx="4" stroke={color} strokeWidth="2.5" />
        <path d="M12 40 L28 24 L44 40 L52 32 L52 56 L12 56 Z" fill={color} opacity="0.2" />
        <circle cx="22" cy="20" r="4" fill={color} opacity="0.3" />
      </g>
      {/* Loading Clock */}
      <g className="virtual-clock">
        <circle cx="48" cy="48" r="10" fill="white" stroke={color} strokeWidth="2" />
        <path d="M48 42 V48 L52 50" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  ),
  Remote: ({ color }) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      {/* Local Monitor */}
      <rect x="4" y="32" width="24" height="18" rx="2" stroke={color} strokeWidth="2" />
      <path d="M10 50 L22 50 M16 50 V56" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Remote Server/Globe */}
      <circle cx="48" cy="20" r="14" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
      <path d="M34 20 H62 M48 6 V34 M38 10 Q48 20 58 10 M38 30 Q48 20 58 30" stroke={color} strokeWidth="1" opacity="0.3" />
      {/* Connection line */}
      <path d="M28 40 Q40 40 40 28" stroke={color} strokeWidth="2" strokeDasharray="4 4" className="remote-line" />
      <circle r="3" fill={color} className="remote-dot">
        <animateMotion path="M28 40 Q40 40 40 28" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
  Protection: ({ color }) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      {/* Target Resource */}
      <rect x="44" y="24" width="12" height="16" rx="2" fill={color} opacity="0.15" />
      <rect x="44" y="24" width="12" height="16" rx="2" stroke={color} strokeWidth="2" />
      {/* Shield */}
      <path d="M16 12 L16 40 Q30 50 44 40 L44 12 Q30 8 16 12 Z" fill="white" stroke={color} strokeWidth="2.5" />
      <path d="M22 18 L22 36 Q30 42 38 36 L38 18 Q30 15 22 18 Z" fill={color} opacity="0.1" />
      {/* Lock Icon */}
      <rect x="25" y="26" width="10" height="8" rx="1" fill={color} />
      <path d="M27 26 V23 A3 3 0 0 1 33 23 V26" stroke={color} strokeWidth="2" />
    </svg>
  ),
  Caching: ({ color }) => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      {/* Cache Store */}
      <rect x="18" y="18" width="28" height="28" rx="4" fill="white" stroke={color} strokeWidth="2" />
      <rect x="24" y="24" width="16" height="16" rx="2" fill={color} opacity="0.1" />
      {/* Fast Lightning Path */}
      <path d="M8 32 H18" stroke={color} strokeWidth="2" markerEnd="url(#arrow-head)" />
      <path d="M46 32 H56" stroke={color} strokeWidth="2" opacity="0.2" strokeDasharray="2 2" />
      {/* Lightning Bolt */}
      <path d="M32 10 L26 28 H38 L32 46" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="cache-bolt" />
      <defs>
        <marker id="arrow-head" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={color} />
        </marker>
      </defs>
    </svg>
  )
}

const PROXY_TYPES = [
  {
    title: 'Virtual Proxy',
    type: 'Virtual',
    description: 'Creates the expensive real object only when the client first actually uses it. Until then, the proxy is a lightweight stand-in.',
    example: 'Ex: Loading a high-res image, opening a DB connection.',
    color: '#B8960C',
    watermark: '🖼️'
  },
  {
    title: 'Remote Proxy',
    type: 'Remote',
    description: 'The real object lives in a different process or machine. The proxy handles all serialization, networking, and error handling transparently.',
    example: 'Ex: REST/gRPC client stubs, RMI.',
    color: '#3F51B5',
    watermark: '🌐'
  },
  {
    title: 'Protection Proxy',
    type: 'Protection',
    description: 'Checks permissions before forwarding a call to the real object. Different clients can get different levels of access.',
    example: 'Ex: Role-based method guards, authentication layers.',
    color: '#E91E63',
    watermark: '🛡️'
  },
  {
    title: 'Caching Proxy',
    type: 'Caching',
    description: 'Stores results of expensive operations. Repeated calls with the same arguments are served instantly from the cache.',
    example: 'Ex: HTTP response cache, CDN edge node, query result cache.',
    color: '#4CAF50',
    watermark: '💾'
  }
]

export default function Slide10ProxyTypes() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main title and subtitle
      gsap.fromTo(['.slide-title', '.slide-subtitle'], 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )

      // Cards
      gsap.fromTo('.type-card',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'elastic.out(1, 0.8)', delay: 0.3 }
      )

      // Animations for illustrations
      gsap.fromTo('.virtual-reveal', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 2, repeat: -1, yoyo: true, ease: 'power2.inOut' })
      gsap.fromTo('.virtual-clock', { rotation: -10 }, { rotation: 10, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '48px 48px' })
      gsap.fromTo('.cache-bolt', { opacity: 0.3, scale: 0.9 }, { opacity: 1, scale: 1.1, duration: 0.5, repeat: -1, yoyo: true, ease: 'power2.inOut', transformOrigin: 'center' })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="slide-shell" ref={containerRef}>
      <h2 className="slide-title">The Four Types of Proxy</h2>
      <p className="slide-subtitle">Categorizing the most common real-world applications of the pattern.</p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gridTemplateRows: '1fr 1fr',
        gap: '24px', 
        marginTop: '10px',
        flex: 1 
      }}>
        {PROXY_TYPES.map((type, i) => {
          const Illustration = Illustrations[type.type]
          return (
            <div key={i} className="type-card" style={{
              background: 'var(--surface)',
              border: `1px solid var(--border)`,
              borderTop: `4px solid ${type.color}`,
              borderRadius: 'var(--radius)',
              padding: '24px 28px',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Watermark */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '100px',
                opacity: 0.03,
                pointerEvents: 'none',
                userSelect: 'none'
              }}>
                {type.watermark}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: `${type.color}08`,
                  borderRadius: '16px',
                  border: `1px solid ${type.color}22`
                }}>
                  <Illustration color={type.color} />
                </div>
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: 800, 
                  color: type.color,
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  {type.title}
                </h3>
              </div>
              
              <p style={{ 
                fontSize: '17px', 
                lineHeight: 1.6, 
                color: 'var(--text)',
                margin: '0',
                maxWidth: '80%'
              }}>
                {type.description}
              </p>
              
              <div style={{ 
                marginTop: 'auto',
                padding: '12px 16px',
                background: 'var(--primary-faded)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `4px solid ${type.color}`
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  {type.example}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

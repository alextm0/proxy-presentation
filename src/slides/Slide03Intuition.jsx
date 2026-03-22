import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CARDS = [
  {
    icon: '🔒',
    title: 'Protective',
    desc: 'Controls WHO can access the real object. The proxy checks permissions before forwarding the call.',
    example: 'Security guard at a building entrance',
  },
  {
    icon: '⚡',
    title: 'Lazy / Caching',
    desc: 'Controls WHEN the real object is created or invoked. Expensive operations are deferred until needed.',
    example: 'Waiter taking your order — buffering calls',
  },
  {
    icon: '📡',
    title: 'Remote',
    desc: 'Represents a DISTANT object locally. The proxy handles all network communication transparently.',
    example: 'ATM — local proxy to your remote bank account',
  },
]

export default function ConceptualQuestion() {
  const containerRef = useRef(null)

  return (
    <div className="slide-shell" ref={containerRef} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{
          fontSize: 52,
          fontWeight: 900,
          color: '#1A1A1A',
          margin: 0,
          background: 'linear-gradient(90deg, #1A1A1A, #B8960C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          A Matter of Identity
        </h1>
        <p style={{ fontSize: 18, color: '#666', marginTop: 4, fontWeight: 500 }}>
          Can you tell the difference?
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ 
          background: '#F9F9F9', 
          padding: '24px 50px', 
          borderRadius: 32, 
          border: '1px solid #EEE',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
        }}>
          <svg width="840" height="220" viewBox="0 0 840 220">
            <defs>
              <marker id="arrow-dark" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#1A1A1A" />
              </marker>
            </defs>

            {/* Client */}
            <g transform="translate(40, 45)">
              <rect width="160" height="130" rx="24" fill="#FFF" stroke="#1A1A1A" strokeWidth="2.5" />
              <text x="80" y="70" textAnchor="middle" fontSize="44">👤</text>
              <text x="80" y="110" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1A1A1A">CLIENT</text>
            </g>

            {/* Mystery Box */}
            <g transform="translate(420, 20)">
              <rect width="380" height="180" rx="36" fill="#FFF" stroke="#B8960C" strokeWidth="4" strokeDasharray="12 8" />
              <text x="190" y="100" textAnchor="middle" fontSize="80" fontWeight="900" fill="#B8960C" opacity="0.15">?</text>
              
              <g transform="translate(40, 45)">
                <rect width="130" height="90" rx="16" fill="#FDFCFB" stroke="#EEE" strokeWidth="2" />
                <text x="65" y="50" textAnchor="middle" fontSize="28">🖥️</text>
                <text x="65" y="75" textAnchor="middle" fontSize="11" fontWeight="800" fill="#999">PROXY</text>
              </g>

              <text x="190" y="95" textAnchor="middle" fontSize="20" fontWeight="800" fill="#B8960C">VS</text>

              <g transform="translate(210, 45)">
                <rect width="130" height="90" rx="16" fill="#FDFCFB" stroke="#EEE" strokeWidth="2" />
                <text x="65" y="50" textAnchor="middle" fontSize="28">🗄️</text>
                <text x="65" y="75" textAnchor="middle" fontSize="11" fontWeight="800" fill="#999">REAL THING</text>
              </g>
            </g>

            {/* Connecting Arrow */}
            <line x1="200" y1="110" x2="410" y2="110" stroke="#1A1A1A" strokeWidth="3" markerEnd="url(#arrow-dark)" />
            <text x="305" y="98" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1A1A1A">CALLS</text>
          </svg>
        </div>

        <div style={{ maxWidth: 900, textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#1A1A1A', marginBottom: 16 }}>
            Who are you <span style={{ color: '#B8960C' }}>really</span> talking to?
          </h2>
          <div className="callout-gold" style={{ 
            fontSize: 20, 
            padding: '24px 40px', 
            borderRadius: 24, 
            lineHeight: 1.5,
            borderLeftWidth: 8,
            boxShadow: '0 10px 20px rgba(184, 150, 12, 0.08)'
          }}>
            In a perfect Proxy implementation, the Client <strong>cannot tell the difference</strong>. 
            It expects a specific interface, and the Proxy delivers it—quietly intercepting, 
            validating, or caching behind the scenes.
            <div style={{ fontSize: 16, marginTop: 12, borderTop: '1px solid rgba(184, 150, 12, 0.2)', paddingTop: 12, color: '#555' }}>
              "The best Proxy is the one you never knew was there."
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

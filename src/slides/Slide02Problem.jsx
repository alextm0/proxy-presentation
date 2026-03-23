import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Introduction() {
  const containerRef = useRef(null)

  const sections = [
    { num: '01', title: 'The Starting Point', desc: 'Understanding why proxies are everywhere and what problem they solve.' },
    { num: '02', title: 'Core Intuition', desc: 'Identity, interception, and the "invisible" nature of modern proxies.' },
    { num: '03', title: 'The Structure', desc: 'UML breakdown: Subject, Proxy, and RealSubject relationships.' },
    { num: '04', title: 'Proxy Types', desc: 'Virtual, Remote, Protection, and Caching as practical categories.' },
    { num: '05', title: 'Hands-on + OSS', desc: 'Toy implementation first, then real-world ORM examples.' },
    { num: '06', title: 'The Comparison', desc: 'Final bridge: Proxy vs Decorator and when to use each.' },
  ]

  return (
    <div className="slide-shell" ref={containerRef}>
      <div style={{ marginBottom: 40, borderLeft: '6px solid #B8960C', paddingLeft: 24 }}>
        <h1 style={{
          fontSize: 54,
          fontWeight: 800,
          color: '#1A1A1A',
          margin: 0,
          letterSpacing: '-1px'
        }}>
          Table of contents
        </h1>
        <p style={{ fontSize: 18, color: '#666', margin: '4px 0 0 0' }}>
          Our journey through the Proxy Design Pattern
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '30px',
        flex: 1,
        padding: '0 10px',
      }}>
        {sections.map((s, i) => (
          <div key={i} className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '30px 20px',
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            borderRadius: 24,
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}>
            <div style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDFCFB 0%, #E2D1C3 100%)',
              border: '2px solid #B8960C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 900,
              color: '#B8960C',
              boxShadow: '0 10px 20px rgba(184, 150, 12, 0.1)'
            }}>
              {s.num}
            </div>
            <h3 style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#1A1A1A',
              textAlign: 'center',
              margin: 0,
              fontFamily: "'DM Sans', sans-serif"
            }}>
              {s.title}
            </h3>
            <p style={{
              fontSize: 15,
              color: '#999999',
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.5,
              padding: '0 10px'
            }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

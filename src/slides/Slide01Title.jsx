import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ProxyCoverSVG from '../diagrams/ProxyCoverSVG'
import { usePresentation } from '../hooks/usePresentation'

export default function Slide01Title() {
  const containerRef = useRef(null)
  const { presentationMode } = usePresentation()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.s01-item',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out', delay: 0.15 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="slide-shell" ref={containerRef}
      style={{ justifyContent: 'center', alignItems: 'center' }}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <span className="badge s01-item" style={{ marginBottom: 22, fontSize: 12, opacity: 0 }}>
          Structural Patterns · Design Patterns Course
        </span>

        <h1 className="s01-item" style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(72px, 9vw, 104px)',
          fontWeight: 800,
          lineHeight: 0.9,
          marginBottom: 16,
          opacity: 0,
        }}>
          <span className="gold-shimmer">Proxy</span>
        </h1>

        <p className="s01-item" style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 24,
          color: '#B8960C',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          marginBottom: 32,
          opacity: 0,
        }}>
          Design Pattern
        </p>

        <p className="s01-item" style={{
          fontSize: 18,
          color: 'var(--text)',
          fontWeight: 600,
          marginBottom: 8,
          opacity: 0,
        }}>
          Alexandru Toma &nbsp;·&nbsp; Grancea Alexandru &nbsp;·&nbsp; Serdan Andrei
        </p>

        <p className="s01-item" style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          fontWeight: 500,
          marginBottom: 40,
          opacity: 0,
        }}>
          26 March 2026
        </p>

        <div className="s01-item" style={{
          padding: '36px 56px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          opacity: 0,
        }}>
          <ProxyCoverSVG />
        </div>

        {!presentationMode && (
          <p className="s01-item" style={{
            marginTop: 36,
            fontSize: 12,
            color: 'var(--text-faint)',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.04em',
            opacity: 0,
          }}>
            → / Space to advance &nbsp;·&nbsp; ← to go back &nbsp;·&nbsp; P for presenter notes
          </p>
        )}
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

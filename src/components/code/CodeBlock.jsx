import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * lines: Array<{ tokens: Array<{text:string, type:string}>, id?:string }>
 * highlights: Array<{ lineId:string, label:string }>
 * highlightStep: number (external, from usePresentation — for H key manual advance)
 * lang: string
 */
export default function CodeBlock({ lines = [], highlights = [], highlightStep = 0, lang = 'java' }) {
  const containerRef = useRef(null)
  const barRefs      = useRef({})   // lineId → bar element
  const tipRefs      = useRef({})   // lineId → tooltip element
  const tlRef        = useRef(null) // auto-cycle timeline

  // Auto-cycle on mount
  useEffect(() => {
    if (!highlights.length) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tlRef.current = tl
      highlights.forEach(({ lineId }, i) => {
        const bar = barRefs.current[lineId]
        const tip = tipRefs.current[lineId]
        if (!bar || !tip) return
        tl.set(tip, { opacity: 0, y: 4 })
        tl.to(bar, { width: '100%', duration: 0.3, ease: 'power2.out' }, `+=${i === 0 ? 0.6 : 0.3}`)
        tl.to(tip, { opacity: 1, y: 0, duration: 0.2 }, '<')
        tl.to({}, { duration: 1.5 }) // hold
        if (i < highlights.length - 1) {
          tl.to(bar, { width: 0, duration: 0.2, ease: 'power2.in' })
          tl.to(tip, { opacity: 0, duration: 0.15 }, '<')
        }
        // last highlight stays
      })
    }, containerRef)
    return () => ctx.revert()
  }, []) // run once on mount

  // Manual H-key advance — kill auto-cycle and jump to specific step
  useEffect(() => {
    if (!highlights.length) return
    if (tlRef.current) { tlRef.current.kill(); tlRef.current = null }
    const activeIdx = highlightStep % highlights.length
    highlights.forEach(({ lineId }, i) => {
      const bar = barRefs.current[lineId]
      const tip = tipRefs.current[lineId]
      if (!bar || !tip) return
      const active = i === activeIdx
      gsap.to(bar, { width: active ? '100%' : 0, duration: 0.25 })
      gsap.to(tip, { opacity: active ? 1 : 0, y: active ? 0 : 4, duration: 0.2 })
    })
  }, [highlightStep])

  function tokenColor(type) {
    const map = {
      keyword: '#B8960C', string: '#2E7D32', comment: '#9E9E9E',
      type: '#1565C0', method: '#6A1B9A', number: '#D84315',
    }
    return map[type] || '#1A1A1A'
  }

  return (
    <div className="code-block" ref={containerRef}>
      <span className="code-lang-badge">{lang}</span>
      <pre>
        {lines.map((line, i) => {
          const hlData = highlights.find(h => h.lineId === line.id)
          return (
            <span key={i} className="code-line">
              {hlData && (
                <>
                  <span className="hl-bar" ref={el => { if (el) barRefs.current[line.id] = el }} style={{ width: 0 }} />
                  <span className="hl-tooltip" ref={el => { if (el) tipRefs.current[line.id] = el }}>
                    {hlData.label}
                  </span>
                </>
              )}
              {line.tokens.map((tok, j) => (
                <span key={j} style={{
                  color: tokenColor(tok.type),
                  fontStyle: tok.type === 'comment' ? 'italic' : undefined,
                }}>
                  {tok.text}
                </span>
              ))}
              {'\n'}
            </span>
          )
        })}
      </pre>
    </div>
  )
}

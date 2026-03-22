import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * lines: Array<{ tokens: Array<{text:string, type:string}>, id?:string }>
 * highlights: Array<{ lineId:string, label:string }>
 * highlightStep: number (external, from usePresentation — for H key manual advance)
 * lang: string
 */
export default function CodeBlock({ lines = [], highlights = [], highlightStep = 0, lang = 'java', filename = '' }) {
  const containerRef = useRef(null)
  const barRefs      = useRef({})
  const tipRefs      = useRef({})
  const tlRef        = useRef(null)

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
        tl.to(bar, { width: '100%', duration: 0.3, ease: 'power2.out' }, `+=${i === 0 ? 0.7 : 0.35}`)
        tl.to(tip, { opacity: 1, y: 0, duration: 0.2 }, '<')
        tl.to({}, { duration: 1.6 })
        if (i < highlights.length - 1) {
          tl.to(bar, { width: 0, duration: 0.2, ease: 'power2.in' })
          tl.to(tip, { opacity: 0, duration: 0.15 }, '<')
        }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Manual H-key advance
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
      keyword: '#C792EA',  // soft purple
      string:  '#C3E88D',  // green
      comment: '#546E7A',  // muted blue-grey
      type:    '#FFCB6B',  // amber/yellow
      method:  '#82AAFF',  // soft blue
      number:  '#F78C6C',  // peach
    }
    return map[type] || '#EEFFFF'
  }

  return (
    <div className="code-block" ref={containerRef}>
      {filename && (
        <div className="code-block-header">
          <div className="code-filename-tab">{filename}</div>
        </div>
      )}
      <span className="code-lang-badge" style={{ top: filename ? 46 : 10 }}>{lang}</span>
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

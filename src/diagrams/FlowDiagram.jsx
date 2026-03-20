import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function FlowDiagram({ nodes = [], animate = false }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!animate) return
    const ctx = gsap.context(() => {
      const boxes = containerRef.current.querySelectorAll('.fd-box')
      const arrows = containerRef.current.querySelectorAll('.fd-arrow')
      gsap.set([...boxes, ...arrows], { opacity: 0 })
      const tl = gsap.timeline({ delay: 0.4 })
      boxes.forEach((box, i) => {
        tl.to(box, { opacity: 1, duration: 0.3 }, i * 0.25)
        if (arrows[i]) tl.to(arrows[i], { opacity: 1, duration: 0.25 }, i * 0.25 + 0.15)
      })
      // light up all boxes gold sequentially
      tl.to(boxes, { borderColor: '#B8960C', background: '#FFFDE7', duration: 0.2, stagger: 0.18 }, '+=0.3')
    }, containerRef)
    return () => ctx.revert()
  }, [animate])

  return (
    <div ref={containerRef} style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap: 0 }}>
      {nodes.map((node, i) => (
        <div key={node.id} style={{ display:'flex', alignItems:'center' }}>
          <div className="fd-box" style={{
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: 8, padding: '8px 14px', fontSize: 12,
            fontWeight: 500, whiteSpace: 'nowrap', textAlign: 'center',
            transition: 'all 0.2s',
          }}>
            {node.label}
          </div>
          {i < nodes.length - 1 && (
            <div className="fd-arrow" style={{ color:'var(--primary)', fontSize: 18, margin: '0 4px' }}>→</div>
          )}
        </div>
      ))}
    </div>
  )
}

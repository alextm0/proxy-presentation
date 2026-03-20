import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Slide02Problem({ onIntercept, slideStep, advanceStep }) {
  const term1Ref    = useRef(null)
  const term2Ref    = useRef(null)
  const questionRef = useRef(null)
  const containerRef = useRef(null)

  // Register intercept: step 0 → reveal question; step 1 → pass through
  useEffect(() => {
    onIntercept?.(() => {
      if (slideStep === 0) { advanceStep(); return true }
      return false
    })
  }, [slideStep])

  // Auto: terminal lines stagger in on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [term1Ref.current, term2Ref.current],
        { opacity:0, x:-12 },
        { opacity:1, x:0, duration:0.35, stagger:0.5, ease:'power2.out', delay:0.4 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Step 1: reveal question
  useEffect(() => {
    if (slideStep >= 1 && questionRef.current) {
      gsap.fromTo(questionRef.current,
        { opacity:0, y:10 },
        { opacity:1, y:0, duration:0.4, ease:'power2.out' }
      )
    }
  }, [slideStep])

  const imgGrid = Array.from({ length: 12 }).map((_, i) => (
    <div key={i} style={{
      background:'#E8E0CC', borderRadius:6, aspectRatio:'4/3',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:22, color:'#B8960C',
    }}>🖼</div>
  ))

  return (
    <div className="slide-shell" ref={containerRef}>
      <h2 className="slide-title">You're building a photo gallery app.</h2>
      <p className="slide-subtitle">A classic problem every developer encounters.</p>

      <div className="two-col" style={{ flex:1, alignItems:'center' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {imgGrid}
        </div>

        <div>
          <div className="terminal">
            <div ref={term1Ref} style={{ opacity:0 }}>
              <span style={{ color:'#EF9A9A' }}>❌ Without proxy:</span><br/>
              <span style={{ color:'#9E9E9E' }}>&nbsp;&nbsp;"Loaded 12 images... </span>
              <span style={{ color:'#EF9A9A', fontWeight:600 }}>8400ms</span>
              <span style={{ color:'#9E9E9E' }}> startup"</span>
            </div>
            <div ref={term2Ref} style={{ opacity:0, marginTop:14 }}>
              <span style={{ color:'#A5D6A7' }}>✅ With proxy:</span><br/>
              <span style={{ color:'#9E9E9E' }}>&nbsp;&nbsp;"Loaded 0 images... &nbsp;</span>
              <span style={{ color:'#A5D6A7', fontWeight:600 }}>120ms</span>
              <span style={{ color:'#9E9E9E' }}> startup"</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={questionRef} style={{ opacity:0, marginTop:24, textAlign:'center' }}>
        <p style={{ fontSize:20, fontWeight:700, color:'var(--primary)' }}>
          Why load 12 images if the user might only view 2?
        </p>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

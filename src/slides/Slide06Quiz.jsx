import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import CodeBlock from '../components/code/CodeBlock'

const QUIZ_LINES = [
  { tokens:[{text:'Image ',type:'type'},{text:'a',type:'plain'},{text:' = new ',type:'keyword'},{text:'ImageProxy',type:'type'},{text:'(',type:'plain'},{text:'"cat.jpg"',type:'string'},{text:');',type:'plain'}] },
  { tokens:[{text:'Image ',type:'type'},{text:'b',type:'plain'},{text:' = new ',type:'keyword'},{text:'ImageProxy',type:'type'},{text:'(',type:'plain'},{text:'"dog.jpg"',type:'string'},{text:');',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'a.',type:'plain'},{text:'display',type:'method'},{text:'(); ',type:'plain'},{text:'// call 1',type:'comment'}] },
  { tokens:[{text:'b.',type:'plain'},{text:'display',type:'method'},{text:'(); ',type:'plain'},{text:'// call 2',type:'comment'}] },
  { tokens:[{text:'a.',type:'plain'},{text:'display',type:'method'},{text:'(); ',type:'plain'},{text:'// call 3',type:'comment'}] },
]

const ANSWER_LINES = [
  { text:'a.display() → "Loading cat.jpg..."', note:'← 1st time only', green:true },
  { text:'              "Displaying cat.jpg"',  note:'', green:false },
  { text:'b.display() → "Loading dog.jpg..."', note:'← 1st time only', green:true },
  { text:'              "Displaying dog.jpg"',  note:'', green:false },
  { text:'a.display() →',                       note:'← already loaded, SKIPPED!', gold:true },
  { text:'              "Displaying cat.jpg"',  note:'', green:false },
]

export default function Slide06Quiz() {
  const [revealed, setRevealed] = useState(false)
  const answerRef  = useRef(null)
  const heightRef  = useRef(0)

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.style.height = 'auto'
      heightRef.current = answerRef.current.scrollHeight
      answerRef.current.style.height = '0px'
      answerRef.current.style.overflow = 'hidden'
      answerRef.current.style.opacity = '0'
    }
  }, [])

  function reveal() {
    if (revealed) return
    setRevealed(true)
    gsap.to(answerRef.current, {
      height: heightRef.current,
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
      onComplete: () => {
        if (answerRef.current) answerRef.current.style.overflow = 'visible'
      }
    })
  }

  return (
    <div className="slide-shell" style={{ alignItems:'center' }}>
      <h2 className="slide-title" style={{ textAlign:'center' }}>🤔 What does this print?</h2>
      <p className="slide-subtitle" style={{ textAlign:'center' }}>Think before you click.</p>

      <div style={{ width:'100%', maxWidth:560 }}>
        <CodeBlock lines={QUIZ_LINES} lang="java" />
      </div>

      <p style={{ fontSize:18, fontWeight:700, color:'var(--primary)', margin:'20px 0 16px', textAlign:'center' }}>
        How many times does "Loading..." print?
      </p>

      {!revealed && (
        <button className="reveal-btn" onClick={reveal}>▶ Reveal Answer</button>
      )}

      <div ref={answerRef} style={{ width:'100%', maxWidth:620, marginTop:16 }}>
        <div style={{
          background:'var(--code-bg)', borderRadius:8, padding:'16px 20px',
          fontFamily:"'JetBrains Mono',monospace", fontSize:13, lineHeight:1.9,
        }}>
          {ANSWER_LINES.map((l, i) => (
            <div key={i} style={{
              background: l.green ? 'var(--success)' : 'transparent',
              color: l.gold ? 'var(--primary)' : l.green ? 'var(--success-text)' : 'var(--text)',
              borderRadius:4, padding:'1px 6px',
            }}>
              {l.text}
              {l.note && <span style={{ color:'var(--text-faint)', marginLeft:10, fontSize:11 }}>{l.note}</span>}
            </div>
          ))}
        </div>

        <div className="callout-gold" style={{ marginTop:16, display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
          <span style={{
            background:'var(--primary)', color:'#fff', borderRadius:20,
            padding:'4px 14px', fontSize:13, fontWeight:700, whiteSpace:'nowrap',
          }}>2 loads</span>
          <span>The proxy <strong>remembered</strong>. That's caching / lazy loading.</span>
        </div>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

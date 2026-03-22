import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePresentation } from '../hooks/usePresentation'
import MagicCodeBlock from '../components/code/MagicCodeBlock'

const step1 = `// 1. THE STUDENT'S CODE (THE ILLUSION)
// Your IDE shows 'user' and 'findMany' because 
// Prisma generated types from your schema.

const users = await prisma.user.findMany({
    where: { active: true }
});

// ⚡ 'user' doesn't exist. 'findMany' doesn't exist.
// They are fabricated at runtime by Proxies.`

const step2 = `// 2. THE FIRST PROXY (MODEL SELECTION)
// Inside getPrismaClient.ts:
const client = new Proxy({}, {
    get(target, modelName) {
        // Does our schema have this model?
        if (dmmf.hasModel(modelName)) {
            // Return ANOTHER Proxy for this model
            return createModelProxy(modelName);
        }
    }
})`

const step3 = `// 3. THE SECOND PROXY (ACTION SELECTION)
function createModelProxy(model) {
    return new Proxy({}, {
        get(target, action) {
            // 'action' = 'findMany', 'create', etc.
            return (...args) => {
                // Combine everything and execute
                return executeRequest({ model, action, args });
            }
        }
    })
}`

const step4 = `// 4. THE EXECUTION (RUST BRIDGE)
async function executeRequest(params) {
    const { model, action, args } = params;
    
    // Serialized to JSON and sent to Rust Engine
    const query = serialize(model, action, args);
    
    return await queryEngine.execute({ query });
}`

const CODE_STEPS = [step1, step2, step3, step4]

const STEP_HIGHLIGHTS = [
  [],           // Step 0 (Intro)
  [4, 5],       // Step 1 (Usage - findMany call)
  [3, 5, 7],    // Step 2 (First Proxy Trap)
  [3, 5, 7],    // Step 3 (Second Proxy Trap)
  [2, 5, 7],    // Step 4 (Execution - Rust Bridge)
]

function PrismaFlowSVG() {
  return (
    <svg width="100%" viewBox="0 0 320 320" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', maxHeight: '100%' }}>
      <defs>
        <linearGradient id="prisma-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D3748" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>
        <marker id="prisma-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-faint)" />
        </marker>
      </defs>

      {/* Layer 1: The Call */}
      <rect x="20" y="20" width="120" height="40" rx="6" fill="#E8F4FD" stroke="#1565C0" strokeWidth="1.5" />
      <text x="80" y="45" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1565C0" fontFamily="JetBrains Mono">prisma.user.find()</text>
      
      <line x1="80" y1="60" x2="80" y2="90" stroke="#1565C0" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />
      <text x="90" y="80" fontSize="8" fill="#1565C0">Method Call</text>

      {/* Layer 2: The Proxy Fabric */}
      <rect x="40" y="100" width="240" height="100" rx="12" fill="rgba(45,55,72,0.03)" stroke="#2D3748" strokeWidth="2" strokeDasharray="5 3" />
      <text x="160" y="120" textAnchor="middle" fontSize="11" fontWeight="800" fill="#2D3748">The Proxy Fabric</text>

      {/* Trap */}
      <rect x="60" y="135" width="90" height="45" rx="4" fill="#FFFDE7" stroke="#B8960C" strokeWidth="1.5" />
      <text x="105" y="150" textAnchor="middle" fontSize="9" fontWeight="700" fill="#B8960C">get() Trap</text>
      <text x="105" y="165" textAnchor="middle" fontSize="8" fill="#B8960C">"Is 'user' a model?"</text>

      <line x1="150" y1="157" x2="180" y2="157" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />

      {/* DMMF */}
      <rect x="190" y="135" width="80" height="45" rx="4" fill="#E2E8F0" stroke="#4A5568" strokeWidth="1.5" />
      <text x="230" y="150" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4A5568">DMMF</text>
      <text x="230" y="165" textAnchor="middle" fontSize="8" fill="#4A5568">(The Schema Map)</text>

      <line x1="160" y1="200" x2="160" y2="230" stroke="#2D3748" strokeWidth="2" markerEnd="url(#prisma-arrow)" />
      <text x="170" y="220" fontSize="8" fill="#2D3748">Serialized JSON</text>

      {/* Layer 3: Rust Engine */}
      <rect x="60" y="240" width="200" height="60" rx="8" fill="url(#prisma-grad)" stroke="#2D3748" strokeWidth="1.5" />
      <text x="160" y="265" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Rust Query Engine</text>
      <text x="160" y="282" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.7)">SQL Generation & Execution</text>
      <text x="245" y="290" fontSize="12">🦀</text>
    </svg>
  )
}

function ContextCard() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.s08c-header', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      gsap.fromTo('.s08c-viz', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.2)' })
      gsap.fromTo('.s08c-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.4, ease: 'power2.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center', padding: '10px 0' }}>
      
      {/* Header Section */}
      <div className="s08c-header" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 60, height: 60, background: 'var(--text)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, fontSize: 32, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>▲</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 36, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            Prisma ORM
          </h1>
          <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: 16, fontWeight: 500 }}>
            The Double Proxy Fabrication
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <span className="badge" style={{ padding: '6px 12px', fontSize: 13 }}>TypeScript</span>
          <span className="badge success" style={{ padding: '6px 12px', fontSize: 13 }}>Virtual Proxy</span>
        </div>
      </div>

      {/* Main Visualization: The Illusion vs Reality */}
      <div className="s08c-viz" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, background: 'var(--surface-faint)', padding: 24, borderRadius: 24, border: '1px solid var(--border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
        
        {/* Left Side: Illusion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎭</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#3182CE', letterSpacing: 1 }}>IDE & TYPES (THE ILLUSION)</span>
          </div>
          <div style={{ background: 'white', border: '1px solid #BEE3F8', borderRadius: 12, padding: 16, boxShadow: '0 4px 12px rgba(49,130,206,0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#3182CE' }} />
            <pre style={{ margin: 0, fontSize: 13, color: '#2C5282', fontFamily: 'JetBrains Mono', lineHeight: 1.6 }}>
              {`prisma.user.findMany()   ✓\nprisma.post.create()     ✓\nprisma.order.delete()    ✓`}
            </pre>
            <div style={{ marginTop: 12, fontSize: 11, color: '#3182CE', fontStyle: 'italic', borderTop: '1px dashed #E2E8F0', paddingTop: 8 }}>
              "Everything exists at compile-time"
            </div>
          </div>
        </div>

        {/* Right Side: Reality */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'center', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⚙️</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#D69E2E', letterSpacing: 1 }}>JS RUNTIME (THE REALITY)</span>
          </div>
          <div style={{ background: 'white', border: '1px solid #FEEBC8', borderRadius: 12, padding: 16, boxShadow: '0 4px 12px rgba(214,158,46,0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#D69E2E' }} />
            <pre style={{ margin: 0, fontSize: 13, color: '#744210', fontFamily: 'JetBrains Mono', lineHeight: 1.6 }}>
              {`Object.keys(prisma) = []\n\n// Fabricated on the fly\n// via Proxy traps`}
            </pre>
            <div style={{ marginTop: 12, fontSize: 11, color: '#D69E2E', fontStyle: 'italic', borderTop: '1px dashed #FEEBC8', paddingTop: 8 }}>
              "Nothing exists until you touch it"
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { title: 'DMMF-Driven', desc: 'Metadata dictates the proxy behavior.', icon: '🗺️' },
          { title: 'Zero Boilerplate', desc: 'No manual entity classes needed.', icon: '✨' },
          { title: 'Rust Core', desc: 'JSON protocol to Rust engine.', icon: '🦀' },
          { title: 'Type Illusion', desc: 'Auto-generated TS interfaces.', icon: '🔮' },
        ].map((s, i) => (
          <div key={i} className="s08c-card" style={{ 
            background: 'white', border: '1px solid var(--border)', 
            borderRadius: 16, padding: 16, boxShadow: 'var(--shadow)',
            display: 'flex', flexDirection: 'column', gap: 8,
            transition: 'transform 0.2s ease', cursor: 'default'
          }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.4 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="s08c-card callout-gold" style={{ fontSize: 14, padding: '14px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          Prisma doesn't just lazy-load data — it <strong>lazy-loads the entire API surface</strong>.
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 600 }}>
          Press <kbd style={{ background: 'rgba(184,150,12,0.1)', border: '1px solid rgba(184,150,12,0.2)', padding: '2px 8px', borderRadius: 6, margin: '0 4px' }}>H</kbd> to see the code →
        </span>
      </div>

    </div>
  )
}


function CodeView({ codeStep }) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.s07v-left', { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.38, ease: 'power2.out' })
      gsap.fromTo('.s07v-right', { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.38, delay: 0.1, ease: 'power2.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  const filenames = [
    'app.ts',
    'getPrismaClient.ts',
    'createModelProxy.ts',
    'queryEngine.ts'
  ]

  return (
    <div ref={ref} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, minHeight: 0, alignItems: 'stretch' }}>
      <div className="s07v-left" style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <MagicCodeBlock 
          codeSteps={CODE_STEPS} 
          activeStep={codeStep} 
          stepHighlights={STEP_HIGHLIGHTS} 
          lang="typescript" 
          height="100%" 
          filename={filenames[codeStep]}
          permanentHighlights={true}
        />
      </div>
      <div className="s08v-right" style={{
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '14px 16px',
        boxShadow: 'var(--shadow)', gap: 10,
      }}>
        <p style={{ flexShrink: 0, fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'JetBrains Mono',monospace", margin: 0 }}>
          The Request Lifecycle
        </p>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <PrismaFlowSVG />
        </div>
        <div className="callout-gold" style={{ flexShrink: 0, fontSize: 11, padding: '10px 14px', textAlign: 'left', lineHeight: 1.5 }}>
          <strong>Double Proxy:</strong> The first proxy catches the <em>Model</em> (user), returning a second proxy to catch the <em>Action</em> (findMany).
        </div>
      </div>
    </div>
  )
}

export default function Slide08Prisma() {
  const { highlightStep } = usePresentation()
  const isCodeView = highlightStep >= 1
  const codeStep = (highlightStep - 1) % CODE_STEPS.length

  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>
          {isCodeView ? 'Prisma — The Double Proxy' : 'OSS Example: Prisma ORM'}
        </h2>
        <span className="badge">TypeScript</span>
        {isCodeView && <span className="badge success">Virtual Proxy</span>}
        {isCodeView && (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)', fontFamily: "'JetBrains Mono',monospace", border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4 }}>
            @prisma/client · getPrismaClient.ts
          </span>
        )}
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 8 }}>
        {isCodeView
          ? <>Step {codeStep + 1} of {CODE_STEPS.length} · How the double-proxy fabrication works</>
          : 'Prisma doesn\'t just lazy-load data. It invents the entire API surface.'}
      </p>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {isCodeView ? <CodeView codeStep={codeStep} /> : <ContextCard />}
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePresentation } from '../hooks/usePresentation'
import MagicCodeBlock from '../components/code/MagicCodeBlock'

const step1 = `// 1. THE STUDENT'S CODE (THE USAGE)
// Mark a relationship as LAZY to prevent "N+1" problems.
@Entity
public class Order {
    @Id private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer; // <-- The Proxy will live here
}`

const step2 = `// 2. TRIGGERING THE PROXY (CLIENT VIEW)
Order order = repository.findById(1L);
// At this point, order.getCustomer() returns a PROXY.
// No SQL has been fired for the Customer yet!

System.out.println("Order ID: " + order.getId());

// ⚡ THIS triggers the Proxy to fetch the real data:
String name = order.getCustomer().getName();`

const step3 = `// 3. BEHIND THE SCENES: THE DYNAMIC SUBCLASS
// Hibernate uses ByteBuddy to generate this at runtime.
public class Customer$HibernateProxy extends Customer 
    implements HibernateProxy {
    
    private LazyInitializer interceptor;

    @Override
    public String getName() {
        // Every method call is caught by the Proxy!
        return (String) interceptor.getImplementation().getName();
    }
}`

const step4 = `// 4. THE INTERCEPTOR (THE BRAINS)
// AbstractLazyInitializer.java
public final Object getImplementation() {
    if (!initialized) {
        // ⚡ THE SQL TRIGGER
        // If not loaded, fetch from DB now!
        this.target = session.immediateLoad(entityName, id);
        this.initialized = true;
    }
    // Forward the call to the real object
    return target;
}`

const CODE_STEPS = [step1, step2, step3, step4]

const STEP_HIGHLIGHTS = [
  [],           // Step 0 (Intro)
  [6, 7],       // Step 1 (Lazy Mapping)
  [1, 8],       // Step 2 (Triggering the Proxy)
  [2, 3, 10],   // Step 3 (Proxy Class Structure)
  [3, 6, 7, 10], // Step 4 (The SQL Trigger & Delegation)
]

function HibernateFlowSVG() {
  return (
    <svg width="100%" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', maxHeight: '100%' }}>
      <defs>
        <marker id="arrow-gold" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#B8960C" />
        </marker>
        <marker id="arrow-red" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#C62828" />
        </marker>
        <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#2E7D32" />
        </marker>
      </defs>

      {/* 1. The Call */}
      <rect x="10" y="60" width="70" height="34" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
      <text x="45" y="81" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text)">App Code</text>
      
      <path d="M80 77 L125 77" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#arrow-gold)" />
      <text x="102" y="70" textAnchor="middle" fontSize="8" fill="#B8960C" fontWeight="700">.getName()</text>

      {/* 2. The Proxy (The Interceptor) */}
      <rect x="135" y="40" width="100" height="74" rx="8" fill="rgba(184,150,12,0.05)" stroke="#B8960C" strokeWidth="2" strokeDasharray="4 2" />
      <text x="185" y="58" textAnchor="middle" fontSize="10" fontWeight="800" fill="#B8960C">Customer$Proxy</text>
      <rect x="145" y="68" width="80" height="36" rx="4" fill="#FFFDE7" stroke="#B8960C" strokeWidth="1" />
      <text x="185" y="83" textAnchor="middle" fontSize="8" fontWeight="700" fill="#B8960C">Check Flag</text>
      <text x="185" y="94" textAnchor="middle" fontSize="7" fill="#B8960C">(initialized?)</text>

      {/* 3. The Fetch (Branch) */}
      <path d="M185 114 L185 140" stroke="#C62828" strokeWidth="1.5" markerEnd="url(#arrow-red)" />
      <text x="190" y="130" fontSize="8" fill="#C62828" fontWeight="700">1. SQL</text>
      <rect x="145" y="145" width="80" height="24" rx="4" fill="#FFEBEE" stroke="#C62828" strokeWidth="1" />
      <text x="185" y="160" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C62828">Session</text>

      {/* 4. The Real Object */}
      <path d="M225 157 Q 340 157 340 114" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-green)" />
      <text x="282" y="166" textAnchor="middle" fontSize="8" fill="#2E7D32" fontWeight="700">2. Inflate</text>

      <rect x="290" y="40" width="100" height="74" rx="8" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="2" />
      <text x="340" y="58" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2E7D32">Real Object</text>
      <text x="340" y="85" textAnchor="middle" fontSize="18">👤</text>

      {/* 5. Delegation */}
      <path d="M235 77 L285 77" stroke="#2E7D32" strokeWidth="1.5" markerEnd="url(#arrow-green)" />
      <text x="260" y="70" textAnchor="middle" fontSize="8" fill="#2E7D32" fontWeight="700">3. Delegate</text>
    </svg>
  )
}




function ContextCard() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.s07c-logo', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' })
      gsap.fromTo('.s07c-viz', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: 'back.out(1.2)' })
      gsap.fromTo('.s07c-stat', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.4, ease: 'power2.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, alignItems: 'center', overflow: 'hidden' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="s07c-logo" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 50, lineHeight: 1 }}>🐘</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, color: 'var(--text)' }}>
              Hibernate ORM
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-faint)', fontSize: 14 }}>
              The dynamic subclassing engine.
            </p>
          </div>
        </div>

        <div className="s07c-teaser callout-gold" style={{ fontSize: 15, padding: '16px 20px', lineHeight: 1.6 }}>
          Hibernate uses <strong>ByteBuddy</strong> to generate a hidden subclass of your entity at runtime.
          <br /><br />
          This "Ghost" object holds an ID but no data. It intercepts every method call to trigger a database fetch <em>only when needed</em>.
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <span className="badge">Lazy Loading</span>
            <span className="badge success">Proxy Pattern</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '👻', title: 'Hollow Proxy', desc: 'Initially contains only the primary key.' },
            { icon: '⚡', title: 'On-Demand SQL', desc: 'SQL fires only when a non-ID getter is called.' },
            { icon: '🚫', title: 'Detached Danger', desc: 'Closing the session too early leads to LazyInitializationException.' },
          ].map((s, i) => (
            <div key={i} className="s07c-stat" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="s07c-viz" style={{ 
        background: 'var(--surface)', border: '2px solid var(--border)', 
        borderRadius: '24px', padding: '30px', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{ position: 'absolute', top: 20, left: 20, fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', letterSpacing: 1 }}>THE GHOST SUBCLASS</div>
        
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 10, filter: 'grayscale(1) opacity(0.5)' }}>📦 Customer</div>
          <div style={{ fontSize: 24, color: 'var(--text-faint)' }}>↓ extends ↓</div>
          <div style={{ 
            marginTop: 15, padding: '20px', border: '2px dashed #B8960C', borderRadius: 16,
            background: 'rgba(184,150,12,0.05)', position: 'relative'
          }}>
             <div style={{ fontSize: 40, filter: 'drop-shadow(0 0 10px rgba(184,150,12,0.3))' }}>👻 Customer$Proxy</div>
             <div style={{ fontSize: 11, color: '#B8960C', fontWeight: 700, marginTop: 10 }}>RUNTIME GENERATED</div>
          </div>
        </div>

        <div style={{ marginTop: 30, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', fontStyle: 'italic' }}>
          "The application thinks it's a Customer,<br/>but it's actually a ByteBuddy ghost."
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            Press <kbd style={{ background: 'var(--surface-faint)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 4 }}>H</kbd> to see the code →
          </span>
        </div>
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
    'Order.java',
    'Main.java',
    'Customer$HibernateProxy.java',
    'AbstractLazyInitializer.java'
  ]

  return (
    <div ref={ref} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, minHeight: 0, alignItems: 'stretch' }}>
      <div className="s07v-left" style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <MagicCodeBlock 
          codeSteps={CODE_STEPS} 
          activeStep={codeStep} 
          stepHighlights={STEP_HIGHLIGHTS} 
          lang="java" 
          height="100%" 
          filename={filenames[codeStep]}
          permanentHighlights={true}
        />
      </div>
      <div className="s07v-right" style={{
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '14px 16px',
        boxShadow: 'var(--shadow)', gap: 10,
      }}>
        <p style={{ flexShrink: 0, fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'JetBrains Mono',monospace", margin: 0 }}>
          The Lazy Loading Lifecycle
        </p>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <HibernateFlowSVG />
        </div>
        <div className="callout-gold" style={{ flexShrink: 0, fontSize: 11, padding: '10px 14px', textAlign: 'left', lineHeight: 1.5 }}>
          <strong>Virtual Proxy:</strong> The proxy stands in for the real object until a method call forces its creation/loading.
        </div>
      </div>
    </div>
  )
}

export default function Slide07Hibernate() {
  const { highlightStep } = usePresentation()
  const isCodeView = highlightStep >= 1
  const codeStep = (highlightStep - 1) % CODE_STEPS.length

  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>
          {isCodeView ? 'JPA / Hibernate — Lazy Proxy' : 'OSS Example: Hibernate ORM'}
        </h2>
        <span className="badge">Java</span>
        {isCodeView && <span className="badge success">Virtual Proxy</span>}
        {isCodeView && (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)', fontFamily: "'JetBrains Mono',monospace", border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4 }}>
            hibernate-core · ByteBuddyProxyFactory.java
          </span>
        )}
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 8 }}>
        {isCodeView
          ? <>Step {codeStep + 1} of {CODE_STEPS.length} · Usage and Implementation</>
          : 'A Virtual Proxy used by nearly every Enterprise Java application.'}
      </p>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {isCodeView ? <CodeView codeStep={codeStep} /> : <ContextCard />}
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

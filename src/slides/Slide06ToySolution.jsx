import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePresentation } from '../hooks/usePresentation'
import MagicCodeBlock from '../components/code/MagicCodeBlock'

const step1 = `public interface NotificationSender {
    void send(Notification n);
}

public class ExternalSender implements NotificationSender {
    @Override
    public void send(Notification n) {
        client.send(n);
    }
}`

const step2 = `public class SenderProxy implements NotificationSender {
    private final NotificationSender real;

    public SenderProxy(NotificationSender real) {
        this.real = real;
    }

    @Override
    public void send(Notification n) {
        real.send(n);
    }
}`

const step3 = `public class SenderProxy implements NotificationSender {
    @Override
    public void send(Notification n) {
        if (!env.isProduction()) {
            log("[DEV] Skip: " + n.to());
            return;
        }

        real.send(n);
    }
}`

const step4 = `public class SenderProxy implements NotificationSender {
    @Override
    public void send(Notification n) {
        if (!env.isProduction()) return;

        if (blacklist.contains(n.to())) return;

        if (rateLimiter.isExceeded()) {
            throw new LimitException();
        }

        real.send(n);
    }
}`

const step5 = `NotificationSender real = new ExternalSender();

NotificationSender proxy = new SenderProxy(
    real, env, blacklist, limiter
);

proxy.send(notification);`

const CODE_STEPS = [step1, step2, step3, step4, step5]

// Step-by-step highlights (Indices based on non-empty lines, skipping comments where possible)
const STEP_HIGHLIGHTS = [
    [0, 1, 4, 5, 6, 7],   // Interface & Real Subject
    [0, 1, 3, 4, 7, 8, 9],  // Proxy structure & Delegation
    [3, 4, 5, 8],           // Protection Logic
    [3, 5, 7, 8, 11],       // Multiple concerns
    [0, 2, 3, 6],           // Client wiring
]

function ArchitecturalNotes({ activeStep }) {
  const ref = useRef(null)
  
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 })
  }, [activeStep])

  const notes = [
    {
      title: 'Foundation: The Contract',
      points: [
        'The Interface is the shared language.',
        'The Real Subject remains "pure" and focused.',
        'It has no idea that proxies or rules even exist.'
      ],
      type: 'structure'
    },
    {
      title: 'The Transparent Shell',
      points: [
        'The Proxy implements the same Interface.',
        'It holds a reference (Composition) to the real one.',
        'Key: The method signature never changes.'
      ],
      type: 'proxy'
    },
    {
      title: 'The Gatekeeper (Protection)',
      points: [
        'Intercepts the call before it hits the Real Subject.',
        'Can decide to "short-circuit" (return early).',
        'Perfect for security or environment checks.'
      ],
      type: 'protection'
    },
    {
      title: 'Composition over Complexity',
      points: [
        'We add features without modifying existing code.',
        'The Real Subject stays simple and testable.',
        'The Proxy orchestrates "cross-cutting concerns".'
      ],
      type: 'logic'
    },
    {
      title: 'The "Invisible" Hand',
      points: [
        'The Client only sees the Interface.',
        'Dependency Injection swaps the Proxy in.',
        'Zero changes required in the Client business logic.'
      ],
      type: 'usage'
    }
  ]

  const current = notes[activeStep]

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ 
        background: 'var(--success)', 
        borderLeft: '4px solid #2E7D32', 
        padding: '16px 20px', 
        borderRadius: '0 12px 12px 0', 
        boxShadow: 'var(--shadow)' 
      }}>
        <h3 style={{ margin: 0, fontSize: 18, color: 'var(--text)', fontFamily: 'DM Sans' }}>{current.title}</h3>
      </div>
      
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {current.points.map((p, i) => (
          <li key={i} style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>{p}</li>
        ))}
      </ul>

      {activeStep === 4 && (
        <div className="callout-gold" style={{ marginTop: 20, padding: 16, fontSize: 13, borderColor: '#2E7D32', background: '#E8F5E9', color: '#1B5E20' }}>
          💡 <strong>Key Takeaway:</strong> We solved the problem by <strong>wrapping</strong> logic instead of <strong>bloating</strong> the service. SRP is preserved!
        </div>
      )}
    </div>
  )
}

export default function Slide06ToySolution() {
  const { highlightStep } = usePresentation()
  const activeStep = highlightStep % CODE_STEPS.length

  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>Toy Example: The Proxy Solution</h2>
        <span className="badge">Java</span>
        <span className="badge success">Proxy Pattern (Clean)</span>
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 16 }}>
        Step {activeStep + 1} of {CODE_STEPS.length} · Restoring Sanity through Composition.
      </p>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, minHeight: 0 }}>
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <MagicCodeBlock 
            codeSteps={CODE_STEPS} 
            activeStep={activeStep} 
            stepHighlights={STEP_HIGHLIGHTS}
            lang="java"
            height="100%"
            filename={activeStep === 0 ? "NotificationSender.java" : activeStep === 4 ? "Main.java" : "SenderProxy.java"}
            permanentHighlights={true}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 10 }}>
           <div style={{ background: 'var(--success)', border: '1px solid #A5D6A7', borderRadius: 8, padding: 12 }}>
             <p style={{ fontSize: 10, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, margin: '0 0 8px 0' }}>
               The Architectural Win
             </p>
             <code style={{ fontSize: 12, color: '#1B5E20', fontWeight: 700 }}>Open/Closed Principle</code>
             <p style={{ fontSize: 12, color: '#388E3C', margin: '4px 0 0 0' }}>
               New rules can be added via new Proxies <strong>without ever touching</strong> the core Sender or the Client.
             </p>
          </div>

          <p style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, margin: 0 }}>
            Architectural Insights
          </p>
          <ArchitecturalNotes activeStep={activeStep} />
        </div>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

import { usePresentation } from '../hooks/usePresentation'
import MagicCodeBlock from '../components/code/MagicCodeBlock'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const naiveStep1 = `public class NaiveNotificationService {
    private Environment env;
    private BlacklistService blacklist;
    private RateLimiter rateLimiter;

    public void send(Notification n) {
        if (!env.isProduction()) {
            System.out.println("[DEV] Skip send: " + n);
            return;
        }
        
        new ExternalProviderClient().send(n);
    }
}`

const naiveStep2 = `public class NaiveNotificationService {
    private Environment env;
    private BlacklistService blacklist;
    private RateLimiter rateLimiter;

    public void send(Notification n) {
        if (!env.isProduction()) {
            System.out.println("[DEV] Skip send: " + n);
            return;
        }
        
        if (blacklist.isBlacklisted(n.getRecipient())) {
            return;
        }
        
        new ExternalProviderClient().send(n);
    }
}`

const naiveStep3 = `public class NaiveNotificationService {
    private Environment env;
    private BlacklistService blacklist;
    private RateLimiter rateLimiter;

    public void send(Notification n) {
        if (!env.isProduction()) {
            System.out.println("[DEV] Skip send: " + n);
            return;
        }
        
        if (blacklist.isBlacklisted(n.getRecipient())) {
            return;
        }
        
        if (!rateLimiter.allow(n.getRecipient())) {
            throw new TooManyRequestsException();
        }

        new ExternalProviderClient().send(n);
    }
}`

const CODE_STEPS = [naiveStep1, naiveStep2, naiveStep3]

// Essential functional lines (excluding empty lines and any lines that are ONLY brackets)
const STEP_HIGHLIGHTS = [
  [1, 2, 3, 6, 7, 8, 11],                     // Initial structure + Env logic
  [11, 12],                                   // Added Blacklist check
  [15, 16],                                   // Added Rate Limiting
]

function ProblemNotes({ activeStep }) {
  const ref = useRef(null)
  
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 })
  }, [activeStep])

  const notes = [
    {
      title: 'The Single Responsibility Trap',
      points: [
        'The service starts simple: just send notifications.',
        'But we must protect production from test data.',
        'Logic is still manageable, but pollution begins.'
      ],
      type: 'warning'
    },
    {
      title: 'Mixing Business with Infrastructure',
      points: [
        'Now we add blacklisting logic.',
        'The "send" method is becoming a traffic cop.',
        'Testing this requires mocking multiple dependencies.'
      ],
      type: 'danger'
    },
    {
      title: 'The "God Method" Emerges',
      points: [
        'Rate limiting added. The class now has 4 concerns.',
        'Violates SRP: One change affects multiple features.',
        'Hard to reuse: What if we want Rate Limiting without Blacklisting?'
      ],
      type: 'critical'
    }
  ]

  const current = notes[activeStep]

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ 
        background: activeStep === 2 ? '#FFEBEE' : '#FFF9EE', 
        borderLeft: `4px solid ${activeStep === 2 ? '#C62828' : '#B8960C'}`, 
        padding: '16px 20px', 
        borderRadius: '0 12px 12px 0', 
        boxShadow: 'var(--shadow)' 
      }}>
        <h3 style={{ margin: 0, fontSize: 18, color: 'var(--text)', fontFamily: 'DM Sans' }}>{current.title}</h3>
      </div>
      
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {current.points.map((p, i) => (
          <li key={i} style={{ color: 'var(--text-faint)', fontSize: 14, lineHeight: 1.5 }}>{p}</li>
        ))}
      </ul>

      {activeStep === 2 && (
        <div className="callout-gold" style={{ marginTop: 20, padding: 16, fontSize: 13, borderColor: '#C62828', background: '#FFEBEE', color: '#B71C1C' }}>
          🚫 <strong>Anti-Pattern:</strong> The class is tightly coupled to infrastructure concerns. It is no longer just a "Notification Service".
        </div>
      )}
    </div>
  )
}

export default function Slide05ToyProblem() {
  const { highlightStep } = usePresentation()
  const activeStep = highlightStep % CODE_STEPS.length

  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>Toy Example: The Problem</h2>
        <span className="badge">Java</span>
        <span className="badge error">Anti-Pattern (Tightly Coupled)</span>
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 16 }}>
        Step {activeStep + 1} of {CODE_STEPS.length} · Watch how the service loses its original focus.
      </p>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, minHeight: 0 }}>
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <MagicCodeBlock 
            codeSteps={CODE_STEPS} 
            activeStep={activeStep} 
            stepHighlights={STEP_HIGHLIGHTS}
            lang="java"
            height="100%"
            filename="NaiveNotificationService.java"
            permanentHighlights={true}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 10 }}>
          <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
             <p style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, margin: '0 0 8px 0' }}>
               The External Dependency
             </p>
             <code style={{ fontSize: 12, color: 'var(--text-secondary)' }}>ExternalProviderClient</code>
             <p style={{ fontSize: 12, color: 'var(--text-faint)', margin: '4px 0 0 0' }}>
               A 3rd-party library we <strong>cannot</strong> modify. It has no security, no limits, no logging.
             </p>
          </div>

          <p style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, margin: 0 }}>
            Evolution of the Mess
          </p>
          <ProblemNotes activeStep={activeStep} />
        </div>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

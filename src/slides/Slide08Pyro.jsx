import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePresentation } from '../hooks/usePresentation'
import MagicCodeBlock from '../components/code/MagicCodeBlock'

const step1 = `# 1) CLIENT CODE (looks local)
import Pyro5.api

with Pyro5.api.Proxy("PYRO:bank@10.0.0.8:9090") as bank:
    balance = bank.get_balance("alice")
    bank.transfer("alice", "bob", 25.0)`

const step2 = `# 2) PROXY INTERCEPTION (Pyro5/client.py)
def __getattr__(self, name):
    if not self._pyroMethods and not self._pyroAttrs:
        self._pyroGetMetadata()
    if name in self._pyroAttrs:
        return self._pyroInvoke("__getattr__", (name,), None)
    return _RemoteMethod(self._pyroInvoke, name, self._pyroMaxRetries)`

const step3 = `# 3) REMOTE METHOD WRAPPER
class _RemoteMethod:
    def __call__(self, *args, **kwargs):
        return self.__send(self.__name, args, kwargs)

# __send is Proxy._pyroInvoke`

const step4 = `# 4) NETWORK DISPATCH
def _pyroInvoke(self, methodname, vargs, kwargs, flags=0, objectId=None):
    data = serializer.dumpsCall(objectId, methodname, vargs, kwargs)
    msg = protocol.SendingMessage(protocol.MSG_INVOKE, ...)
    self._pyroConnection.send(msg.data)
    msg = protocol.recv_stub(self._pyroConnection, [protocol.MSG_RESULT])
    return serializer.loads(msg.data)`

const CODE_STEPS = [step1, step2, step3, step4]

const STEP_HIGHLIGHTS = [
  [],
  [3, 4],
  [1, 4, 6],
  [1, 2, 4],
  [2, 3, 4, 6],
]

const VERIFY_URL = 'https://raw.githubusercontent.com/irmen/Pyro5/master/Pyro5/client.py'
const VERIFY_DOC_URL = 'https://pyro5.readthedocs.io/en/latest/clientcode.html'

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
    <div ref={ref} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'center', padding: '10px 0' }}>
      <div className="s08c-header" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 60, height: 60, background: '#203A43', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, fontSize: 28, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>🌐</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 36, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            Pyro5 Remote Objects
          </h1>
          <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: 16, fontWeight: 500 }}>
            Python Remote Proxy in Production
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <span className="badge" style={{ padding: '6px 12px', fontSize: 13 }}>Python</span>
          <span className="badge success" style={{ padding: '6px 12px', fontSize: 13 }}>Remote Proxy</span>
        </div>
      </div>

      <div className="s08c-viz" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, background: 'var(--surface-faint)', padding: 24, borderRadius: 24, border: '1px solid var(--border)' }}>
        <div style={{ background: 'white', border: '1px solid #D6E4FF', borderRadius: 14, padding: 18 }}>
          <p style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 800, color: '#2F5AA8', letterSpacing: 1 }}>WHAT CLIENT CODE LOOKS LIKE</p>
          <pre style={{ margin: 0, fontSize: 13, color: '#2F5AA8', fontFamily: 'JetBrains Mono', lineHeight: 1.7 }}>
{`bank = Pyro5.api.Proxy(uri)
bank.transfer("alice", "bob", 25.0)`}
          </pre>
          <p style={{ margin: '12px 0 0 0', fontSize: 12, color: '#2F5AA8' }}>
            Reads like a normal local object call.
          </p>
        </div>
        <div style={{ background: 'white', border: '1px solid #FFE5B4', borderRadius: 14, padding: 18 }}>
          <p style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 800, color: '#B8960C', letterSpacing: 1 }}>WHAT THE PROXY ACTUALLY DOES</p>
          <pre style={{ margin: 0, fontSize: 13, color: '#8A6D00', fontFamily: 'JetBrains Mono', lineHeight: 1.7 }}>
{`__getattr__ -> _RemoteMethod
_RemoteMethod(...) -> _pyroInvoke(...)
_pyroInvoke -> serialize + send + recv`}
          </pre>
          <p style={{ margin: '12px 0 0 0', fontSize: 12, color: '#8A6D00' }}>
            Method calls are marshaled over the network.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { title: 'Remote Proxy', desc: 'Represents a remote object locally.', icon: '🛰️' },
          { title: 'Method Trap', desc: '__getattr__ returns dynamic call wrapper.', icon: '🪤' },
          { title: 'Wire Protocol', desc: 'Serialize call, send, receive result.', icon: '📡' },
          { title: 'Transparent API', desc: 'Client code stays ergonomic.', icon: '✨' },
        ].map((s, i) => (
          <div key={i} className="s08c-card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: 14, boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)', marginTop: 6 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4, lineHeight: 1.4 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="s08c-card callout-gold" style={{ fontSize: 13, padding: '12px 16px', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span>
          Verification: Pyro5 `Proxy` intercepts method calls and dispatches remote invocations.
        </span>
        <a href={VERIFY_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text)', fontWeight: 700, textDecoration: 'underline' }}>
          Open source link
        </a>
      </div>
    </div>
  )
}

function CodeView({ codeStep }) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.s08v-left', { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.38, ease: 'power2.out' })
      gsap.fromTo('.s08v-right', { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.38, delay: 0.1, ease: 'power2.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  const filenames = [
    'client.py',
    'Pyro5/client.py',
    '_RemoteMethod',
    '_pyroInvoke'
  ]

  return (
    <div ref={ref} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, minHeight: 0, alignItems: 'stretch' }}>
      <div className="s08v-left" style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <MagicCodeBlock
          codeSteps={CODE_STEPS}
          activeStep={codeStep}
          stepHighlights={STEP_HIGHLIGHTS}
          lang="python"
          height="100%"
          filename={filenames[codeStep]}
          permanentHighlights
        />
      </div>
      <div className="s08v-right" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: 'var(--shadow)', gap: 14 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'JetBrains Mono',monospace" }}>
          Why this is a different proxy type
        </p>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="callout-gold" style={{ fontSize: 12, padding: '10px 12px', lineHeight: 1.5 }}>
            <strong>Type:</strong> Remote Proxy (not Virtual/Lazy).
          </div>
          <div className="callout-gold" style={{ fontSize: 12, padding: '10px 12px', lineHeight: 1.5 }}>
            <strong>Control point:</strong> hides serialization/network/protocol details.
          </div>
          <div className="callout-gold" style={{ fontSize: 12, padding: '10px 12px', lineHeight: 1.5 }}>
            <strong>Client illusion:</strong> remote call looks like local method call.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Slide08Pyro() {
  const { highlightStep } = usePresentation()
  const isCodeView = highlightStep >= 1
  const codeStep = (highlightStep - 1) % CODE_STEPS.length

  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>
          {isCodeView ? 'Pyro5 — Remote Proxy Dispatch' : 'OSS Example (Python): Pyro5'}
        </h2>
        <span className="badge">Python</span>
        <span className="badge success">Remote Proxy</span>
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 8 }}>
        {isCodeView
          ? <>Step {codeStep + 1} of {CODE_STEPS.length} · How Pyro5 turns local-looking calls into network invocations</>
          : 'Pyro5 Proxy intercepts method calls and transparently forwards them to remote Python objects.'}
      </p>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {isCodeView ? <CodeView codeStep={codeStep} /> : <ContextCard />}
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

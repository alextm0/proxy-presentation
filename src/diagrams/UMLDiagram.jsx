import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// step: 0=empty, 1=interface, 2=realsubject+impl arrow, 3=proxy+has-a arrow, 4=client+uses arrow, 5=callout
export default function UMLDiagram({ step = 0 }) {
  const ifaceRef     = useRef(null)
  const realRef      = useRef(null)
  const implArrRef   = useRef(null)
  const proxyRef     = useRef(null)
  const hasAArrRef   = useRef(null)
  const clientRef    = useRef(null)
  const usesArrRef   = useRef(null)
  const calloutRef   = useRef(null)

  useEffect(() => {
    const allRefs = [ifaceRef, realRef, implArrRef, proxyRef, hasAArrRef, clientRef, usesArrRef, calloutRef]
    const show = (ref) => { if (ref.current) gsap.to(ref.current, { opacity:1, y:0, duration:0.4, ease:'power2.out' }) }

    // Reset all to hidden
    allRefs.forEach(r => { if (r.current) gsap.set(r.current, { opacity:0, y:8 }) })

    if (step >= 1) show(ifaceRef)
    if (step >= 2) { show(realRef); show(implArrRef) }
    if (step >= 3) { show(proxyRef); show(hasAArrRef) }
    if (step >= 4) { show(clientRef); show(usesArrRef) }
    if (step >= 5) show(calloutRef)
  }, [step])

  return (
    <svg width="560" height="340" viewBox="0 0 560 340" style={{ overflow:'visible' }}>
      <defs>
        <marker id="uml-ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill="#B8960C"/>
        </marker>
      </defs>

      {/* Interface — top center */}
      <g ref={ifaceRef} style={{ opacity:0 }}>
        <rect x="200" y="10" width="160" height="68" rx="8" fill="#FFFDE7" stroke="#B8960C" strokeWidth="2"/>
        <text x="280" y="32" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#B8960C" fontFamily="Inter,sans-serif">«interface»</text>
        <text x="280" y="48" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1A1A1A" fontFamily="Inter,sans-serif">Subject</text>
        <line x1="200" y1="55" x2="360" y2="55" stroke="#E8E0CC" strokeWidth="1"/>
        <text x="280" y="70" textAnchor="middle" fontSize="11" fill="#6A1B9A" fontFamily="JetBrains Mono,monospace">+ request()</text>
      </g>

      {/* RealSubject — right */}
      <g ref={realRef} style={{ opacity:0 }}>
        <rect x="390" y="160" width="160" height="70" rx="8" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
        <text x="470" y="182" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1A1A1A" fontFamily="Inter,sans-serif">RealSubject</text>
        <line x1="390" y1="190" x2="550" y2="190" stroke="#E8E0CC" strokeWidth="1"/>
        <text x="470" y="208" textAnchor="middle" fontSize="11" fill="#6A1B9A" fontFamily="JetBrains Mono,monospace">+ request()</text>
      </g>
      {/* implements arrow */}
      <g ref={implArrRef} style={{ opacity:0 }}>
        <line x1="470" y1="160" x2="340" y2="78" stroke="#B8960C" strokeWidth="1.5" strokeDasharray="6,3" markerEnd="url(#uml-ah)"/>
        <text x="415" y="110" fontSize="10" fill="#B8960C" fontFamily="Inter,sans-serif">implements</text>
      </g>

      {/* Proxy — center */}
      <g ref={proxyRef} style={{ opacity:0 }}>
        <rect x="190" y="160" width="170" height="92" rx="8" fill="#FFFDE7" stroke="#B8960C" strokeWidth="2"/>
        <text x="275" y="182" textAnchor="middle" fontSize="13" fontWeight="600" fill="#B8960C" fontFamily="Inter,sans-serif">Proxy</text>
        <line x1="190" y1="190" x2="360" y2="190" stroke="#E8E0CC" strokeWidth="1"/>
        <text x="275" y="208" textAnchor="middle" fontSize="10" fill="#1565C0" fontFamily="JetBrains Mono,monospace">- realSubject</text>
        <line x1="190" y1="214" x2="360" y2="214" stroke="#E8E0CC" strokeWidth="1"/>
        <text x="275" y="232" textAnchor="middle" fontSize="11" fill="#6A1B9A" fontFamily="JetBrains Mono,monospace">+ request()</text>
      </g>
      {/* has-a arrow */}
      <g ref={hasAArrRef} style={{ opacity:0 }}>
        <line x1="360" y1="200" x2="390" y2="200" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#uml-ah)"/>
        <text x="362" y="216" fontSize="10" fill="#B8960C" fontFamily="Inter,sans-serif">has-a</text>
      </g>

      {/* Client — left */}
      <g ref={clientRef} style={{ opacity:0 }}>
        <rect x="20" y="160" width="120" height="50" rx="8" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
        <text x="80" y="190" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1A1A1A" fontFamily="Inter,sans-serif">Client</text>
      </g>
      {/* uses arrow */}
      <g ref={usesArrRef} style={{ opacity:0 }}>
        <line x1="140" y1="185" x2="190" y2="192" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#uml-ah)"/>
        <text x="145" y="176" fontSize="10" fill="#B8960C" fontFamily="Inter,sans-serif">uses</text>
      </g>

      {/* Callout bubble */}
      <g ref={calloutRef} style={{ opacity:0 }}>
        <rect x="30" y="285" width="500" height="48" rx="10" fill="#FFF8E1" stroke="#B8960C" strokeWidth="1.5"/>
        <text x="280" y="307" textAnchor="middle" fontSize="12" fontWeight="600" fill="#B8960C" fontFamily="Inter,sans-serif">Client calls Proxy.</text>
        <text x="280" y="324" textAnchor="middle" fontSize="12" fill="#555" fontFamily="Inter,sans-serif">Proxy decides whether to call RealSubject.</text>
      </g>
    </svg>
  )
}

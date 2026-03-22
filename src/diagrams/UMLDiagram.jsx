import { useRef } from 'react'

/**
 * UMLDiagram component for Proxy Design Pattern
 * Static version with all elements visible.
 */
export default function UMLDiagram() {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg 
        viewBox="0 0 800 460" 
        width="100%" 
        height="100%" 
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible', maxWidth: '900px' }}
      >
        <defs>
          {/* UML Standard Arrows */}
          <marker id="uml-usage" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
            <path d="M0,0 L12,5 L0,10" fill="none" stroke="#555" strokeWidth="1.5" />
          </marker>
          
          <marker id="uml-implementation" markerWidth="14" markerHeight="14" refX="13" refY="7" orient="auto">
            <polygon points="0,0 13,7 0,14" fill="white" stroke="#B8960C" strokeWidth="1.5" />
          </marker>

          <marker id="uml-association" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
            <path d="M0,0 L12,5 L0,10" fill="none" stroke="#B8960C" strokeWidth="2" />
          </marker>

          <filter id="uml-box-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#B8960C" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* --- Client & Subject --- */}
        <g className="uml-client-subject">
          {/* Client Box */}
          <rect x="50" y="50" width="160" height="60" rx="8" fill="#FFF" stroke="#E8E0CC" strokeWidth="1.5" filter="url(#uml-box-shadow)" />
          <text x="130" y="88" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A" fontFamily="DM Sans, sans-serif">Client</text>

          {/* Subject Interface */}
          <g transform="translate(320, 30)">
            <rect x="0" y="0" width="180" height="100" rx="8" fill="#FFFDE7" stroke="#B8960C" strokeWidth="2" filter="url(#uml-box-shadow)" />
            <text x="90" y="25" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#B8960C" fontFamily="Inter, sans-serif">«interface»</text>
            <text x="90" y="45" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A" fontFamily="DM Sans, sans-serif">Subject</text>
            <line x1="0" y1="55" x2="180" y2="55" stroke="#E8E0CC" strokeWidth="1" />
            <text x="15" y="78" fontSize="13" fill="#6A1B9A" fontFamily="JetBrains Mono, monospace">+ request()</text>
          </g>

          {/* Client -> Subject Usage */}
          <path d="M 210 80 L 320 80" fill="none" stroke="#555" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#uml-usage)" />
          <text x="265" y="70" textAnchor="middle" fontSize="10" fill="#888" fontFamily="Inter, sans-serif" fontWeight="600">«uses»</text>
        </g>

        {/* --- RealSubject --- */}
        <g className="uml-realsubject">
          <g transform="translate(500, 260)">
            <rect x="0" y="0" width="220" height="120" rx="8" fill="#FFF" stroke="#E8E0CC" strokeWidth="1.5" filter="url(#uml-box-shadow)" />
            <text x="110" y="35" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A" fontFamily="DM Sans, sans-serif">RealSubject</text>
            <line x1="0" y1="45" x2="220" y2="45" stroke="#E8E0CC" strokeWidth="1" />
            <line x1="0" y1="75" x2="220" y2="75" stroke="#E8E0CC" strokeWidth="1" />
            <text x="15" y="65" fontSize="11" fill="#888" fontFamily="JetBrains Mono, monospace">// core logic</text>
            <text x="15" y="100" fontSize="13" fill="#6A1B9A" fontFamily="JetBrains Mono, monospace">+ request()</text>
          </g>

          {/* RealSubject -> Subject Implementation */}
          <path d="M 610 260 L 610 210 L 410 210 L 410 130" fill="none" stroke="#B8960C" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#uml-implementation)" />
        </g>

        {/* --- Proxy --- */}
        <g className="uml-proxy">
          <g transform="translate(80, 260)">
            <rect x="0" y="0" width="240" height="140" rx="8" fill="#FFFDE7" stroke="#B8960C" strokeWidth="2" filter="url(#uml-box-shadow)" />
            <text x="120" y="35" textAnchor="middle" fontSize="18" fontWeight="700" fill="#B8960C" fontFamily="DM Sans, sans-serif">Proxy</text>
            <line x1="0" y1="45" x2="240" y2="45" stroke="#E8E0CC" strokeWidth="1" />
            <text x="15" y="65" fontSize="12" fill="#1565C0" fontFamily="JetBrains Mono, monospace">- realSubject: Subject</text>
            <line x1="0" y1="75" x2="240" y2="75" stroke="#E8E0CC" strokeWidth="1" />
            <text x="15" y="100" fontSize="13" fill="#6A1B9A" fontFamily="JetBrains Mono, monospace">+ request()</text>
            <text x="15" y="122" fontSize="10" fill="#555" fontFamily="Inter, sans-serif" opacity="0.7">if (!realSubject) init()</text>
          </g>

          {/* Proxy -> Subject Implementation */}
          <path d="M 200 260 L 200 210 L 410 210 L 410 130" fill="none" stroke="#B8960C" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#uml-implementation)" />
        </g>

        {/* --- Delegation --- */}
        <g className="uml-delegation">
          {/* Proxy -> RealSubject Association/Delegation */}
          <path d="M 320 310 L 500 310" fill="none" stroke="#B8960C" strokeWidth="2" markerEnd="url(#uml-association)" />
          <text x="410" y="300" textAnchor="middle" fontSize="12" fill="#B8960C" fontFamily="Inter, sans-serif" fontWeight="700">delegates to</text>
          
          {/* Background Highlight for Proxy delegation */}
          <rect x="15" y="90" width="210" height="25" rx="4" fill="#B8960C" fillOpacity="0.05" transform="translate(80, 260)" />
        </g>

        {/* --- Legend --- */}
        <g transform="translate(50, 440)">
          <line x1="0" y1="0" x2="40" y2="0" stroke="#555" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#uml-usage)" />
          <text x="50" y="4" fontSize="11" fill="#555" fontWeight="600" fontFamily="Inter, sans-serif">usage</text>

          <line x1="130" y1="0" x2="170" y2="0" stroke="#B8960C" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#uml-implementation)" />
          <text x="180" y="4" fontSize="11" fill="#B8960C" fontWeight="600" fontFamily="Inter, sans-serif">implements</text>

          <line x1="280" y1="0" x2="320" y2="0" stroke="#B8960C" strokeWidth="2" markerEnd="url(#uml-association)" />
          <text x="330" y="4" fontSize="11" fill="#B8960C" fontWeight="700" fontFamily="Inter, sans-serif">delegation</text>
        </g>
      </svg>
    </div>
  )
}

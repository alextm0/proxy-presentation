export default function ProxyCoverSVG() {
  return (
    <svg width="680" height="120" viewBox="0 0 680 120">
      <defs>
        <marker id="ah" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0,12 4,0 8" fill="#B8960C" />
        </marker>
        <marker id="ah-gray" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0,12 4,0 8" fill="#888888" />
        </marker>
      </defs>
      {/* Client */}
      <rect x="4" y="24" width="160" height="72" rx="14" fill="#FFFFFF" stroke="#E8E0CC" strokeWidth="2"/>
      <text x="84" y="60" textAnchor="middle" fontSize="20" fontFamily="DM Sans,sans-serif" fontWeight="700" fill="#333">Client</text>
      <text x="84" y="80" textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono,monospace" fill="#888">caller</text>

      {/* Arrow 1 */}
      <line x1="166" y1="60" x2="246" y2="60" stroke="#B8960C" strokeWidth="2.5" markerEnd="url(#ah)"/>
      <text x="206" y="50" textAnchor="middle" fontSize="14" fontFamily="Inter,sans-serif" fontWeight="600" fill="#B8960C">calls</text>

      {/* Proxy — gold highlight */}
      <rect x="250" y="8" width="180" height="104" rx="16" fill="#FFFDE7" stroke="#B8960C" strokeWidth="3"/>
      <text x="340" y="62" textAnchor="middle" fontSize="28" fontFamily="DM Sans,sans-serif" fontWeight="800" fill="#B8960C">Proxy</text>
      <text x="340" y="86" textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono,monospace" fill="#B8960C" opacity="0.8">«same interface»</text>

      {/* Arrow 2 */}
      <line x1="432" y1="60" x2="502" y2="60" stroke="#888888" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#ah-gray)"/>
      <text x="467" y="50" textAnchor="middle" fontSize="14" fontFamily="Inter,sans-serif" fontWeight="600" fill="#666666">maybe</text>

      {/* RealSubject */}
      <rect x="506" y="24" width="170" height="72" rx="14" fill="#FFFFFF" stroke="#E8E0CC" strokeWidth="2"/>
      <text x="591" y="58" textAnchor="middle" fontSize="20" fontFamily="DM Sans,sans-serif" fontWeight="700" fill="#333">RealSubject</text>
      <text x="591" y="80" textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono,monospace" fill="#888">request()</text>
    </svg>
  )
}

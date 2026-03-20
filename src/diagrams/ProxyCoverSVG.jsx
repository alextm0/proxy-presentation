export default function ProxyCoverSVG() {
  return (
    <svg width="340" height="130" viewBox="0 0 340 130">
      <defs>
        <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill="#B8960C" />
        </marker>
      </defs>
      {/* Client */}
      <rect x="4" y="40" width="90" height="50" rx="10" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="49" y="70" textAnchor="middle" fontSize="13" fontFamily="DM Sans,sans-serif" fill="#555">Client</text>
      {/* Arrow 1 */}
      <line x1="95" y1="65" x2="122" y2="65" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#ah)"/>
      {/* Proxy — gold */}
      <rect x="124" y="34" width="92" height="62" rx="10" fill="#FFFDE7" stroke="#B8960C" strokeWidth="2"/>
      <text x="170" y="65" textAnchor="middle" fontSize="13" fontFamily="DM Sans,sans-serif" fontWeight="600" fill="#B8960C">Proxy</text>
      {/* Arrow 2 */}
      <line x1="216" y1="65" x2="243" y2="65" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#ah)"/>
      {/* RealSubject */}
      <rect x="245" y="40" width="90" height="50" rx="10" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="290" y="63" textAnchor="middle" fontSize="12" fontFamily="DM Sans,sans-serif" fill="#555">Real</text>
      <text x="290" y="78" textAnchor="middle" fontSize="12" fontFamily="DM Sans,sans-serif" fill="#555">Subject</text>
    </svg>
  )
}

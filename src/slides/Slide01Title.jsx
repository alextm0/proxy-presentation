import ProxyCoverSVG from '../diagrams/ProxyCoverSVG'

export default function Slide01Title() {
  return (
    <div className="slide-shell" style={{ justifyContent:'center' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:700 }}>
        <span className="badge" style={{ marginBottom:14, alignSelf:'flex-start' }}>Structural Patterns</span>
        <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:64, fontWeight:700, lineHeight:1.1, marginBottom:8 }}>
          <span className="gold-shimmer">Proxy</span>
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:22, color:'var(--primary)', fontWeight:500, marginBottom:16 }}>
          Design Pattern
        </p>
        <p style={{ fontSize:14, color:'var(--text-secondary)' }}>Alex Toma · Design Patterns Course · 2026</p>
      </div>
      <div className="cover-diagram" style={{ position:'absolute', right:80, top:'50%', transform:'translateY(-50%)' }}>
        <ProxyCoverSVG />
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

import CodeBlock from '../components/code/CodeBlock'

const LINES = [
  { tokens:[{text:'// Your original service',type:'comment'}] },
  { tokens:[{text:'@Service',type:'keyword'}] },
  { tokens:[{text:'public class ',type:'keyword'},{text:'WeatherService',type:'type'},{text:' {',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { id:'cacheable-annotation', tokens:[{text:'    @Cacheable(',type:'keyword'},{text:'"weather"',type:'string'},{text:')',type:'keyword'},{text:'  // ← this IS a proxy',type:'comment'}] },
  { tokens:[{text:'    public ',type:'keyword'},{text:'Weather ',type:'type'},{text:'getWeather',type:'method'},{text:'(String city) {',type:'plain'}] },
  { tokens:[{text:'        return weatherApi.',type:'plain'},{text:'fetch',type:'method'},{text:'(city); ',type:'plain'},{text:'// real HTTP call',type:'comment'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'}',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'// What Spring generates at runtime:',type:'comment'}] },
  { id:'spring-proxy-class', tokens:[{text:'public class ',type:'keyword'},{text:'WeatherService$SpringProxy',type:'type'},{text:' {',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'    public ',type:'keyword'},{text:'Weather ',type:'type'},{text:'getWeather',type:'method'},{text:'(String city) {',type:'plain'}] },
  { id:'cache-contains', tokens:[{text:'        if ',type:'keyword'},{text:'(cache.',type:'plain'},{text:'contains',type:'method'},{text:'(city)) {',type:'plain'}] },
  { tokens:[{text:'            return cache.',type:'plain'},{text:'get',type:'method'},{text:'(city); ',type:'plain'},{text:'// proxy intercepts',type:'comment'}] },
  { tokens:[{text:'        }',type:'plain'}] },
  { tokens:[{text:'        Weather result = super.',type:'plain'},{text:'getWeather',type:'method'},{text:'(city);',type:'plain'}] },
  { tokens:[{text:'        cache.',type:'plain'},{text:'put',type:'method'},{text:'(city, result);',type:'plain'}] },
  { tokens:[{text:'        return result;',type:'plain'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'}',type:'plain'}] },
]

const HIGHLIGHTS = [
  { lineId:'cacheable-annotation', label:'💡 You write this. Spring generates the proxy.' },
  { lineId:'spring-proxy-class',   label:'💡 This class is auto-created at runtime by Spring AOP' },
  { lineId:'cache-contains',       label:'💡 Identical to our null-check — same pattern, bigger scale' },
]

function CacheBranchSVG() {
  return (
    <svg width="180" height="265" viewBox="0 0 180 265">
      <defs>
        <marker id="sa" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#B8960C"/>
        </marker>
      </defs>
      <rect x="45" y="2" width="90" height="30" rx="6" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="90" y="22" textAnchor="middle" fontSize="11" fill="#555" fontFamily="Inter,sans-serif">Client</text>
      <line x1="90" y1="32" x2="90" y2="50" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#sa)"/>
      <rect x="30" y="50" width="120" height="30" rx="6" fill="#FFFDE7" stroke="#B8960C" strokeWidth="1.5"/>
      <text x="90" y="70" textAnchor="middle" fontSize="11" fontWeight="600" fill="#B8960C" fontFamily="Inter,sans-serif">Spring Proxy</text>
      <line x1="90" y1="80" x2="90" y2="98" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#sa)"/>
      <polygon points="90,102 138,126 90,150 42,126" fill="#FFFDE7" stroke="#B8960C" strokeWidth="1.5"/>
      <text x="90" y="123" textAnchor="middle" fontSize="10" fill="#B8960C" fontFamily="Inter,sans-serif">Cache</text>
      <text x="90" y="137" textAnchor="middle" fontSize="10" fill="#B8960C" fontFamily="Inter,sans-serif">hit?</text>
      <line x1="42" y1="126" x2="14" y2="170" stroke="#2E7D32" strokeWidth="1.5" markerEnd="url(#sa)"/>
      <text x="6" y="158" fontSize="9" fill="#2E7D32" fontFamily="Inter,sans-serif">YES</text>
      <rect x="0" y="170" width="62" height="32" rx="6" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="1.5"/>
      <text x="31" y="188" textAnchor="middle" fontSize="10" fill="#2E7D32" fontFamily="Inter,sans-serif">Return</text>
      <text x="31" y="198" textAnchor="middle" fontSize="10" fill="#2E7D32" fontFamily="Inter,sans-serif">cached ✓</text>
      <line x1="138" y1="126" x2="163" y2="163" stroke="#9E9E9E" strokeWidth="1.5" markerEnd="url(#sa)"/>
      <text x="150" y="153" fontSize="9" fill="#9E9E9E" fontFamily="Inter,sans-serif">NO</text>
      <rect x="118" y="163" width="60" height="30" rx="6" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="148" y="181" textAnchor="middle" fontSize="9" fill="#555" fontFamily="Inter,sans-serif">WeatherService</text>
      <line x1="148" y1="193" x2="148" y2="213" stroke="#9E9E9E" strokeWidth="1.5" markerEnd="url(#sa)"/>
      <rect x="108" y="213" width="80" height="28" rx="6" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="148" y="231" textAnchor="middle" fontSize="9" fill="#555" fontFamily="Inter,sans-serif">Store + Return</text>
    </svg>
  )
}

export default function Slide07Spring({ highlightStep }) {
  return (
    <div className="slide-shell">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
        <h2 className="slide-title" style={{ marginBottom:0 }}>Production: Spring @Cacheable</h2>
        <span className="badge">Java</span>
        <span className="badge">Spring Boot</span>
        <span className="badge">50k+ ⭐</span>
      </div>
      <p className="slide-subtitle">Spring wraps your method in a proxy that checks the cache before calling you.</p>

      <div className="two-col-code" style={{ flex:1 }}>
        <div style={{ overflowY:'auto', maxHeight:'calc(100vh - 175px)' }}>
          <CodeBlock lines={LINES} highlights={HIGHLIGHTS} highlightStep={highlightStep} lang="java" />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16, alignItems:'center', paddingTop:8 }}>
          <CacheBranchSVG />
          <a href="https://github.com/spring-projects/spring-framework" target="_blank" rel="noopener noreferrer" className="chip" style={{ fontSize:11 }}>
            spring-projects/spring-framework · ProxyFactory.java ↗
          </a>
        </div>
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

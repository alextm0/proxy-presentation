import CodeBlock from '../components/code/CodeBlock'
import FlowDiagram from '../diagrams/FlowDiagram'

const LINES = [
  { tokens:[{text:'// OkHttp Interceptor — each one is a Proxy for the next',type:'comment'}] },
  { id:'interceptor-interface', tokens:[{text:'public interface ',type:'keyword'},{text:'Interceptor',type:'type'},{text:' {',type:'plain'}] },
  { tokens:[{text:'    ',type:'plain'},{text:'Response ',type:'type'},{text:'intercept',type:'method'},{text:'(',type:'plain'},{text:'Chain ',type:'type'},{text:'chain) throws ',type:'plain'},{text:'IOException',type:'type'},{text:';',type:'plain'}] },
  { tokens:[{text:'}',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'public class ',type:'keyword'},{text:'AuthInterceptor',type:'type'},{text:' implements ',type:'keyword'},{text:'Interceptor',type:'type'},{text:' {',type:'plain'}] },
  { tokens:[{text:'    @Override',type:'keyword'}] },
  { tokens:[{text:'    public ',type:'keyword'},{text:'Response ',type:'type'},{text:'intercept',type:'method'},{text:'(',type:'plain'},{text:'Chain ',type:'type'},{text:'chain) throws ',type:'plain'},{text:'IOException',type:'type'},{text:' {',type:'plain'}] },
  { tokens:[{text:'        Request original = chain.',type:'plain'},{text:'request',type:'method'},{text:'();',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { id:'header-add', tokens:[{text:'        Request withAuth = original.',type:'plain'},{text:'newBuilder',type:'method'},{text:'()',type:'plain'}] },
  { tokens:[{text:'            .',type:'plain'},{text:'header',type:'method'},{text:'(',type:'plain'},{text:'"Authorization"',type:'string'},{text:',',type:'plain'},{text:' "Bearer " + token',type:'string'},{text:')',type:'plain'}] },
  { tokens:[{text:'            .',type:'plain'},{text:'build',type:'method'},{text:'();',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { id:'chain-proceed', tokens:[{text:'        return chain.',type:'plain'},{text:'proceed',type:'method'},{text:'(withAuth); ',type:'plain'},{text:'// forward to next proxy',type:'comment'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'}',type:'plain'}] },
]

const HIGHLIGHTS = [
  { lineId:'interceptor-interface', label:'💡 Same interface for every link in the chain' },
  { lineId:'header-add',            label:'💡 Proxy modifies the request before forwarding' },
  { lineId:'chain-proceed',         label:'💡 chain.proceed() calls the next proxy — not the server' },
]

const CHAIN_NODES = [
  { id:'client',  label:'Client Request' },
  { id:'auth',    label:'AuthProxy',    gold:true },
  { id:'log',     label:'LogProxy',     gold:true },
  { id:'cache',   label:'CacheProxy',   gold:true },
  { id:'network', label:'Network' },
]

export default function Slide08OkHttp({ highlightStep }) {
  return (
    <div className="slide-shell">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
        <h2 className="slide-title" style={{ marginBottom:0 }}>Production: OkHttp Interceptors</h2>
        <span className="badge">Java/Kotlin</span>
        <span className="badge">OkHttp</span>
        <span className="badge">45k+ ⭐</span>
      </div>
      <p className="slide-subtitle">Every HTTP request passes through a chain of interceptors — each one a Proxy for the next.</p>

      <div className="two-col-code" style={{ flex:1 }}>
        <div style={{ overflowY:'auto', maxHeight:'calc(100vh - 175px)' }}>
          <CodeBlock lines={LINES} highlights={HIGHLIGHTS} highlightStep={highlightStep} lang="java" />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20, paddingTop:8 }}>
          <div>
            <p style={{ fontSize:11, color:'var(--text-faint)', marginBottom:10, textTransform:'uppercase', letterSpacing:1, fontFamily:"'JetBrains Mono',monospace" }}>Request flow</p>
            <FlowDiagram nodes={CHAIN_NODES} animate />
          </div>
          <div className="callout-gold" style={{ fontSize:13, textAlign:'left' }}>
            Axios interceptors · Django middleware · Express middleware
            <br/><strong>All proxy chains. Same idea.</strong>
          </div>
          <a href="https://github.com/square/okhttp" target="_blank" rel="noopener noreferrer" className="chip" style={{ fontSize:11, alignSelf:'flex-start' }}>
            square/okhttp · RealInterceptorChain.java ↗
          </a>
        </div>
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

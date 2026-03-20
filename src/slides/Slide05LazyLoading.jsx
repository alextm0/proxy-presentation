import CodeBlock from '../components/code/CodeBlock'

const LINES = [
  { tokens:[{text:'interface ',type:'keyword'},{text:'Image',type:'type'},{text:' {',type:'plain'}] },
  { tokens:[{text:'    void ',type:'keyword'},{text:'display',type:'method'},{text:'();',type:'plain'}] },
  { tokens:[{text:'}',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'class ',type:'keyword'},{text:'RealImage',type:'type'},{text:' implements ',type:'keyword'},{text:'Image',type:'type'},{text:' {',type:'plain'}] },
  { tokens:[{text:'    private final String filename;',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'    ',type:'plain'},{text:'RealImage',type:'method'},{text:'(String filename) {',type:'plain'}] },
  { tokens:[{text:'        this.filename = filename;',type:'plain'}] },
  { id:'expensive-op', tokens:[{text:'        ',type:'plain'},{text:'loadFromDisk',type:'method'},{text:'(); ',type:'plain'},{text:'// 🔴 EXPENSIVE',type:'comment'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'    private void ',type:'keyword'},{text:'loadFromDisk',type:'method'},{text:'() {',type:'plain'}] },
  { tokens:[{text:'        System.out.',type:'plain'},{text:'println',type:'method'},{text:'("Loading " + filename + "...");',type:'plain'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'}',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'class ',type:'keyword'},{text:'ImageProxy',type:'type'},{text:' implements ',type:'keyword'},{text:'Image',type:'type'},{text:' {',type:'plain'}] },
  { id:'null-check-field', tokens:[{text:'    private ',type:'keyword'},{text:'RealImage',type:'type'},{text:' realImage; ',type:'plain'},{text:'// null until needed',type:'comment'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'    ',type:'plain'},{text:'ImageProxy',type:'method'},{text:'(String filename) {',type:'plain'}] },
  { tokens:[{text:'        this.filename = filename; ',type:'plain'},{text:'// ✅ nothing loaded!',type:'comment'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'    public void ',type:'keyword'},{text:'display',type:'method'},{text:'() {',type:'plain'}] },
  { id:'decision-gate', tokens:[{text:'        if ',type:'keyword'},{text:'(realImage == ',type:'plain'},{text:'null',type:'keyword'},{text:') {',type:'plain'}] },
  { tokens:[{text:'            realImage = new ',type:'plain'},{text:'RealImage',type:'type'},{text:'(filename);',type:'plain'}] },
  { tokens:[{text:'        }',type:'plain'}] },
  { tokens:[{text:'        realImage.',type:'plain'},{text:'display',type:'method'},{text:'();',type:'plain'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'}',type:'plain'}] },
]

const HIGHLIGHTS = [
  { lineId:'expensive-op',     label:'💡 The expensive operation — runs on every new RealImage' },
  { lineId:'null-check-field', label:'💡 null = not yet loaded. The proxy remembers here.' },
  { lineId:'decision-gate',    label:'💡 The proxy\'s decision gate — lazy creation lives here' },
]

function DecisionTreeSVG() {
  return (
    <svg width="200" height="280" viewBox="0 0 200 280">
      <defs>
        <marker id="da" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#B8960C"/>
        </marker>
      </defs>
      <rect x="55" y="4" width="90" height="34" rx="7" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="100" y="26" textAnchor="middle" fontSize="11" fontFamily="Inter,sans-serif" fill="#555">client.display()</text>
      <line x1="100" y1="38" x2="100" y2="58" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#da)"/>
      <polygon points="100,62 148,90 100,118 52,90" fill="#FFFDE7" stroke="#B8960C" strokeWidth="1.5"/>
      <text x="100" y="88" textAnchor="middle" fontSize="10" fontFamily="Inter,sans-serif" fill="#B8960C">realImage</text>
      <text x="100" y="102" textAnchor="middle" fontSize="10" fontFamily="Inter,sans-serif" fill="#B8960C">== null?</text>
      <line x1="52" y1="90" x2="18" y2="148" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#da)"/>
      <text x="16" y="136" fontSize="10" fill="#B8960C" fontFamily="Inter,sans-serif">YES</text>
      <rect x="0" y="148" width="76" height="38" rx="7" fill="#FFFDE7" stroke="#B8960C" strokeWidth="1.5"/>
      <text x="38" y="165" textAnchor="middle" fontSize="10" fontFamily="Inter,sans-serif" fill="#B8960C">Create</text>
      <text x="38" y="178" textAnchor="middle" fontSize="10" fontFamily="Inter,sans-serif" fill="#B8960C">RealImage</text>
      <line x1="38" y1="186" x2="76" y2="228" stroke="#B8960C" strokeWidth="1.5" markerEnd="url(#da)"/>
      <line x1="148" y1="90" x2="182" y2="148" stroke="#9E9E9E" strokeWidth="1.5" markerEnd="url(#da)"/>
      <text x="162" y="135" fontSize="10" fill="#9E9E9E" fontFamily="Inter,sans-serif">NO</text>
      <rect x="138" y="148" width="60" height="38" rx="7" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="168" y="165" textAnchor="middle" fontSize="10" fontFamily="Inter,sans-serif" fill="#555">Forward</text>
      <text x="168" y="178" textAnchor="middle" fontSize="10" fontFamily="Inter,sans-serif" fill="#555">directly</text>
      <line x1="148" y1="186" x2="124" y2="228" stroke="#9E9E9E" strokeWidth="1.5" markerEnd="url(#da)"/>
      <rect x="78" y="228" width="50" height="32" rx="7" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="1.5"/>
      <text x="103" y="248" textAnchor="middle" fontSize="11" fontFamily="Inter,sans-serif" fill="#2E7D32">display()</text>
    </svg>
  )
}

export default function Slide05LazyLoading({ highlightStep }) {
  return (
    <div className="slide-shell">
      <h2 className="slide-title">Lazy Loading Proxy — Java</h2>
      <p className="slide-subtitle">Only create the expensive object when it's actually needed.</p>

      <div className="two-col-code" style={{ flex:1, marginTop:8, overflow:'hidden' }}>
        <div style={{ overflowY:'auto', maxHeight:'calc(100vh - 175px)' }}>
          <CodeBlock lines={LINES} highlights={HIGHLIGHTS} highlightStep={highlightStep} lang="java" />
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', paddingTop:16 }}>
          <DecisionTreeSVG />
        </div>
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

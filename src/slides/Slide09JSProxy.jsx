import CodeBlock from '../components/code/CodeBlock'

const LINES = [
  { tokens:[{text:'const ',type:'keyword'},{text:'handler',type:'plain'},{text:' = {',type:'plain'}] },
  { id:'get-trap', tokens:[{text:'    get',type:'method'},{text:'(target, key) {',type:'plain'}] },
  { tokens:[{text:'        console.',type:'plain'},{text:'log',type:'method'},{text:'(',type:'plain'},{text:'`[Proxy] Reading: ${key}`',type:'string'},{text:');',type:'plain'}] },
  { tokens:[{text:'        return Reflect.',type:'plain'},{text:'get',type:'method'},{text:'(target, key);',type:'plain'}] },
  { tokens:[{text:'    },',type:'plain'}] },
  { id:'set-trap', tokens:[{text:'    set',type:'method'},{text:'(target, key, value) {',type:'plain'}] },
  { tokens:[{text:'        console.',type:'plain'},{text:'log',type:'method'},{text:'(',type:'plain'},{text:'`[Proxy] Writing: ${key} = ${value}`',type:'string'},{text:');',type:'plain'}] },
  { id:'schedule-update', tokens:[{text:'        // Vue calls scheduleUpdate() here ← re-render!',type:'comment'}] },
  { tokens:[{text:'        return Reflect.',type:'plain'},{text:'set',type:'method'},{text:'(target, key, value);',type:'plain'}] },
  { tokens:[{text:'    }',type:'plain'}] },
  { tokens:[{text:'};',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'const ',type:'keyword'},{text:'state',type:'plain'},{text:' = new ',type:'plain'},{text:'Proxy',type:'type'},{text:'({ count: ',type:'plain'},{text:'0',type:'number'},{text:' }, handler);',type:'plain'}] },
  { tokens:[{text:'',type:'plain'}] },
  { tokens:[{text:'state.count;       ',type:'plain'},{text:'// "[Proxy] Reading: count"',type:'comment'}] },
  { tokens:[{text:'state.count = ',type:'plain'},{text:'5',type:'number'},{text:';    ',type:'plain'},{text:'// "[Proxy] Writing: count = 5"',type:'comment'}] },
  { tokens:[{text:'//              ↑ Vue re-renders component here',type:'comment'}] },
]

const HIGHLIGHTS = [
  { lineId:'get-trap',        label:'💡 Proxy intercepts every READ of any property' },
  { lineId:'set-trap',        label:'💡 Proxy intercepts every WRITE — Vue hooks here' },
  { lineId:'schedule-update', label:'💡 This is how Vue knows to re-render your component' },
]

function BeforeAfterSVG() {
  return (
    <svg width="200" height="210" viewBox="0 0 200 210">
      <text x="100" y="16" textAnchor="middle" fontSize="11" fontWeight="600" fill="#C62828" fontFamily="Inter,sans-serif">WITHOUT Proxy</text>
      <rect x="8" y="24" width="85" height="28" rx="6" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="50" y="43" textAnchor="middle" fontSize="10" fill="#555" fontFamily="Inter,sans-serif">state.count=5</text>
      <line x1="93" y1="38" x2="115" y2="38" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="130" y="35" fontSize="10" fill="#9E9E9E" fontFamily="Inter,sans-serif">Vue: ??</text>
      <text x="165" y="46" fontSize="16" fill="#C62828">✗</text>

      <line x1="100" y1="68" x2="100" y2="82" stroke="#E8E0CC" strokeWidth="1" strokeDasharray="4,2"/>

      <text x="100" y="98" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2E7D32" fontFamily="Inter,sans-serif">WITH Proxy</text>
      <rect x="8" y="106" width="85" height="28" rx="6" fill="#fff" stroke="#E8E0CC" strokeWidth="1.5"/>
      <text x="50" y="125" textAnchor="middle" fontSize="10" fill="#555" fontFamily="Inter,sans-serif">state.count=5</text>
      <line x1="93" y1="120" x2="106" y2="120" stroke="#B8960C" strokeWidth="1.5"/>
      <rect x="106" y="109" width="52" height="24" rx="5" fill="#FFFDE7" stroke="#B8960C" strokeWidth="1.5"/>
      <text x="132" y="125" textAnchor="middle" fontSize="10" fontWeight="600" fill="#B8960C" fontFamily="Inter,sans-serif">Proxy</text>
      <line x1="158" y1="121" x2="166" y2="121" stroke="#2E7D32" strokeWidth="1.5"/>
      <text x="174" y="115" fontSize="9" fill="#2E7D32" fontFamily="Inter,sans-serif">Vue</text>
      <text x="170" y="126" fontSize="9" fill="#2E7D32" fontFamily="Inter,sans-serif">re-</text>
      <text x="166" y="137" fontSize="9" fill="#2E7D32" fontFamily="Inter,sans-serif">renders</text>
      <text x="172" y="152" fontSize="16" fill="#2E7D32">✓</text>

      <rect x="4" y="172" width="192" height="32" rx="8" fill="#FFF8E1" stroke="#B8960C" strokeWidth="1.5"/>
      <text x="100" y="186" textAnchor="middle" fontSize="10" fill="#B8960C" fontFamily="Inter,sans-serif" fontWeight="600">Every ref() and reactive() in Vue 3</text>
      <text x="100" y="198" textAnchor="middle" fontSize="10" fill="#555" fontFamily="Inter,sans-serif">goes through this exact mechanism</text>
    </svg>
  )
}

export default function Slide09JSProxy({ highlightStep }) {
  return (
    <div className="slide-shell">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
        <h2 className="slide-title" style={{ marginBottom:0 }}>Built-in: JavaScript/TypeScript — Native Proxy</h2>
        <span className="badge">TypeScript</span>
        <span className="badge">ES6+</span>
        <span className="badge">Vue.js</span>
        <span className="badge">MobX</span>
      </div>
      <p className="slide-subtitle">Vue 3's entire reactivity system is built on the native Proxy object.</p>

      <div className="two-col-code" style={{ flex:1 }}>
        <div style={{ overflowY:'auto', maxHeight:'calc(100vh - 175px)' }}>
          <CodeBlock lines={LINES} highlights={HIGHLIGHTS} highlightStep={highlightStep} lang="typescript" />
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, paddingTop:8 }}>
          <BeforeAfterSVG />
          <a href="https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts" target="_blank" rel="noopener noreferrer" className="chip" style={{ fontSize:11 }}>
            vuejs/core · packages/reactivity/reactive.ts ↗
          </a>
        </div>
      </div>
      <div className="bottom-rule" />
    </div>
  )
}

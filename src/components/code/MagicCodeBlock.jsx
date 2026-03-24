import { useEffect, useState, useRef } from 'react'
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import 'shiki-magic-move/dist/style.css'

let globalHighlighter = null
let highlighterPromise = null

export default function MagicCodeBlock({ 
  codeSteps = [], 
  activeStep = 0, 
  stepHighlights = [], 
  lang = 'javascript', 
  theme = 'github-dark', 
  height = '450px', 
  filename = '',
  permanentHighlights = true
}) {
  const [highlighter, setHighlighter] = useState(() => globalHighlighter)
  const containerRef = useRef(null)
  const prevStepRef = useRef(activeStep)

  // Load the shiki highlighter once globally
  useEffect(() => {
    let mounted = true
    if (globalHighlighter) return
    
    if (!highlighterPromise) {
      highlighterPromise = createHighlighter({
        themes: [theme],
        langs: [lang, 'typescript', 'java', 'javascript', 'json', 'rust', 'python'],
      }).then(hl => { globalHighlighter = hl; return hl })
    }
    highlighterPromise.then(hl => {
      if (mounted) setHighlighter(hl)
    })
    return () => { mounted = false }
  }, [theme, lang])

  const currentCode = codeSteps[Math.min(activeStep, codeSteps.length - 1)] || ''

  // Highlight: inject absolutely-positioned overlay divs on the specified lines for each step
  useEffect(() => {
    const isForward = activeStep > prevStepRef.current
    prevStepRef.current = activeStep

    const applyHighlights = () => {
      const container = containerRef.current
      if (!container) return

      const pre = container.querySelector('.shiki-magic-move-container')
      if (!pre) return

      // Clean up previous highlights
      pre.querySelectorAll('.line-highlight').forEach(el => el.remove())

      const items = [...pre.querySelectorAll('.shiki-magic-move-item')]
      if (!items.length) return

      // Find the top of the very first line of code as a baseline
      const preRect = pre.getBoundingClientRect()
      const firstItem = items[0]
      const firstTop = Math.round(firstItem.getBoundingClientRect().top - preRect.top)
      
      // Calculate average line height from the sorted tops
      const distinctTops = [...new Set(items.map(el => Math.round(el.getBoundingClientRect().top)))]
        .sort((a, b) => a - b)
      
      let lineHeight = 24
      if (distinctTops.length > 1) {
        lineHeight = distinctTops[1] - distinctTops[0]
      }

      const addedIndices = stepHighlights[activeStep] || []
      addedIndices.forEach(idx => {
        const topPx = firstTop + idx * lineHeight - 1
        
        const overlay = document.createElement('div')
        overlay.className = 'line-highlight'
        overlay.style.cssText = `
          position: absolute;
          top: ${topPx}px;
          left: 0; right: 0;
          height: ${lineHeight}px;
          background: rgba(77, 124, 255, 0.15);
          border-left: 4px solid #4d7cff;
          box-shadow: inset 0 0 10px rgba(77, 124, 255, 0.1);
          z-index: 0;
        `
        pre.appendChild(overlay)
      })
    }

    const timer = setTimeout(applyHighlights, 700)
    return () => clearTimeout(timer)
  }, [activeStep, stepHighlights, currentCode])

  return (
    <div className="code-block magic-code-container" ref={containerRef} style={{
      display: 'flex',
      flexDirection: 'column',
      height: height,
      maxHeight: height,
      background: '#1E1E2E',
      borderColor: '#313244',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      border: '1px solid #313244',
    }}>
      <style>{`
        .magic-code-scrollable {
          overflow: auto !important;
          flex-grow: 1;
          height: 100%;
          width: 100%;
          scrollbar-gutter: stable;
        }
        .magic-code-scrollable .shiki-magic-move-container {
          padding: 24px 24px 40px 24px;
          min-width: max-content;
          display: block;
          background: transparent !important;
        }
        .magic-code-scrollable::-webkit-scrollbar { width: 8px; height: 8px; }
        .magic-code-scrollable::-webkit-scrollbar-track { background: transparent; }
        .magic-code-scrollable::-webkit-scrollbar-thumb {
          background: rgba(108, 112, 134, 0.4); 
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .magic-code-scrollable::-webkit-scrollbar-thumb:hover { background: rgba(108, 112, 134, 0.6); }
      `}</style>

      {filename && (
        <div className="code-block-header">
          <div className="code-filename-tab">{filename}</div>
        </div>
      )}

      <span className="code-lang-badge" style={{
        zIndex: 10,
        background: 'rgba(50, 50, 50, 0.8)',
        backdropFilter: 'blur(4px)',
        color: '#aaaaaa',
        border: '1px solid #444444',
        position: 'absolute',
        top: filename ? 48 : 12, right: 12,
        borderRadius: '6px',
        padding: '2px 8px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
      }}>{lang}</span>

      <div className="magic-code-scrollable">
        {highlighter ? (
          <ShikiMagicMove
            lang={lang}
            theme={theme}
            highlighter={highlighter}
            code={currentCode}
            options={{ duration: 500, stagger: 0.1, lineNumbers: false }}
            className="shiki-magic-move-container"
          />
        ) : (
          <div style={{ padding: '24px', color: '#6a737d', fontStyle: 'italic', opacity: 0.8 }}>
            Loading…
          </div>
        )}
      </div>
    </div>
  )
}

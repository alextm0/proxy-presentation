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

    // Only auto-highlight on forward moves. For backward/reset, we just rely on the cleanup.
    if (!isForward && activeStep !== 0) return

    // Use the explicitly provided line indices for this step
    const addedIndices = stepHighlights[activeStep] || []
    if (!addedIndices.length) return

    const overlays = []
    let fadeTimer, cleanTimer

    // Wait for ShikiMagicMove animation to complete (duration 500ms + stagger ~100ms buffer)
    const applyTimer = setTimeout(() => {
      const container = containerRef.current
      if (!container) return

      const pre = container.querySelector('.shiki-magic-move-container')
      if (!pre) return

      const items = [...pre.querySelectorAll('.shiki-magic-move-item')]
      if (!items.length) return

      const preRect = pre.getBoundingClientRect()

      // Deduplicate Y offsets to get one entry per logical line
      const topSet = new Set()
      items.forEach(el => {
        const y = Math.round(el.getBoundingClientRect().top - preRect.top)
        if (y >= 0) topSet.add(y)
      })
      const foundTops = [...topSet].sort((a, b) => a - b)
      if (!foundTops.length) return

      // Robust line height and top calculation
      const lines = currentCode.split('\n')
      const firstNonEmptyIdx = lines.findIndex(l => l.trim().length > 0)
      if (firstNonEmptyIdx === -1) return
      
      const firstTop = foundTops[0]
      
      let lineHeight = 22
      const diffs = []
      for (let i = 0; i < foundTops.length - 1; i++) {
        const d = foundTops[i+1] - foundTops[i]
        // Filter out very small diffs (tokens on same line) and find the minimal logical gap
        if (d > 10) diffs.push(d)
      }
      if (diffs.length > 0) {
        lineHeight = Math.min(...diffs)
      }

      addedIndices.forEach(lineIdx => {
        // Calculate top based on real line index, accounting for leading empty lines
        // Add a small 2px offset to center the highlight bar better on the text
        const topPx = firstTop + (lineIdx - firstNonEmptyIdx) * lineHeight + 2
        
        const overlay = document.createElement('div')
        overlay.style.cssText = `
          position: absolute;
          top: ${topPx}px;
          left: 0; right: 0;
          height: ${lineHeight}px;
          background: rgba(184, 150, 12, 0.22);
          border-left: 3px solid #B8960C;
          pointer-events: none;
          z-index: 0;
          box-sizing: border-box;
          opacity: 0;
          transition: opacity 0.3s ease;
        `
        pre.appendChild(overlay)
        overlays.push(overlay)
        // Trigger enter animation
        requestAnimationFrame(() => { overlay.style.opacity = '1' })
      })

      // Fade out after 3s UNLESS permanentHighlights is true
      if (!permanentHighlights) {
        fadeTimer = setTimeout(() => {
          overlays.forEach(el => {
            el.style.transition = 'opacity 0.8s ease'
            el.style.opacity = '0'
          })
          cleanTimer = setTimeout(() => overlays.forEach(el => el.remove()), 900)
        }, 3000)
      }
    }, 650)

    return () => {
      clearTimeout(applyTimer)
      clearTimeout(fadeTimer)
      clearTimeout(cleanTimer)
      overlays.forEach(el => el.remove())
    }
  }, [activeStep, stepHighlights, permanentHighlights, currentCode])

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

import { usePresentation } from '../hooks/usePresentation'

export default function NavControls() {
  const { presentationMode } = usePresentation()

  const btnStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'var(--text)', width: 42, height: 42, borderRadius: '50%',
    cursor: 'pointer', fontSize: 18, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'all 180ms',
  }

  function handleNext() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  }

  function handlePrev() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  }

  if (presentationMode) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 20, zIndex: 100,
    }}>
      <button style={btnStyle} onClick={handlePrev}
        onMouseEnter={e => Object.assign(e.currentTarget.style, { background:'var(--primary)', color:'#fff' })}
        onMouseLeave={e => Object.assign(e.currentTarget.style, { background:'var(--surface)', color:'var(--text)' })}>
        ←
      </button>
      <button style={btnStyle} onClick={handleNext}
        onMouseEnter={e => Object.assign(e.currentTarget.style, { background:'var(--primary)', color:'#fff' })}
        onMouseLeave={e => Object.assign(e.currentTarget.style, { background:'var(--surface)', color:'var(--text)' })}>
        →
      </button>
    </div>
  )
}

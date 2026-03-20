const kbdStyle = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 3, padding: '1px 5px', fontSize: 9,
  fontFamily: "'JetBrains Mono', monospace",
}

export default function KeyboardHint() {
  return (
    <div style={{
      position: 'fixed', bottom: 76, right: 24,
      fontSize: 10, color: 'var(--text-faint)', opacity: 0.7,
      zIndex: 50, fontFamily: "'JetBrains Mono', monospace",
      textAlign: 'right', lineHeight: 1.9,
    }}>
      <kbd style={kbdStyle}>→</kbd> next &nbsp;
      <kbd style={kbdStyle}>←</kbd> prev &nbsp;
      <kbd style={kbdStyle}>P</kbd> notes &nbsp;
      <kbd style={kbdStyle}>H</kbd> highlight &nbsp;
      <kbd style={kbdStyle}>R</kbd> reset
    </div>
  )
}

import { usePresentation } from '../hooks/usePresentation'

export default function SlideCounter() {
  const { currentSlide, totalSlides } = usePresentation()
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 80,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, color: 'var(--text-faint)',
      zIndex: 100,
    }}>
      {currentSlide} / {totalSlides}
    </div>
  )
}

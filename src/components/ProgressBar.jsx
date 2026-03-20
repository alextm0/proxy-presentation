import { useEffect, useRef } from 'react'
import { usePresentation } from '../hooks/usePresentation'
import gsap from 'gsap'

export default function ProgressBar() {
  const { currentSlide, totalSlides } = usePresentation()
  const barRef = useRef(null)

  useEffect(() => {
    const pct = (currentSlide / totalSlides) * 100
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, { width: `${pct}%`, duration: 0.4, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [currentSlide, totalSlides])

  return (
    <div id="progress-bar" ref={barRef} style={{
      position: 'fixed', top: 0, left: 0, height: 3,
      background: 'linear-gradient(90deg, #B8960C, #D4AF37)',
      zIndex: 1000, width: `${(1/11)*100}%`,
    }} />
  )
}

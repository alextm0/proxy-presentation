import { useEffect, useRef, useState, useCallback } from 'react'
import { PresentationProvider, usePresentation } from './hooks/usePresentation'
import ProgressBar    from './components/ProgressBar'
import SlideCounter   from './components/SlideCounter'
import PresenterNotes from './components/PresenterNotes'
import NavControls    from './components/NavControls'
import KeyboardHint   from './components/KeyboardHint'
import gsap           from 'gsap'

import Slide01 from './slides/Slide01Title'
import Slide02 from './slides/Slide02Problem'
import Slide03 from './slides/Slide03Intuition'
import Slide04 from './slides/Slide04UML'
import Slide05 from './slides/Slide05LazyLoading'
import Slide06 from './slides/Slide06Quiz'
import Slide07 from './slides/Slide07Spring'
import Slide08 from './slides/Slide08OkHttp'
import Slide09 from './slides/Slide09JSProxy'
import Slide10 from './slides/Slide10Comparison'
import Slide11 from './slides/Slide11Summary'

const SLIDES = [null,Slide01,Slide02,Slide03,Slide04,Slide05,Slide06,Slide07,Slide08,Slide09,Slide10,Slide11]

function SlideRouter() {
  const { currentSlide, nextSlide, prevSlide,
          advanceStep, slideStep, advanceHighlight, highlightStep,
          toggleNotes, triggerReset, resetKey } = usePresentation()

  const [visible, setVisible]   = useState(currentSlide)
  const [transitioning, setTransitioning] = useState(false)
  const containerRef = useRef(null)
  const interceptRef = useRef(null)

  // Slide transition: exit → unmount → mount → enter
  useEffect(() => {
    if (visible === currentSlide) return
    if (transitioning) return
    setTransitioning(true)
    const el = containerRef.current
    gsap.to(el, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
      setVisible(currentSlide)
      setTransitioning(false)
      gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' })
    }})
  }, [currentSlide])

  // Keyboard handler
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        const intercepted = interceptRef.current?.()
        if (!intercepted) nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'p' || e.key === 'P') {
        toggleNotes()
      } else if (e.key === 'h' || e.key === 'H') {
        advanceHighlight(20)
      } else if (e.key === 'r' || e.key === 'R') {
        triggerReset()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [nextSlide, prevSlide, toggleNotes, advanceHighlight, triggerReset])

  const SlideComponent = SLIDES[visible]
  return (
    <div ref={containerRef} style={{ position:'fixed', inset:0 }}>
      {SlideComponent && (
        <SlideComponent
          key={`${visible}-${resetKey}`}
          onIntercept={(fn) => { interceptRef.current = fn }}
          slideStep={slideStep}
          advanceStep={advanceStep}
          highlightStep={highlightStep}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <PresentationProvider>
      <ProgressBar />
      <SlideRouter />
      <SlideCounter />
      <NavControls />
      <PresenterNotes />
      <KeyboardHint />
    </PresentationProvider>
  )
}

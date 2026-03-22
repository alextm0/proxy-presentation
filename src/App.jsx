import { useEffect, useRef, useState } from 'react'
import { PresentationProvider, usePresentation } from './hooks/usePresentation'
import ProgressBar    from './components/ProgressBar'
import SlideCounter   from './components/SlideCounter'
import PresenterNotes from './components/PresenterNotes'
import NavControls    from './components/NavControls'
import KeyboardHint   from './components/KeyboardHint'
import gsap           from 'gsap'

// Dynamically import all slides from the slides directory
const slideModules = import.meta.glob('./slides/Slide*.jsx', { eager: true })

// Build the SLIDES array and sort them alphabetically by filename to ensure correct order
const SLIDES = Object.keys(slideModules)
  .sort()
  .map(key => slideModules[key].default)

function SlideRouter() {
  const { currentSlide, nextSlide, prevSlide,
          advanceHighlight, toggleNotes, triggerReset, resetKey, setPresentationMode } = usePresentation()

  const [visible, setVisible]   = useState(currentSlide - 1)
  const containerRef = useRef(null)

  // Slide transition: exit → unmount → mount → enter
  useEffect(() => {
    if (visible === currentSlide - 1) return
    
    const el = containerRef.current
    
    // Kill any ongoing tweens to prevent conflicts during rapid switching
    gsap.killTweensOf(el)
    
    gsap.to(el, { opacity: 0, duration: 0.15, ease: 'power2.in', onComplete: () => {
      setVisible(currentSlide - 1)
      gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
    }})
  }, [currentSlide, visible])

  // Keyboard handler
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'p' || e.key === 'P') {
        toggleNotes()
      } else if (e.key === 'h' || e.key === 'H') {
        advanceHighlight(20)
      } else if (e.key === 'r' || e.key === 'R') {
        triggerReset()
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.log(err))
        } else {
          document.exitFullscreen().catch(err => console.log(err))
        }
      }
    }

    const fsHandler = () => {
      setPresentationMode(!!document.fullscreenElement)
    }

    window.addEventListener('keydown', handler)
    document.addEventListener('fullscreenchange', fsHandler)
    return () => {
      window.removeEventListener('keydown', handler)
      document.removeEventListener('fullscreenchange', fsHandler)
    }
  }, [nextSlide, prevSlide, toggleNotes, advanceHighlight, triggerReset, setPresentationMode, currentSlide])

  const SlideComponent = SLIDES[visible]
  return (
    <div ref={containerRef} style={{ position:'fixed', inset:0 }}>
      {SlideComponent && (
        <SlideComponent key={`${visible}-${resetKey}`} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <PresentationProvider totalSlides={SLIDES.length}>
      <ProgressBar />
      <SlideRouter />
      <SlideCounter />
      <NavControls />
      <PresenterNotes />
      <KeyboardHint />
    </PresentationProvider>
  )
}

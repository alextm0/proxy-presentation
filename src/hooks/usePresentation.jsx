import { createContext, useContext, useState, useCallback } from 'react'

const PresentationContext = createContext(null)

export function PresentationProvider({ children, totalSlides }) {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [slideStep, setSlideStep]       = useState(0)
  const [highlightStep, setHighlightStep] = useState(0)
  const [notesVisible, setNotesVisible] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [resetKey, setResetKey]         = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide(s => Math.min(s + 1, totalSlides))
    setSlideStep(0)
    setHighlightStep(0)
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide(s => Math.max(s - 1, 1))
    setSlideStep(0)
    setHighlightStep(0)
  }, [])

  const advanceStep      = useCallback(() => setSlideStep(s => s + 1), [])
  const resetStep        = useCallback(() => setSlideStep(0), [])
  const advanceHighlight = useCallback((max) =>
    setHighlightStep(s => (s + 1) % max), [])
  const resetHighlight   = useCallback(() => setHighlightStep(0), [])
  const toggleNotes      = useCallback(() => setNotesVisible(v => !v), [])
  const togglePresentationMode = useCallback(() => setPresentationMode(v => !v), [])
  const triggerReset     = useCallback(() => {
    setSlideStep(0)
    setHighlightStep(0)
    setResetKey(k => k + 1)
  }, [])

  return (
    <PresentationContext.Provider value={{
      currentSlide, nextSlide, prevSlide,
      slideStep, advanceStep, resetStep,
      highlightStep, advanceHighlight, resetHighlight,
      notesVisible, toggleNotes,
      presentationMode, togglePresentationMode, setPresentationMode,
      resetKey, triggerReset,
      totalSlides,
    }}>
      {children}
    </PresentationContext.Provider>
  )
}

export function usePresentation() {
  const ctx = useContext(PresentationContext)
  if (!ctx) throw new Error('usePresentation must be used inside PresentationProvider')
  return ctx
}

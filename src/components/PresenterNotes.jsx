import { usePresentation } from '../hooks/usePresentation'

const NOTES = {
  1: "Introduce yourself. Tell them: in 25 minutes you'll understand what a Proxy is, when to use it, and see it in production codebases. Keep it relaxed — this is practical.",
  2: "Ask the class: 'How would YOU solve this?' Give them 20 seconds. Someone will say lazy loading — validate it: that IS the Proxy pattern.",
  3: "Ask: where else have you seen a proxy in real life? VPN, HTTP proxy, receptionist — they're all the same concept.",
  4: "Build this diagram step by step. Ask before each step: 'What do you think connects here?' Let them predict the arrows.",
  5: "Walk through left to right. Build it mentally: interface first, real class, then proxy. Show that the proxy has the SAME interface — the client can't tell the difference.",
  6: "Most students say 3. The reveal is the aha moment. Emphasize: the proxy's null-check IS the memory. It IS the cache.",
  7: "Every Spring Boot developer uses @Cacheable daily without realising it's a proxy. The pattern is IDENTICAL to our toy example — just with annotations on top.",
  8: "Ask: 'Where else have you seen interceptors?' Axios interceptors in JS, Django middleware, Express middleware — they're ALL proxy chains.",
  9: "Every time you use ref() or reactive() in Vue 3, or MobX — there's a Proxy underneath. Ask: 'Have any of you used Vue or React?' Most have. 'You've used a Proxy.'",
  10: "This question always comes up. The key: a Proxy can say NO. It can refuse to call the real object. A Decorator always calls through.",
  11: "End with: 'The best pattern is the one you recognize in the wild. You now have three real examples to look up tonight. That's your homework.'",
}

export default function PresenterNotes() {
  const { currentSlide, notesVisible } = usePresentation()
  return (
    <div id="presenter-notes" className={notesVisible ? 'visible' : ''}>
      <div className="notes-label">Presenter Notes — Slide {currentSlide}</div>
      {NOTES[currentSlide]}
    </div>
  )
}

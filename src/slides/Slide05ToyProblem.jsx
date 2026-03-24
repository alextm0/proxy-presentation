import { usePresentation } from '../hooks/usePresentation'
import MagicCodeBlock from '../components/code/MagicCodeBlock'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const naiveStep1 = `class WeatherService {
    String getWeather(String city) {
        // Direct call to remote provider
        return httpClient.get("https://api.weather.com?city=" + city);
    }
}`

const naiveStep2 = `class WeatherService {
    private final Map<String, Weather> cache = new HashMap<>();

    String getWeather(String city) {
        if (cache.containsKey(city)) {
            return cache.get(city);
        }

        String json = httpClient.get("https://api.weather.com?city=" + city);
        Weather weather = parse(json);
        cache.put(city, weather);
        return weather;
    }
}`

const naiveStep3 = `class WeatherService {
    private final Map<String, Weather> cache = new HashMap<>();

    String getWeather(String city) {
        long start = System.currentTimeMillis();
        logger.info("Requesting weather for city: " + city);

        try {
            if (cache.containsKey(city)) {
                return cache.get(city);
            }
            String json = httpClient.get("https://api.weather.com?city=" + city);
            Weather w = parse(json);
            cache.put(city, w);
            return w;
        } finally {
            long duration = System.currentTimeMillis() - start;
            metrics.record("weather.api.latency", duration);
        }
    }
}`

const naiveStep4 = `class WeatherService {
    private final Map<String, Weather> cache = new HashMap<>();

    String getWeather(User user, String city) {
        if (user.getRole() != Role.PREMIUM && tooManyCalls(user)) {
             throw new RateLimitExceededException();
        }

        long start = System.currentTimeMillis();
        logger.info("User " + user.getId() + " requested " + city);

        try {
            if (cache.containsKey(city)) return cache.get(city);
            String json = httpClient.get("https://api.weather.com?city=" + city);
            // ... API call logic ...
            return parse(json);
        } finally {
            metrics.record("weather.latency", System.currentTimeMillis() - start);
        }
    }
}`

const CODE_STEPS = [naiveStep1, naiveStep2, naiveStep3, naiveStep4]

const STEP_HIGHLIGHTS = [
  [3],               // Step 1: return httpClient.get
  [1, 4, 5, 6, 10],            // Step 2: if (cache.containsKey...
  [5, 16, 17],           // Step 3: logger.info (6) and metrics.record (19)
  [4, 5, 6],            // Step 4: role check + exception
]

function ProblemNotes({ activeStep }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.3 })
  }, [activeStep])

  const content = [
    {
      req: "Show current weather for a city.",
      result: "Call the external API directly.",
      flaw: "Slow, paid, and easily rate-limited.",
      color: '#B8960C'
    },
    {
      req: "It's too slow and too expensive.",
      result: "Added HashMap-based cache.",
      flaw: "Service now handles TTL and expiration.",
      color: '#B8960C'
    },
    {
      req: "We need logging + metrics.",
      result: "Wrapped in try/finally block.",
      flaw: "Violates SRP; logic is getting buried.",
      color: '#B8960C'
    },
    {
      req: "We must protect the API.",
      result: "Added role-based rate limiting.",
      flaw: "God Object: HTTP, Cache, Logs, Auth.",
      color: '#C62828'
    }
  ]

  const item = content[activeStep]

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        background: 'rgba(0,0,0,0.02)',
        borderLeft: `4px solid ${item.color}`,
        padding: '12px 16px',
        borderRadius: '0 8px 8px 0',
      }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: item.color, textTransform: 'uppercase', marginBottom: 4 }}>Manager Says</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>"{item.req}"</p>
      </div>

      <div style={{ padding: '0 16px' }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>The Result</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>{item.result}</p>

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: item.color, fontWeight: 800 }}>
            ⚠️ {item.flaw}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Slide05ToyProblem() {
  const { highlightStep } = usePresentation()
  const activeStep = highlightStep % CODE_STEPS.length

  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>Toy Example: The "Success" Trap</h2>
        <span className="badge">Java</span>
        <span className="badge error">Evolution of a Mess</span>
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 16 }}>
        Step {activeStep + 1} of {CODE_STEPS.length} · How "simple" requirements destroy clean code.
      </p>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, minHeight: 0 }}>
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <MagicCodeBlock
            codeSteps={CODE_STEPS}
            activeStep={activeStep}
            stepHighlights={STEP_HIGHLIGHTS}
            lang="java"
            height="100%"
            filename="WeatherService.java"
            permanentHighlights={true}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 10 }}>
          <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, margin: '0 0 8px 0' }}>
              The Core Constraint
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>☁️</span>
              <div>
                <code style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 800 }}>External Weather API</code>
                <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '2px 0 0 0' }}>
                  Remote, slow, and expensive. <strong>Must be optimized.</strong>
                </p>
              </div>
            </div>
          </div>

          <ProblemNotes activeStep={activeStep} />
        </div>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

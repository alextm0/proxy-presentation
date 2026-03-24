import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePresentation } from '../hooks/usePresentation'
import MagicCodeBlock from '../components/code/MagicCodeBlock'

const step1 = `// 1. THE CONTRACT
public interface WeatherService {
    String getWeather(User user, String city);
}

// 2. THE REAL SUBJECT
public class RemoteWeatherService implements WeatherService {
    public String getWeather(User user, String city) {
        // pure "business" logic: call remote API
        return httpClient.get("https://api.weather.com?city=" + city);
    }
}`

const step2 = `// 3. THE CACHING PROXY
public class CachingWeatherServiceProxy implements WeatherService {
    private final WeatherService next;
    private final Map<String, CachedEntry> cache = new HashMap<>();

    public CachingWeatherServiceProxy(WeatherService next) {
        this.next = next;
    }

    @Override
    public String getWeather(User user, String city) {
        CachedEntry entry = cache.get(city);
        if (entry != null && !entry.isExpired()) {
            return entry.value;
        }
        String result = next.getWeather(user, city);
        cache.put(city, new CachedEntry(result, now()));
        return result;
    }
}`

const step3 = `// 4. THE LOGGING PROXY
public class LoggingWeatherServiceProxy implements WeatherService {
    private final WeatherService next;

    public LoggingWeatherServiceProxy(WeatherService next) {
        this.next = next;
    }

    @Override
    public String getWeather(User user, String city) {
        long start = System.currentTimeMillis();
        try {
            return next.getWeather(user, city);
        } finally {
            long duration = System.currentTimeMillis() - start;
            System.out.println(city + " took " + duration + "ms");
        }
    }
}`

const step4 = `// 5. THE PROTECTION PROXY
public class RateLimitingWeatherServiceProxy implements WeatherService {
    private final WeatherService next;
    private final RateLimiter limiter;

    public RateLimitingWeatherServiceProxy(WeatherService next, RateLimiter limiter) {
        this.next = next;
        this.limiter = limiter;
    }

    @Override
    public String getWeather(User user, String city) {
        if (!limiter.allow(user)) {
            throw new RateLimitExceeded();
        }
        return next.getWeather(user, city);
    }
}`

const step5 = `WeatherService service = 
    new RateLimitingWeatherServiceProxy(
        new LoggingWeatherServiceProxy(
            new CachingWeatherServiceProxy(
                new RemoteWeatherService()
            )
        ),
        limiter
    );

// Call flow: Client -> RateLimit -> Logging -> Caching -> Real
service.getWeather(currentUser, "London");`

const CODE_STEPS = [step1, step2, step3, step4, step5]

// Step-by-step highlights (Indices based on non-empty lines)
const STEP_HIGHLIGHTS = [
  [1, 2, 3],             // Step 1: Interface method (1) + Remote call (7)
  [3, 11, 12, 13, 14, 16],           // Step 2: Cache check (11) + put (15)
  [10, 14, 15],           // Step 3: inner call (10) + print (13)
  [3, 12, 13, 14],           // Step 4: limit check (10) + inner call (11)
  [0, 1, 2, 3, 4, 5, 6, 7, 8],       // Step 5: Wrapper chain
]

function ArchitecturalNotes({ activeStep }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.3 })
  }, [activeStep])

  const steps = [
    {
      req: "Extract the interface.",
      fix: "Interface Abstraction",
      win: "Callers only depend on the contract.",
      color: '#2E7D32'
    },
    {
      req: "Handle expensive API calls.",
      fix: "Caching Proxy",
      win: "Expensive logic is isolated and reusable.",
      color: '#2E7D32'
    },
    {
      req: "Audit every request time.",
      fix: "Logging Proxy",
      win: "Observability without touching business logic.",
      color: '#2E7D32'
    },
    {
      req: "Protect the API from abuse.",
      fix: "Protection Proxy",
      win: "Security is a pluggable, modular layer.",
      color: '#2E7D32'
    },
    {
      req: "Compose the final system.",
      fix: "Proxy Stacking",
      win: "Clean call flow: RateLimit -> Log -> Cache -> Real.",
      color: '#2E7D32'
    }
  ]

  const item = steps[activeStep]

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        background: 'rgba(46, 125, 50, 0.04)',
        borderLeft: '4px solid #2E7D32',
        padding: '12px 16px',
        borderRadius: '0 8px 8px 0',
      }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: '#2E7D32', textTransform: 'uppercase', marginBottom: 4 }}>Manager Says</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>"{item.req}"</p>
      </div>

      <div style={{ padding: '0 16px' }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>The Fix</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>{item.fix}</p>

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: '#2E7D32', fontWeight: 800 }}>
            ✅ {item.win}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Slide06ToySolution() {
  const { highlightStep } = usePresentation()
  const activeStep = highlightStep % CODE_STEPS.length

  return (
    <div className="slide-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 className="slide-title" style={{ marginBottom: 0 }}>Toy Example: The Proxy Solution</h2>
        <span className="badge">Java</span>
        <span className="badge success">Refactoring to Sanity</span>
      </div>
      <p className="slide-subtitle" style={{ marginBottom: 16 }}>
        Step {activeStep + 1} of {CODE_STEPS.length} · Restoring Sanity through Composition.
      </p>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, minHeight: 0 }}>
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <MagicCodeBlock
            codeSteps={CODE_STEPS}
            activeStep={activeStep}
            stepHighlights={STEP_HIGHLIGHTS}
            lang="java"
            height="100%"
            filename={activeStep === 0 ? "WeatherService.java" : activeStep === 4 ? "AppConfig.java" : "WeatherProxies.java"}
            permanentHighlights={true}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 10 }}>
          <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 10, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, margin: '0 0 8px 0' }}>
              The Architectural Win
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>🛡️</span>
              <div>
                <code style={{ fontSize: 13, color: '#1B5E20', fontWeight: 800 }}>The Open/Closed Principle</code>
                <p style={{ fontSize: 11, color: '#388E3C', margin: '2px 0 0 0' }}>
                  System is <strong>open</strong> for extension (new proxies) but <strong>closed</strong> for modification.
                </p>
              </div>
            </div>
          </div>

          <ArchitecturalNotes activeStep={activeStep} />
        </div>
      </div>

      <div className="bottom-rule" />
    </div>
  )
}

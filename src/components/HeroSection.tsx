import { useState, useEffect, useRef } from 'react'
import { useRoast } from '../hooks/useRoast'
import RoastResultCard, { RawFallback } from './RoastResultCard'

// ── Logo ──────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', lineHeight: 1 }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(32px, 6vw, 52px)',
        background: 'linear-gradient(135deg, #ff9f1a, #ff4d00, #b30000)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
      }}>ROAST</span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(32px, 6vw, 52px)',
        color: 'transparent',
        WebkitTextStroke: '1.5px var(--outline-text)',
        lineHeight: 1,
      }}>MY IDEA</span>
    </div>
  )
}

// ── Loading ───────────────────────────────────────────────────
const RESEARCH_PHASES = [
  'Scouring the internet for real data...',
  'Checking what already exists out there...',
  'Pulling competitor intel from the web...',
  'Scanning X and Reddit for market signals...',
  'Finding out who already built this...',
]

const ROAST_PHASES = [
  'Analyzing your delusion...',
  'Scanning for fatal flaws...',
  'Calculating survival probability...',
  'Auditing the competition...',
  'Stress-testing your assumptions...',
  'Preparing the roast...',
  'Writing the brutal truth...',
]

const BAR_DELAYS = [0, 0.15, 0.3, 0.05, 0.45, 0.2, 0.35, 0.1, 0.25, 0.4]

function ScanBars() {
  return (
    <div className="scan-bars">
      {BAR_DELAYS.map((delay, i) => (
        <div key={i} className="scan-bar" style={{ animationDelay: `${delay}s` }} />
      ))}
    </div>
  )
}

function LoadingDisplay({ researching }: { researching: boolean }) {
  const phases = researching ? RESEARCH_PHASES : ROAST_PHASES
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => { setPhaseIdx(0); setVisible(true) }, [researching])

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setPhaseIdx(p => (p + 1) % phases.length); setVisible(true) }, 250)
    }, 2200)
    return () => clearInterval(id)
  }, [phases])

  return (
    <div style={{ padding: '64px 0 80px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'var(--flame)', letterSpacing: '4px', marginBottom: '32px' }}>
        {researching ? 'RESEARCHING YOUR SPACE...' : 'ANALYZING YOUR DELUSION...'}
      </div>
      <ScanBars />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', marginTop: '20px', opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease', minHeight: '18px' }}>
        {phases[phaseIdx]}
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────
export default function HeroSection({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [mode, setMode]               = useState<'idea' | 'website'>('idea')
  const [idea, setIdea]               = useState('')
  const [url, setUrl]                 = useState('')
  const [submittedIdea, setSubmittedIdea] = useState('')
  const textareaRef                   = useRef<HTMLTextAreaElement>(null)
  const { loading, researching, data, raw, error, roast, reset } = useRoast()

  const showForm   = !loading && data === null && raw === null && error === null
  const currentVal = mode === 'idea' ? idea : url
  const canSubmit  = !loading && currentVal.trim().length > 0

  useEffect(() => { onActiveChange?.(!showForm) }, [showForm, onActiveChange])

  // Auto-focus textarea when form reappears
  useEffect(() => { if (showForm && mode === 'idea') textareaRef.current?.focus() }, [showForm, mode])

  // Quality bar (gamification)
  const charCount   = idea.length
  const qualityPct  = Math.min(100, (charCount / 180) * 100)
  const qualityColor =
    charCount === 0   ? 'var(--border)' :
    charCount < 60    ? 'var(--muted)'  :
    charCount < 130   ? 'var(--ember)'  : 'var(--flame)'
  const qualityLabel =
    charCount === 0   ? ''                          :
    charCount < 60    ? 'Give us more to work with' :
    charCount < 130   ? 'Getting there...'          : '✓ Ready to roast'

  const handleSubmit = () => {
    if (!canSubmit) return
    const val = currentVal.trim()
    setSubmittedIdea(val)
    roast(val)
  }

  const handleReset = () => { reset(); setIdea(''); setUrl(''); setSubmittedIdea('') }
  const handleRoastPivot = (pivotText: string) => { setSubmittedIdea(pivotText); roast(pivotText) }
  const switchMode = (next: 'idea' | 'website') => { setMode(next); reset() }

  return (
    <section style={{ maxWidth: '660px', margin: '0 auto' }}>

      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Logo />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--flame)' }}>
          🔥 12,847 roasted
        </span>
      </div>

      {/* ── Tagline ── */}
      {showForm && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--muted)', margin: '0 0 22px', letterSpacing: '0.2px' }}>
          AI feedback that tells you what your friends won&apos;t.
        </p>
      )}

      {/* ── Loading ── */}
      {loading && <LoadingDisplay researching={researching} />}

      {/* ── Error ── */}
      {error && (
        <div className="result-reveal" style={{ border: '1px solid #5a2020', background: 'rgba(80,10,10,0.3)', padding: '20px 24px', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#f87171', margin: '0 0 12px' }}>✗ {error}</p>
          <button onClick={handleReset} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            try again
          </button>
        </div>
      )}

      {/* ── Result ── */}
      {data && <RoastResultCard data={data} raw={raw} idea={submittedIdea} onReset={handleReset} onRoast={handleRoastPivot} />}
      {!data && raw && <RawFallback text={raw} onReset={handleReset} />}

      {/* ── INPUT CARD — the hero ── */}
      {showForm && (
        <>
          <div className="input-card" style={{ border: '2px solid var(--border)', background: 'var(--card)' }}>

            {/* Idea textarea */}
            {mode === 'idea' && (
              <>
                <textarea
                  ref={textareaRef}
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit() }}
                  placeholder="What's the idea? What does it do, who's it for, how does it make money?"
                  rows={6}
                  style={{
                    display: 'block', width: '100%', padding: '22px 22px 10px',
                    background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--text)', lineHeight: '1.65',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Quality bar */}
                <div style={{ padding: '0 22px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${qualityPct}%`, background: qualityColor, transition: 'width 0.35s ease, background 0.35s ease', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: qualityColor, transition: 'color 0.35s ease', minWidth: '170px', textAlign: 'right' }}>
                    {qualityLabel}
                  </span>
                </div>
              </>
            )}

            {/* Website URL input */}
            {mode === 'website' && (
              <div style={{ padding: '22px 22px 20px' }}>
                <input
                  autoFocus
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                  placeholder="https://your-startup.com"
                  style={{
                    display: 'block', width: '100%',
                    background: 'transparent', border: 'none', outline: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--text)', lineHeight: '1.65',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', margin: '12px 0 0' }}>
                  We read it the way a new visitor would.
                </p>
              </div>
            )}

            {/* Bottom bar: tabs only */}
            <div style={{ display: 'flex', borderTop: '1px solid var(--border)', alignItems: 'stretch', minHeight: '44px' }}>
              <button
                className={`tab-btn ${mode === 'idea' ? 'active' : ''}`}
                onClick={() => switchMode('idea')}
                style={{ border: 'none', borderRight: '1px solid var(--border)', borderRadius: 0, flexShrink: 0 }}
              >
                💡 Idea
              </button>
              <button
                className={`tab-btn ${mode === 'website' ? 'active' : ''}`}
                onClick={() => switchMode('website')}
                style={{ border: 'none', borderRight: '1px solid var(--border)', borderRadius: 0, flexShrink: 0 }}
              >
                🌐 Website
              </button>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
                  {mode === 'idea' ? 'Cmd+Enter to submit' : 'Enter to submit'}
                </span>
              </div>
            </div>
          </div>

          {/* ROAST IT — standalone CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`btn-roast${canSubmit ? ' btn-roast-glow' : ''}`}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                letterSpacing: '3px',
                padding: '13px 36px',
                background: canSubmit ? 'var(--flame)' : 'var(--card)',
                color: canSubmit ? '#fff' : 'var(--muted)',
                border: `2px solid ${canSubmit ? 'var(--flame)' : 'var(--border)'}`,
                borderRadius: '12px',
                cursor: canSubmit ? 'pointer' : 'default',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s, transform 0.08s',
              }}
            >
              {canSubmit ? '🔥 ROAST IT' : 'ROAST IT'}
            </button>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', justifyContent: 'center' }}>
            {(['① Describe', '→', '② Verdict', '→', '③ Roast'] as const).map((item, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: item === '→' ? 'var(--step-arrow)' : 'var(--muted)' }}>
                {item}
              </span>
            ))}
          </div>
        </>
      )}

    </section>
  )
}

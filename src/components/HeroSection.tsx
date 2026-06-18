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

// ── Live activity toasts ──────────────────────────────────────
const RECENT_ROASTS = [
  { idea: '"LinkedIn but actually fun"',        score: 5,  emoji: '☠️' },
  { idea: '"AI therapist for Gen Z"',           score: 22, emoji: '🧠' },
  { idea: '"Uber for dog walkers"',             score: 14, emoji: '🐕' },
  { idea: '"Notion but simpler"',               score: 9,  emoji: '💀' },
  { idea: '"Airbnb for empty offices"',         score: 38, emoji: '🏢' },
  { idea: '"Dating app for founders"',          score: 18, emoji: '💔' },
  { idea: '"Blockchain for supply chain"',      score: 3,  emoji: '⚰️' },
  { idea: '"AI that replaces your lawyer"',     score: 31, emoji: '⚖️' },
  { idea: '"TikTok but educational"',           score: 27, emoji: '📚' },
  { idea: '"Spotify but for podcasts"',         score: 11, emoji: '🎙️' },
  { idea: '"An app that reminds you to drink water"', score: 6, emoji: '💧' },
  { idea: '"ChatGPT wrapper for HR"',           score: 8,  emoji: '🤖' },
]

function scoreColor(s: number) {
  return s <= 20 ? '#cc3333' : s <= 40 ? '#cc7730' : '#44aa66'
}

function LiveToast() {
  const [idx, setIdx]         = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = () => {
      setIdx(i => (i + 1) % RECENT_ROASTS.length)
      setVisible(true)
      setTimeout(() => setVisible(false), 3200)
    }
    const initial  = setTimeout(show, 1800)
    const interval = setInterval(show, 6000)
    return () => { clearTimeout(initial); clearInterval(interval) }
  }, [])

  const r = RECENT_ROASTS[idx]
  return (
    <div style={{
      position: 'fixed', bottom: '28px', left: '28px', zIndex: 100,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
      pointerEvents: 'none',
    }}>
      <div style={{
        border: '1px solid var(--border)', background: 'var(--card)',
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)', maxWidth: '260px',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>{r.emoji}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '2px', letterSpacing: '0.5px' }}>
            just roasted
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text)', lineHeight: 1.35, marginBottom: '3px' }}>
            {r.idea}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: scoreColor(r.score), fontWeight: 600 }}>
            {r.score}% survival
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Rotating placeholder ideas ─────────────────────────────────
const PLACEHOLDER_IDEAS = [
  "What's the idea? What it does, who it's for, how it makes money.",
  'e.g. "An AI coach that helps first-time managers not destroy their teams..."',
  'e.g. "Airbnb for unused commercial kitchens — chefs rent by the hour..."',
  'e.g. "A browser extension that blocks you from buying stuff you\'ll regret..."',
  'e.g. "B2B SaaS that auto-chases overdue invoices for freelancers..."',
  'e.g. "On-demand personal stylist via WhatsApp, no app download needed..."',
  'e.g. "LinkedIn but you only see people actually open to new things..."',
]

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
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const textareaRef                   = useRef<HTMLTextAreaElement>(null)
  const { loading, researching, data, raw, error, roast, reset } = useRoast()

  // Cycle placeholder when textarea is empty
  useEffect(() => {
    if (idea.length > 0) return
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDER_IDEAS.length), 4000)
    return () => clearInterval(id)
  }, [idea])

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
    <>
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
                  placeholder={PLACEHOLDER_IDEAS[placeholderIdx]}
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
              className="btn-roast btn-roast-glow"
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

    {/* Live activity toasts */}
    {showForm && <LiveToast />}
    </>
  )
}

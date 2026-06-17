import { useState, useEffect } from 'react'
import { useRoast } from '../hooks/useRoast'
import RoastResultCard, { RawFallback } from './RoastResultCard'

// ── Logo ──────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ lineHeight: 0.88, marginBottom: '20px' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 14vw, 140px)',
          lineHeight: 0.88,
          background: 'linear-gradient(135deg, #ff9f1a, #ff4d00, #b30000)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'block',
        }}
      >
        ROAST
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 14vw, 140px)',
          lineHeight: 0.88,
          color: 'transparent',
          WebkitTextStroke: '1px var(--outline-text)',
          marginLeft: '24px',
          display: 'block',
        }}
      >
        MY IDEA
      </div>
    </div>
  )
}

// ── Cemetery card (right column) ──────────────────────────────
function CemeteryCard() {
  return (
    <div
      className="cemetery-card"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '28px 24px',
        textAlign: 'center',
        width: '210px',
        flexShrink: 0,
        alignSelf: 'flex-start',
        marginTop: '8px',
      }}
    >
      <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '14px' }}>🪦</div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          color: 'var(--flame)',
          letterSpacing: '2.5px',
          marginBottom: '8px',
        }}
      >
        IDEA CEMETERY
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '17px',
          color: 'var(--text)',
          lineHeight: 1.2,
          cursor: 'pointer',
        }}
      >
        ENTER THE CEMETERY →
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--muted)',
          lineHeight: 1.5,
          margin: '10px 0 0',
        }}
      >
        of ideas that achieved their final peace
      </p>
    </div>
  )
}

// ── Step card ─────────────────────────────────────────────────
function StepCard({ num, step, title, body }: { num: string; step: string; title: string; body: string }) {
  return (
    <div
      style={{
        flex: 1,
        border: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            color: 'var(--flame)',
            lineHeight: 1,
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--muted)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {step}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '19px',
          color: 'var(--text)',
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--muted)',
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  )
}

// ── Loading animation ─────────────────────────────────────────
const RESEARCH_PHASES = [
  'Scouring the internet for real data...',
  'Checking what already exists out there...',
  'Pulling competitor intel from the web...',
  'Scanning X and Reddit for market signals...',
  'Looking up what people actually think...',
  'Finding out who already built this...',
]

const ROAST_PHASES = [
  'Analyzing your delusion...',
  'Scanning for fatal flaws...',
  'Calculating survival probability...',
  'Auditing the competition...',
  'Identifying your blind spots...',
  'Reviewing the business model...',
  'Stress-testing your assumptions...',
  'Estimating time until first pivot...',
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

  useEffect(() => {
    setPhaseIdx(0)
    setVisible(true)
  }, [researching])

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setPhaseIdx(p => (p + 1) % phases.length)
        setVisible(true)
      }, 250)
    }, 2200)
    return () => clearInterval(id)
  }, [phases])

  const headline = researching
    ? 'RESEARCHING YOUR SPACE...'
    : 'ANALYZING YOUR DELUSION...'

  return (
    <div style={{ padding: '64px 0 80px', textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: 'var(--flame)',
          letterSpacing: '4px',
          marginBottom: '32px',
          transition: 'opacity 0.3s ease',
        }}
      >
        {headline}
      </div>

      <ScanBars />

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--muted)',
          marginTop: '20px',
          letterSpacing: '0.3px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s ease',
          minHeight: '18px',
        }}
      >
        {phases[phaseIdx]}
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────
export default function HeroSection({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [mode, setMode] = useState<'idea' | 'website'>('idea')
  const [idea, setIdea] = useState('')
  const [url, setUrl] = useState('')
  const [submittedIdea, setSubmittedIdea] = useState('')
  const { loading, researching, data, raw, error, roast, reset } = useRoast()

  const showForm = !loading && data === null && raw === null && error === null

  useEffect(() => {
    onActiveChange?.(!showForm)
  }, [showForm, onActiveChange])
  const currentValue = mode === 'idea' ? idea : url
  const canSubmit = !loading && currentValue.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const val = currentValue.trim()
    setSubmittedIdea(val)
    roast(val)
  }

  const handleReset = () => {
    reset()
    setIdea('')
    setUrl('')
    setSubmittedIdea('')
  }

  const handleRoastPivot = (pivotText: string) => {
    setSubmittedIdea(pivotText)
    roast(pivotText)
  }

  const switchMode = (next: 'idea' | 'website') => {
    setMode(next)
    reset()
  }

  return (
    <section style={{ maxWidth: '840px', margin: '0 auto' }}>

      {/* ── Hero top — always visible ── */}
      <div
        className={showForm ? 'hero-top' : ''}
        style={
          showForm
            ? { display: 'grid', gridTemplateColumns: '1fr auto', gap: '40px', alignItems: 'flex-start', marginBottom: '28px' }
            : { marginBottom: '16px' }
        }
      >
        {/* Left column (or full width when form hidden) */}
        <div>
          <Logo />

          {showForm && (
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 7vw, 72px)',
                lineHeight: 1,
                color: 'var(--text)',
                margin: '0 0 12px',
              }}
            >
              Will your idea actually work?
            </h1>
          )}

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '1px',
                background: 'var(--flame)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              The AI that tells you what your friends won&apos;t.
            </span>
          </div>

          {/* Ideas destroyed counter */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--flame)',
            }}
          >
            <span>🔥</span>
            <span>12,847 ideas destroyed</span>
          </div>

          {showForm && (
            <div style={{ marginTop: '16px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--muted)',
                  lineHeight: 1.65,
                  margin: '0 0 6px',
                }}
              >
                Thousands of founders found out the truth before wasting months building something nobody wanted.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--flame)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                You can now paste your website too and get a brutal diagnosis of the page.
              </p>
            </div>
          )}
        </div>

        {/* Right column — cemetery, only in form state */}
        {showForm && <CemeteryCard />}
      </div>

      {/* ── Loading ── */}
      {loading && <LoadingDisplay researching={researching} />}

      {/* ── Error ── */}
      {error && (
        <div
          className="result-reveal"
          style={{
            marginTop: '32px',
            border: '1px solid #5a2020',
            background: 'rgba(80,10,10,0.3)',
            padding: '20px 24px',
          }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#f87171', margin: '0 0 14px' }}>
            ✗ {error}
          </p>
          <button
            onClick={handleReset}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            try again
          </button>
        </div>
      )}

      {/* ── Result ── */}
      {data && (
        <RoastResultCard
          data={data}
          raw={raw}
          idea={submittedIdea}
          onReset={handleReset}
          onRoast={handleRoastPivot}
        />
      )}
      {!data && raw && <RawFallback text={raw} onReset={handleReset} />}

      {/* ── Form (step cards + input) — only when idle ── */}
      {showForm && (
        <>
          {/* Step cards */}
          <div
            className="step-row"
            style={{ display: 'flex', alignItems: 'stretch', marginBottom: '20px' }}
          >
            <StepCard
              num="01"
              step="Step 1"
              title="Tell us what you're building"
              body="Describe what it does, who it is for, and how it makes money."
            />
            <div
              className="step-arrow-wrap"
              style={{ display: 'flex', alignItems: 'center', padding: '0 10px', color: 'var(--step-arrow)', fontSize: '18px', flexShrink: 0 }}
            >
              →
            </div>
            <StepCard
              num="02"
              step="Step 2"
              title="Get the market verdict"
              body="In seconds you see the real survival odds and whether this thing is born broken."
            />
            <div
              className="step-arrow-wrap"
              style={{ display: 'flex', alignItems: 'center', padding: '0 10px', color: 'var(--step-arrow)', fontSize: '18px', flexShrink: 0 }}
            >
              →
            </div>
            <StepCard
              num="03"
              step="Step 3"
              title="Read the roast with no anesthesia"
              body="You get one brutal line that tells you exactly where it hurts."
            />
          </div>

          {/* Tab toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '0' }}>
            <button
              className={`tab-btn ${mode === 'idea' ? 'active' : ''}`}
              onClick={() => switchMode('idea')}
            >
              ↓ I have an idea
            </button>
            <button
              className={`tab-btn ${mode === 'website' ? 'active' : ''}`}
              onClick={() => switchMode('website')}
            >
              🌐 I have a website
            </button>
          </div>

          {/* Input panel */}
          <div
            style={{
              border: '1px solid var(--border)',
              borderTop: 'none',
              background: 'var(--card)',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            {/* Label row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                {mode === 'idea' ? 'Describe your idea ↓' : 'Your website ↓'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
                {mode === 'idea' ? 'More detail = sharper analysis' : 'we audit it like a cold visitor'}
              </span>
            </div>

            {/* Input */}
            {mode === 'idea' ? (
              <textarea
                value={idea}
                onChange={e => setIdea(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit() }}
                placeholder="An AI meditation app for anxious millennials..."
                rows={5}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--soft)',
                  lineHeight: '1.6',
                }}
              />
            ) : (
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                placeholder="https://your-startup.com"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--soft)',
                  lineHeight: '1.6',
                  padding: '8px 0 16px',
                }}
              />
            )}

            {/* Hint row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: '10px',
                borderTop: '1px solid var(--border)',
                gap: '16px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
                {mode === 'idea'
                  ? "Include what it does, who it's for, and how it makes money."
                  : 'We analyze your site the way a new visitor sees it.'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--flame)', flexShrink: 0 }}>
                Full website roast free · AI Prompt $9
              </span>
            </div>
          </div>

          {/* ROAST IT button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-roast"
            style={{
              width: '100%',
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              letterSpacing: '2px',
              background: canSubmit ? 'var(--flame)' : 'var(--card)',
              color: canSubmit ? '#fff' : 'var(--muted)',
              border: '1px solid var(--border)',
              borderTop: 'none',
              cursor: canSubmit ? 'pointer' : 'default',
              padding: '18px 26px',
              display: 'block',
              boxShadow: canSubmit ? '4px 4px 0 var(--shadow-btn)' : 'none',
              transition: 'background 0.12s, color 0.12s, box-shadow 0.08s, transform 0.08s',
            }}
          >
            ROAST IT
          </button>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted)',
              margin: '10px 0 0',
            }}
          >
            Full website roast free · AI Prompt $9
          </p>
        </>
      )}

    </section>
  )
}

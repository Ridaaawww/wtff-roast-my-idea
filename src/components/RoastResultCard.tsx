import { useState } from 'react'
import type { RoastData } from '../hooks/useRoast'

// ── helpers ───────────────────────────────────────────────────
function survivalColor(p: number): string {
  if (p <= 20) return '#cc3333'
  if (p <= 40) return '#cc5530'
  if (p <= 60) return '#c8a030'
  return '#44aa66'
}

function survivalMessage(p: number): string {
  if (p <= 20) return 'You just potentially saved 6–12 months of work'
  if (p <= 40) return 'You just potentially saved 3–6 months of work'
  if (p <= 60) return 'Worth more investigation before committing'
  return 'There is real potential here — do not waste it'
}

const CARD: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'var(--card)',
  padding: '20px',
}

// ── Raw fallback (if agent didn't return JSON) ────────────────
function RawFallback({ text, onReset }: { text: string; onReset: () => void }) {
  return (
    <div className="result-reveal" style={{ marginTop: '32px', ...CARD, boxShadow: '4px 4px 0 var(--shadow-btn)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--flame)', letterSpacing: '2.4px' }}>
          THE VERDICT
        </div>
        <button
          onClick={onReset}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
        >
          roast another idea
        </button>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.8', color: 'var(--text)', whiteSpace: 'pre-wrap', margin: 0 }}>
        {text}
      </p>
    </div>
  )
}

// ── Rich result card ──────────────────────────────────────────
interface Props {
  data:    RoastData
  raw:     string | null
  idea:    string
  onReset: () => void
  onRoast: (idea: string) => void
}

export default function RoastResultCard({ data, raw: _raw, idea, onReset, onRoast }: Props) {
  const [copied, setCopied] = useState(false)
  const pct = Math.max(1, Math.min(data.survival_probability ?? 50, 99))

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="result-reveal" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── 1. Verdict card ── */}
      <div style={{ ...CARD, boxShadow: '4px 4px 0 var(--shadow-btn)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '2.5px' }}>
            VERDICT
          </span>
          <div style={{ textAlign: 'right', maxWidth: '260px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '4px' }}>
              YOUR IDEA
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>
              &ldquo;{idea.length > 90 ? idea.slice(0, 90) + '…' : idea}&rdquo;
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '36px', lineHeight: 1 }}>{data.verdict_emoji || '💀'}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 50px)', color: 'var(--text)', lineHeight: 1 }}>
            {data.verdict}
          </span>
        </div>
      </div>

      {/* ── 2. Survival probability ── */}
      <div style={{ padding: '4px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '2.5px', marginBottom: '5px' }}>
              SURVIVAL PROBABILITY
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>
              {survivalMessage(data.survival_probability)}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 72px)', color: survivalColor(data.survival_probability), lineHeight: 1, flexShrink: 0, marginLeft: '16px' }}>
            {data.survival_probability}%
          </div>
        </div>

        {/* gradient bar */}
        <div style={{ position: 'relative', height: '6px', background: 'linear-gradient(to right, #cc2222 0%, #c84b2a 15%, #c8a020 45%, #44aa44 100%)', margin: '14px 0 8px' }}>
          <div style={{ position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)', top: '-5px', width: '2px', height: '16px', background: 'var(--text)' }} />
        </div>

        {/* zone labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
          {['● DEAD', '⚠ CRITICAL', '〜 SHAKY', '✓ VIABLE'].map(label => (
            <span key={label} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.3px' }}>
              {label}
            </span>
          ))}
        </div>

        {/* mode toggle — pill group */}
        <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
          <button style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.5px', padding: '10px 22px', background: 'var(--flame)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
            🔥 BRUTAL
          </button>
          <button style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.5px', padding: '10px 22px', background: 'var(--card)', color: 'var(--muted)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
            🧠 COACH
          </button>
        </div>
      </div>

      {/* ── 3. Roast lines ── */}
      {data.roast_lines?.length > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '1.5px', marginBottom: '4px' }}>
            THE ROAST ↓
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.roast_lines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 0',
                  borderBottom: i < data.roast_lines.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: 'var(--flame)', lineHeight: 1, flexShrink: 0, opacity: 0.75 }}>(</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
                  {line.emoji} {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Analysis grid ── */}
      <div className="analysis-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {/* WHO'LL KILL YOU */}
        <div style={{ ...CARD }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '12px' }}>
            WHO'LL KILL YOU
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(data.competitors ?? []).map((c, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--flame)', fontSize: '10px', flexShrink: 0 }}>■</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text)', textDecoration: 'underline', textDecorationColor: 'var(--border)', lineHeight: 1.4 }}>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* MOST LIKELY CAUSE OF DEATH */}
        <div style={{ ...CARD, borderLeft: '3px solid #cc3333' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '12px' }}>
            MOST LIKELY CAUSE OF DEATH
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#cc3333', lineHeight: 1.65, margin: 0 }}>
            {data.cause_of_death}
          </p>
        </div>

        {/* ONE THING THAT DOESN'T SUCK */}
        <div style={{ ...CARD, borderRight: '3px solid var(--flame)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '12px' }}>
            ONE THING THAT DOESN'T SUCK
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--flame)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
            {data.redeeming_quality}
          </p>
        </div>
      </div>

      {/* ── 5. Real talk ── */}
      {data.real_talk && (
        <div style={CARD}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--flame)', letterSpacing: '2px', marginBottom: '14px' }}>
            REAL TALK (READ THIS PART)
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.85, margin: 0 }}>
            {data.real_talk}
          </p>
        </div>
      )}

      {/* ── 6. Pivots ── */}
      {data.pivots?.length > 0 && (
        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px' }}>🔄</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text)', letterSpacing: '1.5px' }}>
              WHAT IF YOU PIVOT?
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
              {data.pivots.length} alternate directions worth roasting
            </span>
          </div>

          <div className="pivot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {data.pivots.map((pivot, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--muted)', letterSpacing: '1px' }}>
                  {i + 1}.
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--soft)', lineHeight: 1.5, margin: 0 }}>
                  {pivot.title}
                </p>
                {pivot.description && pivot.description !== pivot.title && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                    {pivot.description}
                  </p>
                )}
                <button
                  onClick={() => onRoast(`${pivot.title}: ${pivot.description}`)}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '1px', padding: '8px 12px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer', marginTop: 'auto', boxShadow: '2px 2px 0 var(--shadow-btn)' }}
                >
                  ROAST THIS PIVOT →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. Battle mode teaser ── */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.5px', padding: '4px 0' }}>
        DO YOU HAVE A RIVAL IDEA? → BATTLE MODE (COMING SOON)
      </div>

      {/* ── 8. Action buttons ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={onReset}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', padding: '10px 18px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer' }}
        >
          ROAST ANOTHER →
        </button>
        <button
          onClick={handleCopy}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', padding: '10px 18px', background: 'var(--flame)', color: '#fff', border: '1px solid var(--border)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          🔥 {copied ? 'COPIED!' : 'SHARE THIS ROAST'}
        </button>
        <button
          onClick={handleCopy}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', padding: '10px 18px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer' }}
        >
          COPY LINK
        </button>
        <button
          style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.5px', padding: '10px 18px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          🪦 ADD TO IDEA CEMETERY
        </button>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', margin: '0' }}>
        Make it public in the Idea Cemetery
      </p>

      {/* ── 9. Hackathon CTA ── */}
      {pct >= 30 && (
        <div style={{ border: '2px solid var(--flame)', background: 'var(--card)', padding: '24px 28px', boxShadow: '6px 6px 0 var(--shadow-btn)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '32px', height: '32px', borderLeft: '2px solid var(--flame)', borderBottom: '2px solid var(--flame)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--flame)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
            ⚡ What The Tech! — Founders Fest Hackathon
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3.5vw, 30px)', color: 'var(--text)', lineHeight: 1.1, marginBottom: '12px' }}>
            YOUR IDEA SURVIVED THE ROAST.<br />NOW BUILD IT FOR REAL.
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.75, margin: '0 0 20px' }}>
            A playground for builders, coders, dreamers, and the ones always asking{' '}
            <em style={{ color: 'var(--flame)', fontStyle: 'italic' }}>what if?</em>{' '}
            Stop letting the roast be the end — bring your idea to Founders Fest and turn it into something that ships.
          </p>
          <a
            href="https://luma.com/t04s4n2s"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', padding: '12px 28px', background: 'var(--flame)', color: '#fff', textDecoration: 'none', boxShadow: '4px 4px 0 var(--shadow-btn)', transition: 'transform 0.08s ease, box-shadow 0.08s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translate(2px,2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '2px 2px 0 var(--shadow-btn)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '4px 4px 0 var(--shadow-btn)' }}
          >
            REGISTER NOW →
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginLeft: '14px' }}>
            foundersfest.org
          </span>
        </div>
      )}

      {pct >= 20 && pct < 30 && (
        <div style={{ border: '1px solid var(--border)', background: 'var(--card)', padding: '24px 28px', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--flame)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
            ⚡ What The Tech! — Founders Fest Hackathon
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 26px)', color: 'var(--text)', lineHeight: 1.15, marginBottom: '12px' }}>
            YOUR IDEA HAS A SPARK.<br />IT JUST NEEDS MORE FUEL.
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.75, margin: '0 0 6px' }}>
            The roast was rough because the description was thin. Try re-roasting with{' '}
            <strong style={{ color: 'var(--soft)' }}>the specific problem, who it's for, and how it makes money</strong> — you might be sitting on something real.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.75, margin: '0 0 20px' }}>
            And if you want to find out live, bring it to Founders Fest — that's what the hackathon is for.
          </p>
          <a
            href="https://luma.com/t04s4n2s"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '2px', padding: '10px 24px', background: 'transparent', color: 'var(--flame)', textDecoration: 'none', border: '1px solid var(--flame)', boxShadow: '3px 3px 0 var(--shadow-btn)' }}
          >
            REGISTER NOW →
          </a>
        </div>
      )}

      {/* ── 10. Unlock Coach upsell ── */}
      <div style={{ border: '1px solid var(--flame)', background: 'rgba(204,68,51,0.06)', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text)', letterSpacing: '1px' }}>
            UNLOCK COACH • $3.00
          </span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>CURRENCY</span>
            <select style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', padding: '4px 8px', cursor: 'pointer' }}>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', margin: '0 0 4px' }}>
          Constructive analysis · Action plan · 3 next moves
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', margin: 0, opacity: 0.6 }}>
          For when brutal honesty is not enough
        </p>
      </div>


{/* responsive grids */}
      <style>{`
        @media (max-width: 680px) {
          .analysis-grid { grid-template-columns: 1fr !important; }
          .pivot-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  )
}

// ── Named export for raw fallback ─────────────────────────────
export { RawFallback }

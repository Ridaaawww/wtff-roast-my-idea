import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: 'Is Roast My Idea free?',
    a: 'Yes. The core roast is free and gives you a fast verdict, survival rate, and key weaknesses before you commit more time or money.',
  },
  {
    q: 'Can I roast a website instead of a startup idea?',
    a: 'Yes. You can paste a website URL and get feedback on clarity, copy, UX, and what a new visitor is likely to misunderstand.',
  },
  {
    q: 'What do I get in each analysis?',
    a: 'Each result includes a verdict, survival probability, roast lines, likely cause of failure, a redeeming angle, and practical business feedback.',
  },
  {
    q: 'Who should use this tool?',
    a: 'It is best for founders, indie hackers, and teams validating an idea, offer, homepage, or positioning before building or launching.',
  },
]

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        background: 'var(--card)',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '16px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text)',
            lineHeight: 1.4,
          }}
        >
          {item.q}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            color: 'var(--flame)',
            flexShrink: 0,
            lineHeight: 1,
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
          }}
        >
          +
        </span>
      </button>

      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--muted)',
            lineHeight: '1.7',
            margin: 0,
            padding: '0 18px 16px',
          }}
        >
          {item.a}
        </p>
      </div>
    </div>
  )
}

export default function FaqSection() {
  return (
    <section style={{ maxWidth: '840px', margin: '0 auto', paddingTop: '64px' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          color: 'var(--flame)',
          letterSpacing: '2.4px',
          marginBottom: '10px',
        }}
      >
        FAQ
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 3.5vw, 34px)',
          color: 'var(--text)',
          margin: '0 0 20px',
          lineHeight: 1.1,
        }}
      >
        Common questions about Roast My Idea
      </h2>

      <div style={{ display: 'grid', gap: '12px' }}>
        {FAQS.map((item) => (
          <FaqRow key={item.q} item={item} />
        ))}
      </div>
    </section>
  )
}

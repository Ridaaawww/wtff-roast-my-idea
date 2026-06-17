interface CardProps {
  kicker: string
  title: string
  body: string
  bullets: string[]
}

function FeatureCard({ kicker, title, body, bullets }: CardProps) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          color: 'var(--ember)',
          letterSpacing: '2px',
        }}
      >
        {kicker}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
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
          fontSize: '12px',
          color: 'var(--muted)',
          lineHeight: '1.65',
          margin: 0,
        }}
      >
        {body}
      </p>
      <ul className="roast-list">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  )
}

export default function WhySection() {
  return (
    <section style={{ maxWidth: '840px', margin: '0 auto', paddingTop: '64px' }}>

      <div style={{ maxWidth: '760px', marginBottom: '28px' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            color: 'var(--flame)',
            letterSpacing: '2.4px',
            marginBottom: '10px',
          }}
        >
          WHY FOUNDERS USE IT
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4.4vw, 40px)',
            color: 'var(--text)',
            margin: '0 0 14px',
            lineHeight: 1.1,
          }}
        >
          A startup idea validator for people who want signal before they build.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--muted)',
            lineHeight: '1.7',
            margin: 0,
          }}
        >
          Roast My Idea combines brutal AI feedback with practical validation advice. Use it to
          pressure-test a startup idea, landing page, or website before you spend weeks on
          product, copy, ads, or design.
        </p>
      </div>

      <div
        className="feature-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '14px',
        }}
      >
        <FeatureCard
          kicker="WHAT IT CHECKS"
          title="Market, positioning, and buyer clarity"
          body="The roast looks at whether the value proposition is clear, whether the buyer is obvious, and whether the idea sounds differentiated enough to deserve attention."
          bullets={[
            'Startup idea validation before you build an MVP',
            'Homepage and website roast for copy and UX',
            'A clear read on competition, risk, and survival odds',
          ]}
        />
        <FeatureCard
          kicker="WHAT YOU GET"
          title="Fast output you can actually use"
          body="Every analysis returns a survival rate, a market verdict, sharp roast lines, and practical feedback you can act on immediately."
          bullets={[
            'Brutal feedback with real business signal',
            'Concrete weak spots to fix next',
            'Useful for founders, indie hackers, and small teams',
          ]}
        />
        <FeatureCard
          kicker="BEST TIME TO USE IT"
          title="Before code, ads, or a redesign"
          body="It is most valuable when the idea or homepage is still flexible enough to change direction cheaply."
          bullets={[
            'Validate a startup idea before building',
            'Stress-test a website before paying for traffic',
            'Spot copy and UX problems before launch week',
          ]}
        />
      </div>

      <style>{`
        @media (max-width: 720px) { .feature-grid { grid-template-columns: 1fr !important; } }
      `}</style>

    </section>
  )
}

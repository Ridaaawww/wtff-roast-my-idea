import { useInView } from '../../hooks/useInView'

interface ErrorCard {
  code: string
  title: string
  body: string
  fix: string
  color: 'red' | 'amber' | 'blue'
}

const ERRORS: ErrorCard[] = [
  {
    code: 'Error 404',
    title: 'Original Idea Not Found',
    body: '"Uber for dogs." "AI for email." "Web3 for loyalty programs." We\'ve heard your idea. Three times this week. The fourth time isn\'t the charm.',
    fix: 'Be boring. Be specific. Be useful to someone real.',
    color: 'red',
  },
  {
    code: 'TypeError',
    title: 'validation !== product',
    body: '12 interviews. 3 surveys. A waitlist of 400. A notion page called "Research." None of these are users. None of these are revenue.',
    fix: 'Build something. Ship it. Watch what happens.',
    color: 'amber',
  },
  {
    code: 'NullPointerException',
    title: 'users.count() === 0',
    body: 'They said they\'d use it. They liked your tweet. They "signed up for early access" in Q3 of 2022. You\'re still waiting.',
    fix: 'Get one person to pay. Then get ten. Then talk to us.',
    color: 'red',
  },
  {
    code: 'StackOverflowError',
    title: 'feature_creep.push() — max depth exceeded',
    body: 'You have 38 features in your deck. Your competitor has 2 and $8M ARR. Correlation is not always causation. In this case it is.',
    fix: 'Delete 80% of your roadmap. Keep the part that physically hurts to cut.',
    color: 'amber',
  },
  {
    code: 'ETIMEDOUT',
    title: 'launch.ship() — operation timed out',
    body: '18 months building. 0 shipped. You are perfecting a product for users you don\'t have yet. Perfect has a cost. It\'s called market share.',
    fix: 'Launch ugly. The market will tell you more in one week than you\'ll learn in six months alone.',
    color: 'red',
  },
  {
    code: 'ReferenceError',
    title: 'PMF is not defined',
    body: 'You can\'t define product-market fit in a deck. You can\'t research your way to it. The market defines PMF. With their wallets. Not their words.',
    fix: 'Stop looking for PMF. Start looking for customers who complain when you\'re gone.',
    color: 'blue',
  },
]

const BORDER: Record<ErrorCard['color'], string> = {
  red:   'border-red-500/25 hover:border-red-500/50',
  amber: 'border-amber-500/25 hover:border-amber-500/50',
  blue:  'border-blue-500/25 hover:border-blue-500/50',
}

const CODE_COLOR: Record<ErrorCard['color'], string> = {
  red:   'text-red-400',
  amber: 'text-amber-400',
  blue:  'text-blue-400',
}

export default function ExceptionsSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section className="relative z-[1] bg-[#080808] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 py-24 md:py-32">

        <p className="font-mono text-xs text-white/25 tracking-[0.2em] uppercase mb-4">
          02 — known exceptions
        </p>
        <h2 className="font-mono text-white text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
          Bugs we see in every pitch.
        </h2>
        <p className="font-mono text-white/40 text-sm mb-14 max-w-xl">
          These aren&apos;t edge cases. They&apos;re the default state of a first-time founder.
          No shame. Just fix them.
        </p>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {ERRORS.map((err, i) => (
            <div
              key={err.code}
              className={`
                group rounded-xl border bg-white/[0.02] p-6
                transition-all duration-300 cursor-default
                ${BORDER[err.color]}
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{
                transitionDelay: inView ? `${i * 80}ms` : '0ms',
                transition: 'opacity 0.5s ease, transform 0.5s ease, border-color 0.2s ease, background 0.2s ease',
              }}
            >
              {/* Error code */}
              <p className={`font-mono text-[11px] font-semibold tracking-widest uppercase mb-3 ${CODE_COLOR[err.color]}`}>
                {err.code}
              </p>

              {/* Title */}
              <h3 className="font-mono text-white text-sm font-semibold mb-3 leading-snug">
                {err.title}
              </h3>

              {/* Body */}
              <p className="font-mono text-white/45 text-[12px] leading-relaxed mb-4">
                {err.body}
              </p>

              {/* Fix */}
              <div className="border-t border-white/8 pt-4">
                <p className="font-mono text-[11px] text-white/25 uppercase tracking-widest mb-1">
                  fix:
                </p>
                <p className="font-mono text-white/65 text-[12px] leading-relaxed">
                  {err.fix}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

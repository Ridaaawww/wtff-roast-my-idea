import { useInView } from '../../hooks/useInView'

interface Service {
  fn: string
  args: string
  desc: string
  note: string
}

const SERVICES: Service[] = [
  {
    fn: 'brand_identity',
    args: 'company, ambition, truth',
    desc: 'Make it look like it means something.',
    note: 'Your logo isn\'t your brand. Your track record is. We build the visual language that earns the right to charge more.',
  },
  {
    fn: 'product_design',
    args: 'problem, constraints, users',
    desc: 'Make it work like it was obvious all along.',
    note: 'UX so clear it needs no tutorial. The best interfaces are the ones that feel like they always existed.',
  },
  {
    fn: 'engineering',
    args: 'spec, timeline, non_negotiables',
    desc: 'Make it real. Not a prototype. A product.',
    note: 'Built to last, not to demo. Fast enough to ship. Clean enough to scale. We don\'t prototype your way to nowhere.',
  },
  {
    fn: 'strategy',
    args: 'market, goal, budget',
    desc: 'Make sure you\'re solving the right problem.',
    note: 'Before you build the wrong thing beautifully. One honest strategy conversation is worth six months of misaligned execution.',
  },
  {
    fn: 'launch_ops',
    args: 'product, audience, moment',
    desc: 'Make some noise.',
    note: 'The kind that converts, not just trends. A launch isn\'t a day. It\'s a system. We build that too.',
  },
]

export default function ServicesSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section className="relative z-[1] bg-[#080808] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 py-24 md:py-32">

        <p className="font-mono text-xs text-white/25 tracking-[0.2em] uppercase mb-4">
          04 — available modules
        </p>
        <h2 className="font-mono text-white text-2xl md:text-3xl font-semibold mb-2 tracking-tight">
          What we actually do.
        </h2>
        <p className="font-mono text-white/40 text-sm mb-14">
          Available as a full-service engagement or standalone module.
        </p>

        {/* Services list */}
        <div ref={ref} className="space-y-0">

          {/* Header row */}
          <div className="hidden md:grid grid-cols-[2fr_3fr] gap-8 pb-3 border-b border-white/8 mb-0">
            <span className="font-mono text-[11px] text-white/20 uppercase tracking-widest">Module</span>
            <span className="font-mono text-[11px] text-white/20 uppercase tracking-widest">Description</span>
          </div>

          {SERVICES.map((svc, i) => (
            <div
              key={svc.fn}
              className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4 md:gap-8 py-7 border-b border-white/8 group cursor-default"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.5s ease ${i * 90}ms, transform 0.5s ease ${i * 90}ms`,
              }}
            >
              {/* Left: function signature */}
              <div>
                <div className="font-mono text-green-400 text-sm font-semibold mb-1 group-hover:text-white transition-colors duration-200">
                  {svc.fn}
                  <span className="text-white/25">(</span>
                  <span className="text-white/40 text-[11px]">{svc.args}</span>
                  <span className="text-white/25">)</span>
                </div>
                <div className="font-mono text-[11px] text-white/20 uppercase tracking-widest">
                  returns: brand_equity
                </div>
              </div>

              {/* Right: description */}
              <div>
                <p className="font-mono text-white text-sm font-medium mb-2">
                  {svc.desc}
                </p>
                <p className="font-mono text-white/40 text-[12px] leading-relaxed">
                  {svc.note}
                </p>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div
            className="pt-6 font-mono text-[11px] text-white/20"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.5s ease ${SERVICES.length * 90 + 100}ms`,
            }}
          >
            <span className="text-white/15">// </span>
            minimum engagement: one honest conversation.
            <span className="text-white/15"> no decks required.</span>
          </div>

        </div>
      </div>
    </section>
  )
}

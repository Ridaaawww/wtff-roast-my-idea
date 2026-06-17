import { useState, useEffect } from 'react'
import { useInView } from '../../hooks/useInView'

const LINE_DELAY = 68 // ms between each line

type LT = 'header' | 'rule' | 'blank' | 'muted' | 'warn' | 'error' | 'result' | 'green' | 'prompt'

interface Line {
  text: string
  type: LT
}

const LINES: Line[] = [
  { text: 'MAINFRAME_OS v2.4.1 — FOUNDER DIAGNOSTIC TOOL', type: 'header' },
  { text: '────────────────────────────────────────────────────────', type: 'rule' },
  { text: '', type: 'blank' },
  { text: '$ ./scan --target founder.exe --mode deep --no-mercy', type: 'prompt' },
  { text: '', type: 'blank' },
  { text: '[scanning pitch_deck.pdf]            ✓  54 slides. slide 3 says "we\'re like airbnb but—"', type: 'warn' },
  { text: '[scanning traction.db]               ✗  NaN — expected Number, received "pre-launch"', type: 'error' },
  { text: '[scanning users.json]                ✗  [] — your mom doesn\'t count.', type: 'error' },
  { text: '[scanning mvp.build]                 ✗  figma prototype detected. close, but no.', type: 'error' },
  { text: '[scanning validation_survey.csv]     ✓  18 linkedin DMs. 17 said "sounds cool!"', type: 'warn' },
  { text: '[scanning competitor_analysis.md]    ✓  "no direct competitors" — that\'s never been true.', type: 'warn' },
  { text: '[scanning runway.xls]                ✗  9 months. $0 revenue. 1 figma subscription.', type: 'error' },
  { text: '[scanning twitter_activity.log]      ✓  "building in public 🛠️" since last tuesday.', type: 'warn' },
  { text: '', type: 'blank' },
  { text: '────────────────────────────────────────────────────────', type: 'rule' },
  { text: 'DIAGNOSIS:', type: 'header' },
  { text: '', type: 'blank' },
  { text: '  You don\'t have a startup.', type: 'result' },
  { text: '  You have a hypothesis wearing a Figma mockup.', type: 'result' },
  { text: '', type: 'blank' },
  { text: '  You came here for someone to say "great idea!"', type: 'muted' },
  { text: '  We\'re going to give you something better:', type: 'muted' },
  { text: '  a product people actually pay for.', type: 'green' },
  { text: '', type: 'blank' },
  { text: '$ mainframe --init <your_idea>', type: 'prompt' },
]

const COLOR: Record<LT, string> = {
  header:  'text-white font-semibold',
  rule:    'text-white/15',
  blank:   'h-3',
  muted:   'text-white/40',
  warn:    'text-amber-400',
  error:   'text-red-400',
  result:  'text-white text-base',
  green:   'text-green-400',
  prompt:  'text-green-400',
}

export default function DiagnosticSection() {
  const { ref, inView } = useInView(0.1)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let n = 0
    const iv = setInterval(() => {
      n++
      setCount(n)
      if (n >= LINES.length) clearInterval(iv)
    }, LINE_DELAY)
    return () => clearInterval(iv)
  }, [inView])

  return (
    <section className="relative z-[1] bg-black border-t border-white/5">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 py-24 md:py-32">

        {/* Section label */}
        <p className="font-mono text-xs text-white/25 tracking-[0.2em] uppercase mb-10">
          01 — system scan
        </p>

        {/* Terminal window */}
        <div ref={ref} className="rounded-xl overflow-hidden border border-white/8 shadow-2xl">

          {/* Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-[11px] text-white/25 tracking-widest uppercase">
              diagnostic.sh
            </span>
          </div>

          {/* Body */}
          <div className="p-6 md:p-10 font-mono text-[12px] sm:text-[13px] leading-[1.7] min-h-[420px] overflow-x-auto">
            {LINES.slice(0, count).map((line, i) => (
              <div
                key={i}
                className={COLOR[line.type]}
              >
                {line.type === 'blank' ? <>&nbsp;</> : line.text}
              </div>
            ))}

            {/* Blinking cursor once all lines are shown */}
            {count >= LINES.length && (
              <span className="cursor-blink inline-block w-[7px] h-[13px] bg-green-400 align-middle ml-[2px] mt-1" />
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

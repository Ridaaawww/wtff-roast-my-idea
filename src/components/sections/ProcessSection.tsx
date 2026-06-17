import { useState, useEffect } from 'react'
import { useInView } from '../../hooks/useInView'

const LINE_DELAY = 55

type LT = 'prompt' | 'output' | 'blank' | 'rule' | 'step' | 'dim' | 'accent'

interface Line {
  text: string
  type: LT
}

const LINES: Line[] = [
  { text: '$ whoami', type: 'prompt' },
  { text: 'mainframe — we build things that ship. not things that slide.', type: 'output' },
  { text: '', type: 'blank' },

  { text: '$ cat manifesto.txt', type: 'prompt' },
  { text: '', type: 'blank' },
  { text: 'Validation is a comfort ritual.', type: 'output' },
  { text: 'You watch YC videos. You read Stratechery. You build a competitive matrix.', type: 'output' },
  { text: 'None of this is building.', type: 'dim' },
  { text: '', type: 'blank' },
  { text: 'The market doesn\'t validate. It converts — or it doesn\'t.', type: 'output' },
  { text: 'Surveys are not revenue. Interest is not traction.', type: 'dim' },
  { text: 'A ship date is.', type: 'accent' },
  { text: '', type: 'blank' },
  { text: '────────────────────────────────', type: 'rule' },
  { text: '', type: 'blank' },

  { text: '$ mainframe --approach', type: 'prompt' },
  { text: '', type: 'blank' },
  { text: '[01] listen   ——  understand the actual problem. not the pitch.', type: 'step' },
  { text: '[02] decide   ——  make the call you\'ve been avoiding for months.', type: 'step' },
  { text: '[03] design   ——  strip it down. make it obvious.', type: 'step' },
  { text: '[04] build    ——  fast. clean. real. not a prototype.', type: 'step' },
  { text: '[05] ship     ——  done beats perfect. launch is a feature.', type: 'step' },
  { text: '', type: 'blank' },
  { text: '────────────────────────────────', type: 'rule' },
  { text: '', type: 'blank' },

  { text: '$ echo "what mainframe is not"', type: 'prompt' },
  { text: '', type: 'blank' },
  { text: 'A yes-machine.', type: 'dim' },
  { text: 'A deck factory.', type: 'dim' },
  { text: 'A team that reflects your assumptions back at you in a nicer font.', type: 'dim' },
  { text: '', type: 'blank' },
  { text: 'We tell you what\'s wrong.', type: 'output' },
  { text: 'Then we fix it.', type: 'output' },
  { text: 'Then we ship it.', type: 'accent' },
  { text: '', type: 'blank' },

  { text: '$ mainframe --status', type: 'prompt' },
  { text: 'ready.', type: 'accent' },
]

const COLOR: Record<LT, string> = {
  prompt: 'text-green-400',
  output: 'text-white/80',
  blank:  'h-3',
  rule:   'text-white/12',
  step:   'text-white/70',
  dim:    'text-white/35',
  accent: 'text-green-400 font-semibold',
}

export default function ProcessSection() {
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

        <p className="font-mono text-xs text-white/25 tracking-[0.2em] uppercase mb-10">
          03 — how we operate
        </p>

        {/* Two-col layout: label left, terminal right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">

          {/* Left label */}
          <div className="lg:sticky lg:top-24">
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
              We don&apos;t validate.<br />We execute.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Every studio claims they&apos;re different.
              Here&apos;s ours in plain text.
            </p>
          </div>

          {/* Terminal window */}
          <div ref={ref} className="rounded-xl overflow-hidden border border-white/8 shadow-2xl">
            {/* Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 font-mono text-[11px] text-white/25 tracking-widest uppercase">
                mainframe.sh
              </span>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 font-mono text-[12px] sm:text-[13px] leading-[1.75] min-h-[460px]">
              {LINES.slice(0, count).map((line, i) => (
                <div key={i} className={COLOR[line.type]}>
                  {line.type === 'blank' ? <>&nbsp;</> : line.text}
                </div>
              ))}
              {count >= LINES.length && (
                <span className="cursor-blink inline-block w-[7px] h-[13px] bg-green-400 align-middle ml-[2px] mt-1" />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

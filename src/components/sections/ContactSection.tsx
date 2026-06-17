import { useInView } from '../../hooks/useInView'

export default function ContactSection() {
  const { ref, inView } = useInView(0.2)

  const handleCopy = () => {
    navigator.clipboard.writeText('hello@mainframe.co').catch(() => undefined)
  }

  return (
    <section className="relative z-[1] bg-black border-t border-white/5">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-10 py-24 md:py-32">

        <p className="font-mono text-xs text-white/25 tracking-[0.2em] uppercase mb-16">
          05 — system ready
        </p>

        {/* Main CTA block */}
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end"
        >
          {/* Left: headline */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              Your idea is sitting
              <br />
              <span className="text-white/30">in a document</span>
              <br />
              somewhere.
            </h2>
            <p className="text-white/45 text-base leading-relaxed max-w-sm">
              The longer you wait for permission,
              the further ahead your competitor gets.
              <br /><br />
              There is no validation gate here.
              Just a conversation.
            </p>
          </div>

          {/* Right: terminal CTA */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
            }}
          >
            {/* Terminal block */}
            <div className="rounded-xl overflow-hidden border border-white/8 mb-8">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 font-mono text-[11px] text-white/25 tracking-widest uppercase">
                  contact.sh
                </span>
              </div>
              <div className="p-6 md:p-8 font-mono text-[13px] leading-[1.8]">
                <div className="text-white/40">$ mainframe --contact</div>
                <div className="text-white/40 mt-1">
                  &gt; initializing handshake...
                </div>
                <div className="text-green-400 mt-1">
                  &gt; channel open.
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-white/50">hello@mainframe.co</span>
                  <button
                    onClick={handleCopy}
                    className="text-[11px] text-white/25 border border-white/10 rounded px-2 py-0.5 hover:text-white hover:border-white/30 transition-colors duration-150"
                  >
                    copy
                  </button>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <span className="text-green-400">$</span>
                  <span className="cursor-blink inline-block w-[7px] h-[13px] bg-green-400 align-middle ml-[2px]" />
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:hello@mainframe.co"
                className="inline-flex items-center gap-2 bg-white text-black font-mono text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/85 transition-colors duration-200"
              >
                Start a project
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-transparent text-white/60 border border-white/15 font-mono text-sm px-6 py-3 rounded-full hover:text-white hover:border-white/35 transition-colors duration-200"
              >
                See our work
              </a>
            </div>
          </div>

        </div>

        {/* Footer bar */}
        <div className="mt-24 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-mono text-white/25 text-[12px]">
            © 2025 Mainframe. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            {['Twitter', 'Instagram', 'LinkedIn', 'Dribbble'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-[12px] text-white/25 hover:text-white/70 transition-colors duration-150"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="font-mono text-[11px] text-white/15">
            MAINFRAME_OS v2.4.1 — all systems operational.
          </div>
        </div>

      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'wtf_hackathon_seen'

export default function FirstTimeModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTimeout(() => setVisible(true), 1400)
    }
  }, [])

  const dismiss = () => { localStorage.setItem(STORAGE_KEY, '1'); setVisible(false) }
  const register = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
    window.open('https://hackathon.foundersfest.org', '_blank')
  }

  if (!visible) return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          border: '2px solid var(--flame)',
          background: 'var(--card)',
          padding: 'clamp(32px, 6vw, 56px) clamp(28px, 5vw, 48px)',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 0 60px rgba(61,201,20,0.25), 8px 8px 0 var(--shadow-btn)',
        }}
      >
        {/* pixel corners */}
        <div style={{ position:'absolute', top:0,   left:0,  width:20, height:20, borderRight:'2px solid var(--flame)', borderBottom:'2px solid var(--flame)', opacity:0.5 }} />
        <div style={{ position:'absolute', top:0,   right:0, width:20, height:20, borderLeft:'2px solid var(--flame)',  borderBottom:'2px solid var(--flame)', opacity:0.5 }} />
        <div style={{ position:'absolute', bottom:0,left:0,  width:20, height:20, borderRight:'2px solid var(--flame)', borderTop:'2px solid var(--flame)',    opacity:0.5 }} />
        <div style={{ position:'absolute', bottom:0,right:0, width:20, height:20, borderLeft:'2px solid var(--flame)',  borderTop:'2px solid var(--flame)',    opacity:0.5 }} />

        {/* kicker */}
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--flame)', letterSpacing:'3px', textTransform:'uppercase', marginBottom:'20px' }}>
          ⚡ What The Tech! — Founders Fest Hackathon
        </div>

        {/* headline */}
        <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(44px, 10vw, 78px)', lineHeight:0.92, color:'var(--text)', marginBottom:'20px' }}>
          SHUT UP<br />
          <span style={{ background:'linear-gradient(135deg, var(--flame), var(--ember))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            AND DO IT.
          </span>
        </div>

        {/* body */}
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'var(--muted)', lineHeight:1.75, margin:'0 0 28px' }}>
          Stop overthinking. Stop validating. Stop waiting for the perfect moment.
          Bring your idea — roasted or not — to <strong style={{ color:'var(--text)' }}>Founders Fest</strong> and
          actually ship something.
        </p>

        {/* CTA */}
        <button
          onClick={register}
          className="btn-roast-glow"
          style={{
            display: 'block', width: '100%',
            fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '2px',
            padding: '16px 32px',
            background: 'var(--flame)', color: '#fff',
            border: '2px solid var(--flame)', borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '14px',
          }}
        >
          REGISTER NOW →
        </button>

        {/* dismiss */}
        <button
          onClick={dismiss}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', padding: 0,
          }}
        >
          I'll keep overthinking, thanks
        </button>
      </div>
    </div>
  )
}

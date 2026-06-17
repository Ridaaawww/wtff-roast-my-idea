import { useState, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import WhySection  from './components/WhySection'
import FaqSection  from './components/FaqSection'
import SiteFooter  from './components/SiteFooter'

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isRoasting, setIsRoasting] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      {/* Theme toggle — fixed top-right */}
      <div style={{ position: 'fixed', top: '16px', right: '24px', zIndex: 200 }}>
        <button
          className="theme-toggle"
          onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        >
          {theme === 'dark' ? '☀ Light' : '◑ Dark'}
        </button>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '56px 24px 40px' }}>
        <HeroSection onActiveChange={setIsRoasting} />
        {!isRoasting && <WhySection />}
        {!isRoasting && <FaqSection />}
        <SiteFooter />
      </div>
    </>
  )
}

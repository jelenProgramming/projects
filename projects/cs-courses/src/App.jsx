import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Sun, Moon } from './components/Icons.jsx'
import { useLang } from './i18n.jsx'
import { useMode } from './mode.jsx'
import ModePrompt from './components/ModePrompt.jsx'
import CourseMenu from './components/CourseMenu.jsx'
import Home from './pages/Home.jsx'
import AlgoPage from './pages/AlgoPage.jsx'
import Info from './pages/Info.jsx'

function useTheme() {
  const [theme, setTheme] = useState(() => {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('algoviz-theme')) || 'light'
  })
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme)
    if (typeof localStorage !== 'undefined') localStorage.setItem('algoviz-theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const { lang, setLang } = useLang()
  const { mode, setMode } = useMode()

  const toggles = (
    <div className="top-toggles">
      <div className="mode-switch" role="group" aria-label="Study mode">
        <button className={mode === 'calm' ? 'active' : ''} onClick={() => setMode('calm')} title="Cram mode - condensed and calm">😮‍💨</button>
        <button className={mode === 'explore' ? 'active' : ''} onClick={() => setMode('explore')} title="Explore mode - full content and animations">🧭</button>
      </div>
      <div className="lang-switch" role="group" aria-label="Language">
        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'de' ? 'active' : ''} onClick={() => setLang('de')}>DE</button>
        <button className={lang === 'sl' ? 'active' : ''} onClick={() => setLang('sl')}>SL</button>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle light / dark">
        {theme === 'dark' ? <Sun /> : <Moon />}
      </button>
    </div>
  )

  return (
    <div className="app-top">
      <ModePrompt />
      <CourseMenu toggles={toggles} />
      <main className="main-top">
        <div className="main-inner">
          <Suspense fallback={<div className="page-skeleton" aria-hidden="true"><span /><span /><span /></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/algo/:slug" element={<AlgoPage />} />
              <Route path="/info" element={<Info />} />
              <Route path="/sources" element={<Info />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <footer className="site-foot">
        <span>© 2026 David Jelen</span>
        <a href="https://github.com/jelenProgramming" target="_blank" rel="noopener noreferrer">jelenProgramming</a>
      </footer>
    </div>
  )
}

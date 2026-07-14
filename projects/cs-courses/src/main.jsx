// Apply saved theme before first paint (default: light)
try { document.documentElement.setAttribute('data-theme', localStorage.getItem('algoviz-theme') || 'light') } catch (e) {}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { LangProvider } from './i18n.jsx'
import { ModeProvider } from './mode.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <ModeProvider>
      <HashRouter>
        <App />
      </HashRouter>
      </ModeProvider>
    </LangProvider>
  </React.StrictMode>,
)

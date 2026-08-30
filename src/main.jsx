import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Bundled rather than pulled from a CDN: the sheet is meant to be printed,
// and a missing webfont mid-print silently changes the whole layout.
//
// Hebrew and Latin only, and only the weights the design actually asks for —
// the catch-all imports drag in Arabic, Cyrillic, math and symbol subsets and
// turn a 70 kB deploy of type into a 2 MB one.
import '@fontsource/rubik/hebrew-700.css'
import '@fontsource/rubik/latin-700.css'
import '@fontsource/heebo/hebrew-400.css'
import '@fontsource/heebo/hebrew-700.css'
import '@fontsource/heebo/hebrew-900.css'
import '@fontsource/heebo/latin-400.css'
import '@fontsource/heebo/latin-700.css'
import '@fontsource/heebo/latin-900.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

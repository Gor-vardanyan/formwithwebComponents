import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './webComponents/wc-acomodation.ts'
import './webComponents/wc-owner.ts'
import './webComponents/wc-overview.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

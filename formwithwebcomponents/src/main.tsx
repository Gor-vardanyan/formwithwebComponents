import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './webComponents/components/wc-acomodation.ts'
import './webComponents/components/wc-owner.ts'
import './webComponents/components/wc-overview.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

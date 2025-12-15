import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@Jade/i18n'
import '@Jade/index.css'
import App from '@Jade/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

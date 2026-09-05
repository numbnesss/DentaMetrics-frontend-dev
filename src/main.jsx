import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PeriodProvider } from './context/PeriodContext.jsx'
import '@tabler/icons-webfont/dist/tabler-icons.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <StrictMode>
      <AuthProvider>
        <PeriodProvider>
          <App />
        </PeriodProvider>
      </AuthProvider>
    </StrictMode>
  </Router>
)

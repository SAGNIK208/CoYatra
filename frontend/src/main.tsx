import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from '@/App'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        layout: {
          socialButtonsVariant: 'blockButton',
          socialButtonsPlacement: 'bottom',
        },
        variables: {
          colorPrimary: '#2563EB',
          colorText: '#0F172A',
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)

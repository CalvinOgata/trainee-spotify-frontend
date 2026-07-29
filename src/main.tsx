import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './lib/contexts/PlayerContext'
import { LibraryProvider } from './lib/contexts/LibraryContext'
import { EntityCacheProvider } from './lib/contexts/EntityCacheContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EntityCacheProvider>
      <PlayerProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </PlayerProvider>
    </EntityCacheProvider>
  </StrictMode>,
)

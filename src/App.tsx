import { useState } from 'react'
import Navbar from './components/Navbar'
import Frame from './components/Frame'
import Player from './components/Player'

export type Page = 'home' | 'search' | 'profile' | 'artist'

function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState<Page>('home')

  const handleQueryChange = (q: string) => {
    setQuery(q)
    if (q) setPage('search')
  }

  const goHome = () => {
    setQuery('')
    setPage('home')
  }

  const goProfile = () => {
    setQuery('')
    setPage('profile')
  }

  const goArtist = () => {
    setQuery('')
    setPage('artist')
  }

  return (
    <div className="grid h-screen w-screen grid-rows-[60px_minmax(0,1fr)_64px] bg-black font-sans text-white overflow-hidden">
      <Navbar
        query={query}
        onQueryChange={handleQueryChange}
        onHomeClick={goHome}
        onProfileClick={goProfile}
      />
      <Frame query={query} page={page} onArtistClick={goArtist} />
      <Player />
    </div>
  )
}

export default App

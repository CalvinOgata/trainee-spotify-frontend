import { useState } from 'react'
import Navbar from './components/Navbar'
import Frame from './components/Frame'
import Player from './components/Player'

function App() {
  const [query, setQuery] = useState('')

  return (
    <div className="grid h-screen w-screen grid-rows-[60px_minmax(0,1fr)_64px] bg-black font-sans text-white overflow-hidden">
      <Navbar query={query} onQueryChange={setQuery} />
      <Frame query={query} />
      <Player />
    </div>
  )
}

export default App

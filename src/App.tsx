import Navbar from './components/Navbar'
import Frame from './components/Frame'
import Player from './components/Player'

function App() {
  return (
    <div className="grid h-screen w-screen grid-rows-[60px_minmax(0,1fr)_64px] bg-black font-sans text-white overflow-hidden">
      <Navbar />
      <Frame />
      <Player />
    </div>
  )
}

export default App

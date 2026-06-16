import { Spotify, Home, Search, X, Bell } from './icons'

function Navbar() {
  return (
    <header className="flex items-center justify-between bg-black p-3 border-b border-neutral-800">
      <div className="flex items-center">
        <Spotify />
      </div>
      <div className="flex items-center gap-2">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-neutral-900 text-neutral-300 hover:bg-neutral-800">
          <Home />
        </button>
        <div className="flex h-10 w-[440px] items-center gap-3 rounded-full border border-neutral-700 bg-neutral-900 px-4">
          <Search />
          <span className="flex-1 text-sm text-neutral-200">touch</span>
          <X />
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-neutral-300">
        <button className="flex items-center gap-2 hover:text-white">
          <span className="inline-block h-2 w-2 rounded-full bg-neutral-400" />
          Instalar aplicativo
        </button>
        <button className="text-neutral-400 hover:text-white">
          <Bell />
        </button>
        <div className="h-8 w-8 rounded-full bg-neutral-700" />
      </div>
    </header>
  )
}

export default Navbar

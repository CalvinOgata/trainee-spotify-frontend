import { Spotify, Home, Search, X, Bell, Download } from './icons'

function Navbar() {
  return (
    <header className="flex items-center justify-between bg-black p-3 border-b border-neutral-800">
      <div className="flex items-center">
        <Spotify />
      </div>
      <div className="flex h-9 w-[395px] items-center gap-1">
        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1F1F1F] text-[#B3B3B3] hover:brightness-125">
          <Home strokeWidth={1} />
        </button>
        <div className="flex h-9 w-[355px] items-center justify-between rounded-2xl border border-white bg-[#1F1F1F] px-3.5 text-white">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-[15px] text-[#B3B3B3]" strokeWidth={1.5} />
            <span className="text-xs font-normal text-white">touch</span>
          </div>
          <X className="h-[12.59px] w-[12.29px] text-[#B3B3B3]" strokeWidth={1} />
        </div>
      </div>
      <div className="flex h-9 items-center gap-8">
        <button className="flex items-center gap-2 text-[#B3B3B3] hover:text-white">
          <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-[#B3B3B3]">
            <Download className="h-2 w-2" strokeWidth={1.5} />
          </span>
          <span className="text-[10px] font-bold">Instalar aplicativo</span>
        </button>
        <button className="text-[#B3B3B3] hover:text-white">
          <Bell className="h-3 w-3" strokeWidth={1.5} />
        </button>
        <div className="h-9 w-9 rounded-full border-4 border-black bg-neutral-700" />
      </div>
    </header>
  )
}

export default Navbar

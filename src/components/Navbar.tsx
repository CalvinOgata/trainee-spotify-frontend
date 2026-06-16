import { Spotify, Home, Search, X, Bell, Download } from './icons'

type NavbarProps = {
  query: string
  onQueryChange: (q: string) => void
}

function Navbar({ query, onQueryChange }: NavbarProps) {
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
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <Search className="h-4 w-[15px] shrink-0 text-[#B3B3B3]" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="O que você quer ouvir?"
              aria-label="Pesquisar"
              className="flex-1 bg-transparent text-xs font-normal text-white placeholder:text-[#B3B3B3] outline-none"
            />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Limpar busca"
              className="shrink-0 text-[#B3B3B3] hover:text-white"
            >
              <X className="h-[12.59px] w-[12.29px]" strokeWidth={1} />
            </button>
          )}
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

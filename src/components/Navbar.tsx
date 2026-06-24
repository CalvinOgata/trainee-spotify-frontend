import profilePhoto from '../assets/images/profile_default.png'
import { Spotify, Home, Search, X, Bell, Download } from './icons'

type NavbarProps = {
  query: string
  onQueryChange: (q: string) => void
  onHomeClick: () => void
  onProfileClick: () => void
}

function Navbar({ query, onQueryChange, onHomeClick, onProfileClick }: NavbarProps) {
  return (
    <header className="flex items-center justify-between bg-black p-3 border-b border-neutral-800">
      <button onClick={onHomeClick} className="flex items-center hover:brightness-125" aria-label="Página inicial">
        <Spotify />
      </button>
      <div className="flex h-9 w-[395px] items-center gap-1">
        <button onClick={onHomeClick} className="shrink-0 hover:brightness-125" aria-label="Início">
          <Home />
        </button>
        <div className="flex h-9 w-[355px] items-center justify-between rounded-2xl border border-white bg-[#1F1F1F] px-3.5 text-white">
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <Search className="h-4 w-[15px] shrink-0 text-[#B3B3B3]" />
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
              <X className="h-[12.59px] w-[12.29px]" />
            </button>
          )}
        </div>
      </div>
      <div className="flex h-9 items-center gap-8">
        <button className="flex items-center gap-2 text-[#B3B3B3] hover:text-white">
          <Download className="h-3 w-3" />
          <span className="text-[10px] font-bold">Instalar aplicativo</span>
        </button>
        <button className="text-[#B3B3B3] hover:text-white">
          <Bell className="h-3 w-3" />
        </button>
        <button
          onClick={onProfileClick}
          aria-label="Perfil"
          className="h-9 w-9 overflow-hidden rounded-full border-4 border-black hover:brightness-110"
        >
          <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
        </button>
      </div>
    </header>
  )
}

export default Navbar

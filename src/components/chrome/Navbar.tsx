import { useEffect, useRef, useState } from 'react'
import profilePhoto from '../../assets/images/profile_default.png'
import { Spotify, Home, Search, X, Bell, Download } from '../icons'
import SearchDropdown from './SearchDropdown'
import { useRecentSearches, type RecentSearchItem } from '../../lib/hooks/useRecentSearches'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from '../../lib/api/types'

type NavbarProps = {
  query: string
  onQueryChange: (q: string) => void
  onSearchSubmit: () => void
  onHomeClick: () => void
  onProfileClick: () => void
  onArtistClick: (artist: Artist) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onAlbumClick: (album: AlbumSummary) => void
  onMusicClick: (music: Music, artist: Artist | null) => void
}

function Navbar({
  query,
  onQueryChange,
  onSearchSubmit,
  onHomeClick,
  onProfileClick,
  onArtistClick,
  onPlaylistClick,
  onAlbumClick,
  onMusicClick,
}: NavbarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const { recents, addRecent, removeRecent } = useRecentSearches()

  const handleMobileSearchOpen = () => setMobileSearchOpen(true)
  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false)
    onHomeClick()
  }

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const commitSearch = () => {
    if (!query.trim()) return
    setDropdownOpen(false)
    onSearchSubmit()
  }

  const pickAndClose = (recordAs: RecentSearchItem, navigate: () => void) => {
    addRecent(recordAs)
    setDropdownOpen(false)
    navigate()
  }

  return (
    <header className="flex items-center justify-between gap-3 bg-black p-3 border-b border-neutral-800">
      {/* Spotify mark (desktop only) */}
      <button
        onClick={onHomeClick}
        className="hidden shrink-0 items-center hover:brightness-125 md:flex"
        aria-label="Página inicial"
      >
        <Spotify />
      </button>

      {/* Mobile icon row — collapses to just Home + Search + (spacer) + Profile */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onHomeClick}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#1F1F1F] text-white hover:brightness-125"
            aria-label="Página inicial"
          >
            <Home className="h-4 w-4" />
          </button>
          <button
            onClick={handleMobileSearchOpen}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#1F1F1F] text-white hover:brightness-125"
            aria-label="Pesquisar"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search bar — desktop always, mobile only when expanded */}
      <div
        ref={searchBoxRef}
        className={`relative h-9 items-center gap-1 ${
          mobileSearchOpen ? 'flex' : 'hidden md:flex'
        }`}
      >
        <button
          onClick={() => { setDropdownOpen(false); onHomeClick() }}
          className="hidden shrink-0 hover:brightness-125 md:block"
          aria-label="Início"
        >
          <Home />
        </button>
        <div className="flex h-9 w-[355px] items-center justify-between rounded-2xl border border-transparent bg-[#1F1F1F] px-3.5 text-white focus-within:border-white">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <Search className="h-4 w-[15px] shrink-0 text-[#B3B3B3]" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  commitSearch()
                } else if (e.key === 'Escape') {
                  setDropdownOpen(false)
                }
              }}
              placeholder="O que você quer ouvir?"
              aria-label="Pesquisar"
              autoFocus={mobileSearchOpen}
              className="min-w-0 flex-1 bg-transparent text-xs font-normal text-white placeholder:text-[#B3B3B3] outline-none"
            />
          </div>
          {(query || mobileSearchOpen) && (
            <button
              type="button"
              onClick={mobileSearchOpen ? handleMobileSearchClose : () => onQueryChange('')}
              aria-label={mobileSearchOpen ? 'Fechar busca' : 'Limpar busca'}
              className="shrink-0 text-[#B3B3B3] hover:text-white"
            >
              <X className="h-[12.59px] w-[12.29px]" />
            </button>
          )}
        </div>
        {dropdownOpen && (
          <SearchDropdown
            query={query}
            recents={recents}
            onRemoveRecent={removeRecent}
            onArtistClick={(a) => pickAndClose({ kind: 'artist', artist: a }, () => onArtistClick(a))}
            onPlaylistClick={(p) => pickAndClose({ kind: 'playlist', playlist: p }, () => onPlaylistClick(p))}
            onAlbumClick={(a) => pickAndClose({ kind: 'album', album: a }, () => onAlbumClick(a))}
            onMusicClick={(m, a) => pickAndClose({ kind: 'music', music: m, artist: a }, () => onMusicClick(m, a))}
          />
        )}
      </div>

      {/* Right cluster */}
      {!mobileSearchOpen && (
        <div className="flex h-9 shrink-0 items-center gap-4 md:gap-8">
          <button className="hidden items-center gap-2 text-[#B3B3B3] hover:text-white md:flex">
            <Download className="h-3 w-3" />
            <span className="text-[10px] font-bold">Instalar aplicativo</span>
          </button>
          <button className="hidden text-[#B3B3B3] hover:text-white md:block">
            <Bell className="h-3 w-3" />
          </button>
          <button
            onClick={onProfileClick}
            aria-label="Perfil"
            className="h-9 w-9 shrink-0 overflow-hidden rounded-full border-4 border-black hover:brightness-110"
          >
            <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
          </button>
        </div>
      )}
    </header>
  )
}

export default Navbar

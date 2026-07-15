import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { getUserPlaylists, removeMusicFromPlaylist, togglePlaylistMusic } from '../lib/endpoints'
import { useApi } from '../lib/useApi'
import { useLibrary } from '../lib/LibraryContext'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from '../lib/types'
import {
  ChevronRight,
  CheckCircle,
  CreditsMenu,
  Disc,
  MinusCircle,
  Person,
  PlusCircle,
} from './icons'
import CreditsModal from './CreditsModal'

const LIKED_PLAYLIST_NAME = 'Músicas Curtidas'

type SongContextMenuProps = {
  music: Music
  artist: Artist | null
  album: AlbumSummary | null
  playlistId?: string
  x: number
  y: number
  playlistsKey: number
  onClose: () => void
  onTracksChanged: () => void
  onArtistClick?: (a: Artist) => void
  onAlbumClick?: (a: AlbumSummary) => void
}

type MenuItemProps = {
  icon: React.ReactNode
  label: string
  disabled?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
}

function MenuItem({ icon, label, disabled, hasSubmenu, onClick, onMouseEnter }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-neutral-400">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </span>
      {hasSubmenu && (
        <span className="shrink-0 text-neutral-400">
          <ChevronRight />
        </span>
      )}
    </button>
  )
}

function SongContextMenu({
  music,
  artist,
  album,
  playlistId,
  x,
  y,
  playlistsKey,
  onClose,
  onTracksChanged,
  onArtistClick,
  onAlbumClick,
}: SongContextMenuProps) {
  const { data: playlists } = useApi(getUserPlaylists, [playlistsKey])
  const { isSaved, toggleSaved } = useLibrary()
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)
  const submenuAnchorRef = useRef<HTMLDivElement>(null)

  const [pos, setPos] = useState({ x, y })
  const [submenuPos, setSubmenuPos] = useState({ x: 0, y: 0 })

  const likedPlaylist = useMemo(
    () => (playlists ?? []).find((p) => p.name === LIKED_PLAYLIST_NAME),
    [playlists],
  )
  const liked = !!music.playlistsId?.includes(likedPlaylist?.id ?? '')
  const saved = isSaved(music.id)

  useLayoutEffect(() => {
    const el = menuRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let nx = x
    let ny = y
    if (nx + rect.width > vw - 8) nx = Math.max(8, vw - rect.width - 8)
    if (ny + rect.height > vh - 8) ny = Math.max(8, vh - rect.height - 8)
    setPos({ x: nx, y: ny })
  }, [x, y])

  useLayoutEffect(() => {
    if (!submenuOpen) return
    const anchor = submenuAnchorRef.current
    const sub = submenuRef.current
    if (!anchor || !sub) return
    const anchorRect = anchor.getBoundingClientRect()
    const subRect = sub.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let nx = anchorRect.right + 4
    let ny = anchorRect.top
    if (nx + subRect.width > vw - 8) nx = Math.max(8, anchorRect.left - subRect.width - 4)
    if (ny + subRect.height > vh - 8) ny = Math.max(8, vh - subRect.height - 8)
    setSubmenuPos({ x: nx, y: ny })
  }, [submenuOpen, playlists])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (submenuOpen) setSubmenuOpen(false)
        else onClose()
      }
    }
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t)) return
      if (submenuRef.current?.contains(t)) return
      onClose()
    }
    const handleContextMenu = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t)) return
      if (submenuRef.current?.contains(t)) return
      onClose()
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('mousedown', handleClick)
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [onClose, submenuOpen])

  const handleAddToPlaylist = async (pid: string) => {
    try {
      await togglePlaylistMusic(pid, music.id)
      onTracksChanged()
    } catch {
      // ignore
    }
    onClose()
  }

  const handleRemoveFromCurrentPlaylist = async () => {
    if (!playlistId) return
    try {
      await removeMusicFromPlaylist(playlistId, music.id)
      onTracksChanged()
    } catch {
      // ignore
    }
    onClose()
  }

  const handleLikeToggle = async () => {
    if (!likedPlaylist) return
    try {
      await togglePlaylistMusic(likedPlaylist.id, music.id)
      onTracksChanged()
    } catch {
      // ignore
    }
    onClose()
  }

  const handleSaveToggle = () => {
    toggleSaved(music.id)
    onClose()
  }

  const handleGoArtist = () => {
    if (artist && onArtistClick) onArtistClick(artist)
    onClose()
  }

  const handleGoAlbum = () => {
    if (album && onAlbumClick) onAlbumClick(album)
    onClose()
  }

  const handleCredits = () => {
    setCreditsOpen(true)
  }

  return (
    <>
      <div
        ref={menuRef}
        onContextMenu={(e) => e.preventDefault()}
        style={{ top: pos.y, left: pos.x }}
        className="fixed z-50 w-[286px] overflow-hidden rounded-md bg-[#282828] py-1 shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
      >
        <div
          ref={submenuAnchorRef}
          onMouseEnter={() => setSubmenuOpen(true)}
          onMouseLeave={(e) => {
            const to = e.relatedTarget as Node | null
            if (to && submenuRef.current?.contains(to)) return
            setSubmenuOpen(false)
          }}
        >
          <MenuItem icon={<PlusCircle />} label="Adicionar à playlist" hasSubmenu />
        </div>

        {playlistId && (
          <MenuItem
            icon={<MinusCircle />}
            label="Remover desta playlist"
            onClick={handleRemoveFromCurrentPlaylist}
          />
        )}

        <MenuItem
          icon={liked ? <CheckCircle className="h-4 w-4 text-[#1FDF64]" /> : <PlusCircle />}
          label={liked ? 'Remover das Músicas Curtidas' : 'Salvar em Músicas Curtidas'}
          onClick={handleLikeToggle}
          disabled={!likedPlaylist}
        />

        <MenuItem
          icon={saved ? <CheckCircle className="h-4 w-4 text-[#1FDF64]" /> : <PlusCircle />}
          label={saved ? 'Remover da sua biblioteca' : 'Salvar na sua biblioteca'}
          onClick={handleSaveToggle}
        />

        <div className="my-1 h-px bg-white/10" />

        <MenuItem
          icon={<Person />}
          label="Ir para o artista"
          onClick={handleGoArtist}
          disabled={!artist || !onArtistClick}
        />
        <MenuItem
          icon={<Disc />}
          label="Ir para o álbum"
          onClick={handleGoAlbum}
          disabled={!album || !onAlbumClick}
        />
        <MenuItem icon={<CreditsMenu />} label="Ver créditos" onClick={handleCredits} />
      </div>

      {submenuOpen && (
        <div
          ref={submenuRef}
          onMouseEnter={() => setSubmenuOpen(true)}
          onMouseLeave={(e) => {
            const to = e.relatedTarget as Node | null
            if (to && submenuAnchorRef.current?.contains(to)) return
            setSubmenuOpen(false)
          }}
          onContextMenu={(e) => e.preventDefault()}
          style={{ top: submenuPos.y, left: submenuPos.x }}
          className="fixed z-50 flex max-h-[320px] w-[240px] flex-col overflow-y-auto rounded-md bg-[#282828] py-1 shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
        >
          {(playlists ?? []).length === 0 ? (
            <p className="px-3 py-2 text-xs text-neutral-400">Nenhuma playlist</p>
          ) : (
            (playlists ?? []).map((p: PlaylistSummary) => {
              const already = music.playlistsId?.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => handleAddToPlaylist(p.id)}
                  className="flex items-center justify-between gap-2 truncate px-3 py-2 text-left text-xs text-white hover:bg-white/10"
                >
                  <span className="truncate">{p.name}</span>
                  {already && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#1FDF64]" />}
                </button>
              )
            })
          )}
        </div>
      )}

      {creditsOpen && (
        <CreditsModal
          title={music.title}
          artistName={artist?.name ?? '—'}
          onClose={() => {
            setCreditsOpen(false)
            onClose()
          }}
        />
      )}
    </>
  )
}

export default SongContextMenu

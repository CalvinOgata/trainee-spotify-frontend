import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { getUserPlaylists, removeMusicFromPlaylist, togglePlaylistMusic } from '../lib/endpoints'
import { useApi } from '../lib/useApi'
import { useLibrary } from '../lib/LibraryContext'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from '../lib/types'
import {
  AddLikedSongs,
  AddPlaylist,
  AlreadyAdded,
  CheckCircle,
  CreditsMenu,
  Disc,
  GoToArtist,
  RemovePlaylist,
} from './icons'
import CreditsModal from './CreditsModal'
import { ContextMenuShell, MenuItem } from './ContextMenuShell'

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
  const submenuRef = useRef<HTMLDivElement>(null)
  const submenuAnchorRef = useRef<HTMLDivElement>(null)

  const [submenuPos, setSubmenuPos] = useState({ x: 0, y: 0 })

  const likedPlaylist = useMemo(
    () => (playlists ?? []).find((p) => p.name === LIKED_PLAYLIST_NAME),
    [playlists],
  )
  const liked = !!music.playlistsId?.includes(likedPlaylist?.id ?? '')
  const saved = isSaved(music.id)

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

  const extraDismissRefs = useMemo(() => [submenuRef], [])

  const handleEscape = () => {
    if (submenuOpen) setSubmenuOpen(false)
    else onClose()
  }

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
    toggleSaved(music)
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
      <ContextMenuShell
        x={x}
        y={y}
        onClose={onClose}
        width={286}
        onEscape={handleEscape}
        extraDismissContainsRefs={extraDismissRefs}
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
          <MenuItem icon={<AddPlaylist />} label="Adicionar à playlist" hasSubmenu />
        </div>

        {playlistId && (
          <MenuItem
            icon={<RemovePlaylist />}
            label="Remover desta playlist"
            onClick={handleRemoveFromCurrentPlaylist}
          />
        )}

        <MenuItem
          icon={liked ? <AlreadyAdded /> : <AddLikedSongs />}
          label={liked ? 'Remover das Músicas Curtidas' : 'Salvar em Músicas Curtidas'}
          onClick={handleLikeToggle}
          disabled={!likedPlaylist}
        />

        <MenuItem
          icon={saved ? <AlreadyAdded /> : <AddLikedSongs />}
          label={saved ? 'Remover da sua biblioteca' : 'Salvar na sua biblioteca'}
          onClick={handleSaveToggle}
        />

        <div className="my-1 h-px bg-white/10" />

        <MenuItem
          icon={<GoToArtist />}
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
      </ContextMenuShell>

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
            <p className="font-[Inter] px-3 py-2 text-[10px] font-medium text-[#B3B3B3]">Nenhuma playlist</p>
          ) : (
            (playlists ?? []).map((p: PlaylistSummary) => {
              const already = music.playlistsId?.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => handleAddToPlaylist(p.id)}
                  className="font-[Inter] flex items-center justify-between gap-2 truncate px-3 py-2 text-left text-[10px] font-medium text-[#B3B3B3] hover:bg-white/10"
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

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  forceAddMusicToPlaylist,
  getUserPlaylists,
  removeMusicFromPlaylistAt,
  togglePlaylistMusic,
} from '../../lib/endpoints'
import { useApi } from '../../lib/useApi'
import { useLibrary } from '../../lib/LibraryContext'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from '../../lib/types'
import {
  AddLikedSongs,
  AddPlaylist,
  AlreadyAdded,
  CheckCircle,
  CreditsMenu,
  Disc,
  GoToArtist,
  RemovePlaylist,
} from '../icons'
import ConfirmDuplicateSongModal from '../modals/ConfirmDuplicateSongModal'
import CreditsModal from '../modals/CreditsModal'
import { ContextMenuShell, MenuItem } from './ContextMenuShell'

const LIKED_PLAYLIST_NAME = 'Músicas Curtidas'

type SongContextMenuProps = {
  music: Music
  artist: Artist | null
  album: AlbumSummary | null
  playlistId?: string
  playlistPosition?: number
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
  playlistPosition,
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
  const [duplicateFor, setDuplicateFor] = useState<PlaylistSummary | null>(null)
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

  const closeTimerRef = useRef<number | null>(null)
  const cancelSubmenuClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }
  const scheduleSubmenuClose = () => {
    cancelSubmenuClose()
    closeTimerRef.current = window.setTimeout(() => {
      setSubmenuOpen(false)
      closeTimerRef.current = null
    }, 1000)
  }
  useEffect(() => () => cancelSubmenuClose(), [])

  const handleEscape = () => {
    if (submenuOpen) setSubmenuOpen(false)
    else onClose()
  }

  const handleAddToPlaylist = async (p: PlaylistSummary) => {
    if (music.playlistsId?.includes(p.id)) {
      setSubmenuOpen(false)
      setDuplicateFor(p)
      return
    }
    try {
      await togglePlaylistMusic(p.id, music.id)
      onTracksChanged()
    } catch {
      // ignore
    }
    onClose()
  }

  const handleConfirmDuplicate = async () => {
    if (!duplicateFor) return
    console.log('[duplicate] confirm clicked', { playlistId: duplicateFor.id, musicId: music.id })
    try {
      const result = await forceAddMusicToPlaylist(duplicateFor.id, music.id)
      console.log('[duplicate] backend responded:', result)
      onTracksChanged()
    } catch (e) {
      console.error('[duplicate] forceAddMusicToPlaylist failed:', e)
    }
    setDuplicateFor(null)
    onClose()
  }

  const handleRemoveFromCurrentPlaylist = async () => {
    if (!playlistId || playlistPosition === undefined) return
    try {
      await removeMusicFromPlaylistAt(playlistId, playlistPosition)
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
          onMouseEnter={() => {
            cancelSubmenuClose()
            setSubmenuOpen(true)
          }}
          onMouseLeave={scheduleSubmenuClose}
        >
          <MenuItem icon={<AddPlaylist />} label="Adicionar à playlist" hasSubmenu />
        </div>

        {playlistId && playlistPosition !== undefined && (
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

      <div
        ref={submenuRef}
        onMouseEnter={cancelSubmenuClose}
        onMouseLeave={scheduleSubmenuClose}
        onContextMenu={(e) => e.preventDefault()}
        style={{ top: submenuPos.y, left: submenuPos.x }}
        className={`fixed z-50 flex max-h-[320px] w-[240px] flex-col overflow-y-auto rounded-md bg-[#282828] py-1 shadow-[0_16px_32px_rgba(0,0,0,0.5)] transition-opacity duration-200 ${
          submenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
          {(playlists ?? []).length === 0 ? (
            <p className="font-[Inter] px-3 py-2 text-[10px] font-medium text-[#B3B3B3]">Nenhuma playlist</p>
          ) : (
            (playlists ?? []).map((p: PlaylistSummary) => {
              const already = music.playlistsId?.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => handleAddToPlaylist(p)}
                  className="font-[Inter] flex items-center justify-between gap-2 truncate px-3 py-2 text-left text-[10px] font-medium text-[#B3B3B3] hover:bg-white/10"
                >
                  <span className="truncate">{p.name}</span>
                  {already && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#1FDF64]" />}
                </button>
              )
            })
          )}
      </div>

      {creditsOpen && (
        <CreditsModal
          title={music.title}
          artist={artist}
          onClose={() => {
            setCreditsOpen(false)
            onClose()
          }}
        />
      )}

      {duplicateFor && (
        <ConfirmDuplicateSongModal
          playlistName={duplicateFor.name}
          onConfirm={handleConfirmDuplicate}
          onCancel={() => {
            setDuplicateFor(null)
            onClose()
          }}
        />
      )}
    </>
  )
}

export default SongContextMenu

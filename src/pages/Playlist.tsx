import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import profilePhoto from '../assets/images/profile_default.png'
import songCover from '../assets/images/song_default.png'
import { Clock, MusicNote, Pen, Trash, X } from '../components/icons'
import ConfirmDeletePlaylistModal from '../components/ConfirmDeletePlaylistModal'
import EditPlaylistDetailsModal from '../components/EditPlaylistDetailsModal'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { usePlaylistContextMenu } from '../lib/PlaylistContextMenuContext'
import { useLibrary } from '../lib/LibraryContext'
import {
  deletePlaylist,
  getPlaylist,
  getRecentAlbums,
  getRecentArtists,
  removeMusicFromPlaylist,
  reorderPlaylist,
  updatePlaylistAttributes,
} from '../lib/endpoints'
import { formatDuration, formatPlaylistDuration, formatPtDate } from '../lib/format'
import type { Music, PlaylistSummary } from '../lib/types'

const PlayArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 5v14l11-7z" />
  </svg>
)

type PlaylistProps = {
  playlist: PlaylistSummary
  playlistsKey: number
  onDeleted: () => void
  onUpdated: (updated: PlaylistSummary) => void
  onTracksChanged: () => void
}

function Playlist({ playlist, playlistsKey, onDeleted, onUpdated, onTracksChanged }: PlaylistProps) {
  const { data: full } = useApi(() => getPlaylist(playlist.id), [playlist.id, playlistsKey])
  const { data: artists } = useApi(getRecentArtists)
  const { data: albums } = useApi(getRecentAlbums)
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { isPlaylistPrivate } = useLibrary()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const [localOrder, setLocalOrder] = useState<Music[] | null>(null)
  const [dragSrc, setDragSrc] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  const pendingOrderRef = useRef<string[] | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (full && pendingOrderRef.current === null) setLocalOrder(null)
  }, [full])

  useEffect(() => {
    const flushKeepalive = () => {
      const ids = pendingOrderRef.current
      if (!ids) return
      pendingOrderRef.current = null
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      reorderPlaylist(playlist.id, ids, { keepalive: true }).catch(() => {})
    }
    window.addEventListener('beforeunload', flushKeepalive)
    return () => {
      window.removeEventListener('beforeunload', flushKeepalive)
      flushKeepalive()
    }
  }, [playlist.id])

  const handleRemoveTrack = async (musicId: string) => {
    try {
      await removeMusicFromPlaylist(playlist.id, musicId)
      onTracksChanged()
    } catch {
      // ignore
    }
  }

  const tracks = localOrder ?? full?.musics ?? []
  const artistById = new Map((artists ?? []).map((a) => [a.id, a]))
  const albumById = new Map((albums ?? []).map((a) => [a.id, a]))

  const musicQtd = full?.musicQtd ?? playlist.musicQtd
  const duration = full?.duration ?? playlist.duration
  const isEmpty = musicQtd === 0

  const isLikedPlaylist = playlist.name === 'Músicas Curtidas'
  const cover = resolveImageUrl(playlist.imageUrl) ?? (isLikedPlaylist ? favoritesCover : playlistCover)

  const handleDelete = async () => {
    setConfirmOpen(false)
    try {
      await deletePlaylist(playlist.id)
      onDeleted()
    } catch {
      // ignore
    }
  }

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    const first = tracks[0]
    play(first, { artist: artistById.get(first.artistId), queue: tracks })
  }

  const handleDragStart = (i: number) => (e: DragEvent<HTMLLIElement>) => {
    setDragSrc(i)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(i))
  }

  const handleDragOver = (i: number) => (e: DragEvent<HTMLLIElement>) => {
    if (dragSrc === null) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOver !== i) setDragOver(i)
  }

  const scheduleFlush = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      const ids = pendingOrderRef.current
      debounceTimerRef.current = null
      if (!ids) return
      pendingOrderRef.current = null
      reorderPlaylist(playlist.id, ids)
        .then(() => onTracksChanged())
        .catch(() => {})
    }, 3000)
  }

  const handleDrop = (i: number) => (e: DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    const src = dragSrc
    setDragSrc(null)
    setDragOver(null)
    if (src === null || src === i) return
    const reordered = [...tracks]
    const [moved] = reordered.splice(src, 1)
    reordered.splice(i, 0, moved)
    setLocalOrder(reordered)
    pendingOrderRef.current = reordered.map((t) => t.id)
    scheduleFlush()
  }

  const handleDragEnd = () => {
    setDragSrc(null)
    setDragOver(null)
  }

  const handleSaveEdit = async (input: { name: string; description: string }) => {
    try {
      const updated = await updatePlaylistAttributes(playlist.id, input)
      onUpdated(updated)
      setEditOpen(false)
    } catch {
      // ignore
    }
  }

  return (
    <>
    <div className="flex h-full flex-col gap-3">
      <div
        onContextMenu={(e) => openPlaylistMenu(e, playlist)}
        className="-mx-5 -mt-6 flex items-end gap-4 bg-gradient-to-b from-[#535353] to-[#1a1a1a] px-5 pt-10 pb-4"
      >
        {isEmpty ? (
          <div className="grid h-[160px] w-[160px] shrink-0 place-items-center rounded bg-[#282828] text-neutral-400 shadow-[0_4px_60px_rgba(0,0,0,0.5)]">
            <MusicNote className="h-14 w-14" />
          </div>
        ) : (
          <img src={cover} alt="" className="h-[160px] w-[160px] shrink-0 rounded shadow-[0_4px_60px_rgba(0,0,0,0.5)] object-cover" />
        )}
        <div className="flex min-w-0 flex-col pb-2">
          <p className="text-xs font-semibold leading-none text-white">
            {isPlaylistPrivate(playlist.id) ? 'Playlist particular' : 'Playlist pública'}
          </p>
          <h1 className="mt-2 truncate text-4xl font-bold leading-none text-white sm:text-5xl lg:text-7xl">{playlist.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white">
            <img src={profilePhoto} alt="" className="h-4 w-4 rounded-full object-cover" />
            Vitoria Tenorio
            {!isEmpty && (
              <span className="font-normal text-white/80">
                {' • '}
                {musicQtd} músicas, {formatPlaylistDuration(duration)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {isEmpty ? (
          <div />
        ) : (
          <button
            onClick={handlePlayAll}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
            aria-label="Reproduzir"
          >
            <PlayArrow />
          </button>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditOpen(true)}
            className="text-neutral-400 hover:text-white"
            aria-label="Editar detalhes"
            title="Editar detalhes"
          >
            <Pen />
          </button>
          {!isLikedPlaylist && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="text-neutral-400 hover:text-white"
              aria-label="Excluir playlist"
              title="Excluir playlist"
            >
              <Trash />
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-white">Nenhuma música adicionada ainda</p>
          <p className="text-xs font-normal text-neutral-400">Adicione músicas para começar</p>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-1">
            <div className="grid grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] items-center gap-3 border-b border-neutral-800 px-2 pb-2 text-xs font-normal text-neutral-400">
              <span>#</span>
              <span>Título</span>
              <span>Álbum</span>
              <span>Adicionada em</span>
              <span className="flex justify-end"><Clock /></span>
              <span />
            </div>
            <ul className="flex flex-col">
              {tracks.map((t, i) => {
                const artist = artistById.get(t.artistId)
                const album = albumById.get(t.albumId)
                return (
                  <li
                    key={t.id}
                    draggable
                    onDragStart={handleDragStart(i)}
                    onDragOver={handleDragOver(i)}
                    onDrop={handleDrop(i)}
                    onDragEnd={handleDragEnd}
                    onClick={() => play(t, { artist, queue: tracks, source: { kind: 'playlist', playlist } })}
                    onContextMenu={(e) =>
                      openSongMenu(e, {
                        music: t,
                        artist: artist ?? null,
                        album: album ?? null,
                        playlistId: playlist.id,
                      })
                    }
                    className={`grid h-12 cursor-pointer grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] items-center gap-3 rounded px-2 text-xs hover:bg-neutral-900 ${
                      dragSrc === i ? 'opacity-40' : ''
                    } ${
                      dragOver === i && dragSrc !== null && dragSrc !== i
                        ? 'shadow-[inset_0_2px_0_0_#1FDF64]'
                        : ''
                    }`}
                  >
                    <span className="text-neutral-400">{i + 1}</span>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight text-white">{t.title}</p>
                        <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">
                          {artist?.name ?? 'Artista'}
                        </p>
                      </div>
                    </div>
                    <p className="truncate font-semibold text-white">{album?.title ?? '—'}</p>
                    <p className="truncate text-neutral-400">{formatPtDate(t.createdAt)}</p>
                    <p className="text-right text-neutral-400">{formatDuration(t.duration)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveTrack(t.id)
                      }}
                      className="text-neutral-400 hover:text-white"
                      aria-label="Remover desta playlist"
                      title="Remover desta playlist"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}
    </div>
    {confirmOpen && (
      <ConfirmDeletePlaylistModal
        playlistName={playlist.name}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    )}
    {editOpen && (
      <EditPlaylistDetailsModal
        playlist={playlist}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />
    )}
    </>
  )
}

export default Playlist

import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import profilePhoto from '../assets/images/profile_default.png'
import songCover from '../assets/images/song_default.png'
import { Clock, MusicNote, PlaylistSongOptions } from '../components/icons'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { usePlaylistContextMenu } from '../lib/PlaylistContextMenuContext'
import { useLibrary } from '../lib/LibraryContext'
import { useTrackEntityMaps } from '../lib/EntityCacheContext'
import {
  getPlaylist,
  getRecentAlbums,
  getRecentArtists,
  reorderPlaylist,
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
  onTracksChanged: () => void
}

function Playlist({ playlist, playlistsKey, onTracksChanged }: PlaylistProps) {
  const { data: full } = useApi(() => getPlaylist(playlist.id), [playlist.id, playlistsKey])
  const { data: artists } = useApi(getRecentArtists)
  const { data: albums } = useApi(getRecentAlbums)
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { isPlaylistPrivate } = useLibrary()

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

  const tracks = localOrder ?? full?.musics ?? []

  const { artistById, albumById } = useTrackEntityMaps(tracks, {
    seedArtists: artists,
    seedAlbums: albums,
  })

  const musicQtd = full?.musicQtd ?? playlist.musicQtd
  const duration = full?.duration ?? playlist.duration
  const isEmpty = musicQtd === 0

  const isLikedPlaylist = playlist.name === 'Músicas Curtidas'
  const cover = resolveImageUrl(playlist.imageUrl) ?? (isLikedPlaylist ? favoritesCover : playlistCover)

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    const first = tracks[0]
    play(first, {
      artist: artistById.get(first.artistId),
      queue: tracks,
      source: { kind: 'playlist', playlist },
      promote: 'source',
    })
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

  return (
    <div className="flex h-full flex-col">
      <div
        onContextMenu={(e) => openPlaylistMenu(e, playlist)}
        className="-mx-5 -mt-6 flex items-end gap-4 bg-gradient-to-b from-[#535353] to-[#1a1a1a] px-5 pt-10 pb-4"
      >
        {isEmpty ? (
          <div className="grid h-[174px] w-[174px] shrink-0 place-items-center rounded bg-[#282828] text-neutral-400 shadow-[0_4px_60px_rgba(0,0,0,0.5)]">
            <MusicNote className="h-14 w-14" />
          </div>
        ) : (
          <img src={cover} alt="" className="h-[174px] w-[174px] shrink-0 rounded shadow-[0_4px_60px_rgba(0,0,0,0.5)] object-cover" />
        )}
        <div className="flex min-w-0 flex-col pb-2">
          <p className="font-[Inter] text-[10px] font-medium leading-none text-white">
            {isPlaylistPrivate(playlist.id) ? 'Playlist particular' : 'Playlist pública'}
          </p>
          <h1 className="font-[Inter] mt-9 truncate text-[64px] font-black leading-none text-white">{playlist.name}</h1>
          <p className="font-[Inter] mt-2 flex items-center gap-1.5 text-[10px] font-bold text-white">
            <img src={profilePhoto} alt="" className="h-4 w-4 rounded-full object-cover" />
            Vitoria Tenorio
            {!isEmpty && (
              <span className="font-medium text-[#B3B3B3]">
                {' • '}
                {musicQtd} músicas, {formatPlaylistDuration(duration)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex h-[108px] items-center">
        {!isEmpty && (
          <button
            onClick={handlePlayAll}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
            aria-label="Reproduzir"
          >
            <PlayArrow />
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-white">Nenhuma música adicionada ainda</p>
          <p className="text-xs font-normal text-neutral-400">Adicione músicas para começar</p>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-1">
            <div className="font-[Inter] grid grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] items-center gap-3 border-b border-neutral-800 px-4 pb-2 text-[10px] font-medium text-[#B3B3B3]">
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
                    className={`grid h-[52px] cursor-pointer grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] items-center gap-3 rounded px-4 py-2 hover:bg-[#2A2A2A] ${
                      dragSrc === i ? 'opacity-40' : ''
                    } ${
                      dragOver === i && dragSrc !== null && dragSrc !== i
                        ? 'shadow-[inset_0_2px_0_0_#1FDF64]'
                        : ''
                    }`}
                  >
                    <span className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{i + 1}</span>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-9 w-9 shrink-0 rounded-[2px] object-cover" />
                      <div className="min-w-0">
                        <p className="font-[Arial] truncate text-[10px] font-bold leading-tight text-white">{t.title}</p>
                        <p className="font-[Arial] truncate text-[10px] font-bold leading-tight text-[#B3B3B3]">
                          {artist?.name ?? 'Artista'}
                        </p>
                      </div>
                    </div>
                    <p className="font-[Inter] truncate text-[10px] font-bold text-[#B3B3B3]">{album?.title ?? '—'}</p>
                    <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">{formatPtDate(t.createdAt)}</p>
                    <p className="font-[Inter] text-right text-[10px] font-medium text-[#B3B3B3]">{formatDuration(t.duration)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openSongMenu(e, {
                          music: t,
                          artist: artist ?? null,
                          album: album ?? null,
                          playlistId: playlist.id,
                        })
                      }}
                      className="-mx-2 -my-2 flex h-8 w-8 items-center justify-center rounded-full text-[#B3B3B3] hover:bg-white/10 hover:text-white"
                      aria-label="Mais opções"
                      title="Mais opções"
                    >
                      <PlaylistSongOptions />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}

export default Playlist

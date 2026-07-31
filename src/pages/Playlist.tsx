import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import favoritesCover from '../assets/images/favorites_default.png'
import noCoverPlaylist from '../assets/images/NoCoverPlaylist.png'
import playlistCover from '../assets/images/playlist_default.png'
import profilePhoto from '../assets/images/profile_default.png'
import songCover from '../assets/images/song_default.png'
import { Clock, PlaylistSongOptions } from '../components/icons'
import { resolveImageUrl } from '../lib/api/client'
import { useApi } from '../lib/hooks/useApi'
import { usePlayer } from '../lib/contexts/PlayerContext'
import { useSongContextMenu } from '../lib/contexts/SongContextMenuContext'
import { usePlaylistContextMenu } from '../lib/contexts/PlaylistContextMenuContext'
import { useLibrary } from '../lib/contexts/LibraryContext'
import { useTrackEntityMaps } from '../lib/contexts/EntityCacheContext'
import {
  getPlaylist,
  getRecentAlbums,
  getRecentArtists,
  reorderPlaylist,
} from '../lib/api/endpoints'
import { formatDuration, formatPlaylistDuration, formatPtDate } from '../lib/format'
import type { Music, PlaylistSummary } from '../lib/api/types'

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
    <div className="flex h-full min-w-0 flex-col gap-3">
      <div
        onContextMenu={(e) => openPlaylistMenu(e, playlist)}
        className="-mx-3 -mt-4 flex min-h-[116px] min-w-[360px] shrink-0 items-end gap-3 bg-gradient-to-b from-[#938D8E] to-[#3E3939] px-3 pt-4 pb-4 md:-mx-5 md:-mt-6 md:min-h-0 md:min-w-0 md:gap-4 md:px-5 md:pt-10"
      >
        <img
          src={isEmpty ? noCoverPlaylist : cover}
          alt=""
          className="h-[100px] w-[100px] shrink-0 rounded shadow-[0_4px_60px_rgba(0,0,0,0.5)] object-cover md:h-[174px] md:w-[174px]"
        />
        <div className="flex min-w-0 max-w-[calc(100vw-160px)] flex-col pb-1 md:max-w-none md:pb-2">
          <p className="font-[Inter] text-[10px] font-medium leading-none text-white">
            {isPlaylistPrivate(playlist.id) ? 'Playlist particular' : 'Playlist pública'}
          </p>
          <h1 className="font-[Inter] mt-2 truncate text-[20px] font-bold leading-none text-white md:mt-9 md:text-[64px] md:font-black">{playlist.name}</h1>
          <p className="font-[Inter] mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-bold text-white">
            <span className="flex items-center gap-1.5">
              <img src={profilePhoto} alt="" className="h-4 w-4 rounded-full object-cover" />
              <span className="whitespace-nowrap">Vitoria Tenorio</span>
            </span>
            {!isEmpty && (
              <span className="whitespace-nowrap font-medium text-[#B3B3B3]">
                • {musicQtd} músicas, {formatPlaylistDuration(duration)}
              </span>
            )}
          </p>
        </div>
      </div>

      {!isEmpty && (
        <div className="flex items-center">
          <button
            onClick={handlePlayAll}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
            aria-label="Reproduzir"
          >
            <PlayArrow />
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="flex flex-col gap-3 p-5">
          <p className="font-[Inter] text-[18px] font-bold text-white">Nenhuma música adicionada ainda</p>
          <p className="font-[Inter] text-[16px] font-medium text-[#B3B3B3]">Adicione músicas para começar</p>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-1">
            <div className="font-[Inter] hidden grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] items-center gap-3 border-b border-neutral-800 px-4 pb-2 text-[10px] font-medium text-[#B3B3B3] md:grid">
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
                        playlistPosition: i,
                      })
                    }
                    className={`grid h-[52px] cursor-pointer grid-cols-[20px_minmax(0,1fr)_24px] items-center gap-3 rounded px-2 py-2 hover:bg-[#2A2A2A] md:grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] md:px-4 ${
                      dragSrc === i ? 'opacity-40' : ''
                    } ${
                      dragOver === i && dragSrc !== null && dragSrc !== i
                        ? 'shadow-[inset_0_2px_0_0_#1FDF64]'
                        : ''
                    }`}
                  >
                    <span className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{i + 1}</span>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-10 w-10 shrink-0 rounded-[2px] object-cover md:h-9 md:w-9" />
                      <div className="min-w-0">
                        <p className="font-[Arial] truncate text-[12px] font-bold leading-tight text-white md:text-[10px]">{t.title}</p>
                        <p className="font-[Arial] truncate text-[10px] font-bold leading-tight text-[#B3B3B3]">
                          {artist?.name ?? 'Artista'}
                        </p>
                      </div>
                    </div>
                    <p className="hidden font-[Inter] truncate text-[10px] font-bold text-[#B3B3B3] md:block">{album?.title ?? '—'}</p>
                    <p className="hidden font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3] md:block">{formatPtDate(t.createdAt)}</p>
                    <p className="hidden font-[Inter] text-right text-[10px] font-medium text-[#B3B3B3] md:block">{formatDuration(t.duration)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openSongMenu(e, {
                          music: t,
                          artist: artist ?? null,
                          album: album ?? null,
                          playlistId: playlist.id,
                          playlistPosition: i,
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

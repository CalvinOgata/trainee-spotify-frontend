import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import songCover from '../assets/images/song_default.png'
import {
  Bookmark,
  Heart,
  MinimizedPlayer,
  Next,
  Pause,
  Play,
  Plus,
  Prev,
  VolumeHigh,
  VolumeLow,
  VolumeMute,
} from './icons'
import { usePlayer } from '../lib/PlayerContext'
import { useApi } from '../lib/useApi'
import { getPlaylist, getUserPlaylists, togglePlaylistMusic } from '../lib/endpoints'
import { formatDuration } from '../lib/format'
import type { Playlist as PlaylistType } from '../lib/types'

const LIKED_PLAYLIST_NAME = 'Músicas Curtidas'

type PlayerProps = {
  onFullscreenClick: () => void
  isFullscreen: boolean
  playlistsKey: number
  onPlaylistsChanged: () => void
}

function Player({ onFullscreenClick, isFullscreen, playlistsKey, onPlaylistsChanged }: PlayerProps) {
  const { current, currentArtist, isPlaying, position, togglePlay, next, prev, seek } = usePlayer()
  const { data: playlists } = useApi(getUserPlaylists, [playlistsKey])

  const likedPlaylistId = (playlists ?? []).find((p) => p.name === LIKED_PLAYLIST_NAME)?.id
  const { data: likedPlaylist } = useApi<PlaylistType | null>(
    () => (likedPlaylistId ? getPlaylist(likedPlaylistId) : Promise.resolve(null)),
    [likedPlaylistId, playlistsKey],
  )
  const liked = !!(current && likedPlaylist?.musics?.some((m) => m.id === current.id))

  const [saved, setSaved] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [volume, setVolume] = useState(0.75)
  const [lastVolume, setLastVolume] = useState(0.75)
  const volumeBarRef = useRef<HTMLDivElement>(null)
  const draggingVolume = useRef(false)

  const progressBarRef = useRef<HTMLDivElement>(null)
  const draggingProgress = useRef(false)

  const title = current?.title ?? 'Nenhuma música'
  const subtitle = current ? currentArtist?.name ?? 'Artista' : ''
  const duration = current?.duration ?? 0
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0

  const updateProgressFromClientX = (clientX: number) => {
    if (!current) return
    const el = progressBarRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    seek(fraction * current.duration)
  }

  const handleProgressMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!current) return
    draggingProgress.current = true
    updateProgressFromClientX(e.clientX)
  }

  const updateVolumeFromEvent = (clientX: number) => {
    const el = volumeBarRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setVolume(fraction)
    if (fraction > 0) setLastVolume(fraction)
  }

  const handleVolumeMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    draggingVolume.current = true
    updateVolumeFromEvent(e.clientX)
  }

  useEffect(() => {
    const handleMove = (e: globalThis.MouseEvent) => {
      if (draggingVolume.current) updateVolumeFromEvent(e.clientX)
      if (draggingProgress.current) updateProgressFromClientX(e.clientX)
    }
    const handleUp = () => {
      draggingVolume.current = false
      draggingProgress.current = false
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [current])

  const handleMuteToggle = () => {
    if (volume > 0) {
      setLastVolume(volume)
      setVolume(0)
    } else {
      setVolume(lastVolume > 0 ? lastVolume : 0.5)
    }
  }

  const VolumeIcon = volume === 0 ? VolumeMute : volume < 0.5 ? VolumeLow : VolumeHigh

  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const handleClick = () => setMenuOpen(false)
    window.addEventListener('keydown', handleKey)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('click', handleClick)
    }
  }, [menuOpen])

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!current) return
    setMenuOpen(false)
    try {
      await togglePlaylistMusic(playlistId, current.id)
      onPlaylistsChanged()
    } catch {
      // ignore
    }
  }

  const handleLikeToggle = async () => {
    if (!current || !likedPlaylistId) return
    try {
      await togglePlaylistMusic(likedPlaylistId, current.id)
      onPlaylistsChanged()
    } catch {
      // ignore
    }
  }

  return (
    <footer className="flex items-center gap-3 bg-black p-2.5">
      <div className="flex min-w-0 flex-1 basis-0 items-center gap-3">
        <div className="flex h-[35px] min-w-0 max-w-[200px] flex-1 items-center gap-3">
          <img
            src={songCover}
            alt=""
            className="h-[35px] w-9 shrink-0 rounded-[2px] object-cover"
            style={isFullscreen ? undefined : { viewTransitionName: 'song-cover' }}
          />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold text-white">{title}</p>
            <p className="truncate text-[10px] font-normal text-neutral-400">{subtitle}</p>
          </div>
        </div>
        {current && (
          <div className="hidden items-center gap-3 text-[#B3B3B3] md:flex">
            <button
              onClick={handleLikeToggle}
              disabled={!likedPlaylistId}
              className={liked ? 'text-[#1FDF64]' : 'hover:text-white disabled:opacity-40'}
              aria-label={liked ? 'Remover dos curtidos' : 'Curtir'}
              title={liked ? 'Remover dos curtidos' : 'Curtir'}
            >
              <Heart filled={liked} />
            </button>
            <button
              onClick={() => setSaved((v) => !v)}
              className={saved ? 'text-white' : 'hover:text-white'}
              aria-label={saved ? 'Remover da biblioteca' : 'Salvar na biblioteca'}
              title={saved ? 'Remover da biblioteca' : 'Salvar na biblioteca'}
            >
              <Bookmark filled={saved} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen((v) => !v)
                }}
                className="hover:text-white"
                aria-label="Adicionar à playlist"
                title="Adicionar à playlist"
              >
                <Plus />
              </button>
              {menuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-7 left-0 z-50 flex max-h-72 w-56 flex-col overflow-y-auto rounded-md bg-[#282828] py-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                >
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    Adicionar à playlist
                  </p>
                  {(playlists ?? []).length === 0 ? (
                    <p className="px-3 py-2 text-xs text-neutral-400">Nenhuma playlist</p>
                  ) : (
                    (playlists ?? []).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleAddToPlaylist(p.id)}
                        className="truncate px-3 py-2 text-left text-xs text-white hover:bg-neutral-700"
                      >
                        {p.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full max-w-[509px] shrink-0 flex-col items-center gap-1">
        <div className="flex h-10 w-full items-center justify-center gap-3">
          <button
            onClick={prev}
            className={`text-[#B3B3B3] hover:text-white ${isFullscreen ? '' : 'hidden md:inline-flex'}`}
            aria-label="Anterior"
          >
            <Prev />
          </button>
          <button
            onClick={togglePlay}
            className="hover:scale-105 transition-transform"
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button onClick={next} className="text-[#B3B3B3] hover:text-white" aria-label="Próxima">
            <Next />
          </button>
        </div>
        <div className={`w-full items-center gap-1.5 ${isFullscreen ? 'flex' : 'hidden md:flex'}`}>
          <span className="w-[22px] text-right text-[11px] font-medium leading-3 text-[#B3B3B3]">
            {formatDuration(Math.floor(position))}
          </span>
          <div
            ref={progressBarRef}
            onMouseDown={handleProgressMouseDown}
            className="group relative h-1 flex-1 cursor-pointer rounded-full bg-neutral-700"
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white group-hover:bg-[#1FDF64]"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:opacity-100"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <span className="w-[22px] text-[11px] font-medium leading-3 text-[#B3B3B3]">
            {formatDuration(duration)}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 basis-0 items-center justify-end gap-3 text-[#B3B3B3]">
        <button
          onClick={handleMuteToggle}
          className="hidden hover:text-white md:block"
          aria-label={volume === 0 ? 'Reativar som' : 'Silenciar'}
          title={volume === 0 ? 'Reativar som' : 'Silenciar'}
        >
          <VolumeIcon />
        </button>
        <div
          ref={volumeBarRef}
          onMouseDown={handleVolumeMouseDown}
          className="group relative hidden h-1 w-24 cursor-pointer rounded-full bg-neutral-700 md:block"
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white group-hover:bg-[#1FDF64]"
            style={{ width: `${volume * 100}%` }}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:opacity-100"
            style={{ left: `${volume * 100}%` }}
          />
        </div>
        <button onClick={onFullscreenClick} className="hover:text-white" aria-label="Tela cheia">
          <MinimizedPlayer />
        </button>
      </div>
    </footer>
  )
}

export default Player

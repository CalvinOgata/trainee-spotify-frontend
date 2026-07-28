import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import songCover from '../../assets/images/song_default.png'
import {
  MaximizedPlayer,
  MinimizedPlayer,
  Next,
  Pause,
  Play,
  Prev,
  VolumeHigh,
  VolumeLow,
  VolumeMute,
} from '../icons'
import { resolveImageUrl } from '../../lib/api'
import { usePlayer } from '../../lib/PlayerContext'
import { formatDuration } from '../../lib/format'

type PlayerProps = {
  onFullscreenClick: () => void
  isFullscreen: boolean
}

function Player({ onFullscreenClick, isFullscreen }: PlayerProps) {
  const { current, currentArtist, isPlaying, position, togglePlay, next, prev, seek } = usePlayer()

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

  return (
    <footer className="flex h-16 shrink-0 items-center gap-3 bg-black px-2.5 py-1">
      <div className="flex min-w-0 flex-1 basis-0 items-center gap-3">
        <div className="flex h-[35px] w-[111px] shrink-0 items-center gap-3">
          <img
            src={resolveImageUrl(current?.imageUrl) ?? songCover}
            alt=""
            className="h-[35px] w-9 shrink-0 rounded-[2px] object-cover"
            style={isFullscreen ? undefined : { viewTransitionName: 'song-cover' }}
          />
          <div className="flex min-w-0 flex-col gap-[10px]">
            <p className="font-[Inter] h-[12px] w-[63px] truncate text-[10px] font-bold leading-3 text-white">{title}</p>
            <p className="font-[Inter] h-[12px] w-[49px] truncate text-[10px] font-bold leading-3 text-[#B3B3B3]">{subtitle}</p>
          </div>
        </div>
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
        <button
          onClick={onFullscreenClick}
          className="hover:text-white"
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {isFullscreen ? <MaximizedPlayer /> : <MinimizedPlayer />}
        </button>
      </div>
    </footer>
  )
}

export default Player

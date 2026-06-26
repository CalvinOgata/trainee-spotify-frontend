import type { MouseEvent } from 'react'
import songCover from '../assets/images/song_default.png'
import { Play, Pause, Prev, Next, Mixer, MinimizedPlayer } from './icons'
import { usePlayer } from '../lib/PlayerContext'
import { formatDuration } from '../lib/format'

type PlayerProps = {
  onFullscreenClick: () => void
  isFullscreen: boolean
}

function Player({ onFullscreenClick, isFullscreen }: PlayerProps) {
  const { current, currentArtist, isPlaying, position, togglePlay, next, prev, seek } = usePlayer()

  const title = current?.title ?? 'Nenhuma música'
  const subtitle = current ? currentArtist?.name ?? 'Artista' : ''
  const duration = current?.duration ?? 0
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0

  const handleBarClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(fraction * duration)
  }

  return (
    <footer className="flex items-center justify-between bg-black p-2.5">
      <div className="flex h-[35px] w-[111px] items-center gap-3">
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
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-10 w-[509px] items-center justify-center gap-3">
          <button onClick={prev} className="text-[#B3B3B3] hover:text-white" aria-label="Anterior">
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
        <div className="flex w-[509px] items-center gap-1.5">
          <span className="w-[22px] text-right text-[11px] font-medium leading-3 text-[#B3B3B3]">
            {formatDuration(Math.floor(position))}
          </span>
          <div
            onClick={handleBarClick}
            className="relative h-1 flex-1 cursor-pointer rounded-full bg-neutral-700"
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="w-[22px] text-[11px] font-medium leading-3 text-[#B3B3B3]">
            {formatDuration(duration)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 text-[#B3B3B3]">
        <Mixer />
        <div className="relative h-1 w-24 rounded-full bg-neutral-700">
          <div className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-white" />
        </div>
        <button onClick={onFullscreenClick} className="hover:text-white" aria-label="Tela cheia">
          <MinimizedPlayer />
        </button>
      </div>
    </footer>
  )
}

export default Player

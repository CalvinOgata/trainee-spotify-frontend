import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getAlbumMusics } from './endpoints'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from './types'

type HistoryEntry = { music: Music; artist: Artist | null; queue: Music[] }

type NextUp = { music: Music; artist: Artist | null }

export type PlaybackSource =
  | { kind: 'album'; album: AlbumSummary }
  | { kind: 'playlist'; playlist: PlaylistSummary }
  | { kind: 'music'; album: AlbumSummary | null }

type PlayerContextValue = {
  current: Music | null
  currentArtist: Artist | null
  currentSource: PlaybackSource | null
  nextUp: NextUp | null
  isPlaying: boolean
  position: number
  play: (
    music: Music,
    opts?: { artist?: Artist; queue?: Music[]; source?: PlaybackSource },
  ) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (seconds: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Music | null>(null)
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null)
  const [currentSource, setCurrentSource] = useState<PlaybackSource | null>(null)
  const [queue, setQueue] = useState<Music[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [future, setFuture] = useState<HistoryEntry[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)

  const play = useCallback(
    async (
      music: Music,
      opts?: { artist?: Artist; queue?: Music[]; source?: PlaybackSource },
    ) => {
      if (current) {
        setHistory((h) => [...h, { music: current, artist: currentArtist, queue }])
      }
      setFuture([])
      setCurrent(music)
      setCurrentArtist(opts?.artist ?? null)
      setCurrentSource(opts?.source ?? null)
      setPosition(0)
      setIsPlaying(true)
      if (opts?.queue) {
        setQueue(opts.queue)
        return
      }
      try {
        const musics = await getAlbumMusics(music.albumId)
        setQueue(musics ?? [music])
      } catch {
        setQueue([music])
      }
    },
    [current, currentArtist, queue],
  )

  const next = useCallback(() => {
    if (!current) return
    if (future.length > 0) {
      const [nextEntry, ...rest] = future
      setHistory((h) => [...h, { music: current, artist: currentArtist, queue }])
      setFuture(rest)
      setCurrent(nextEntry.music)
      setCurrentArtist(nextEntry.artist)
      setQueue(nextEntry.queue)
      setPosition(0)
      setIsPlaying(true)
      return
    }
    const idx = queue.findIndex((m) => m.id === current.id)
    if (idx < 0 || idx >= queue.length - 1) {
      setIsPlaying(false)
      return
    }
    setHistory((h) => [...h, { music: current, artist: currentArtist, queue }])
    setCurrent(queue[idx + 1])
    setPosition(0)
  }, [current, currentArtist, queue, future])

  const prev = useCallback(() => {
    if (!current || history.length === 0) return
    const last = history[history.length - 1]
    setFuture((f) => [{ music: current, artist: currentArtist, queue }, ...f])
    setHistory((h) => h.slice(0, -1))
    setCurrent(last.music)
    setCurrentArtist(last.artist)
    setQueue(last.queue)
    setPosition(0)
    setIsPlaying(true)
  }, [current, currentArtist, queue, history])

  const togglePlay = useCallback(() => {
    if (!current) return
    if (position >= current.duration) setPosition(0)
    setIsPlaying((v) => !v)
  }, [current, position])

  const seek = useCallback(
    (seconds: number) => {
      if (!current) return
      setPosition(Math.max(0, Math.min(seconds, current.duration)))
    },
    [current],
  )

  useEffect(() => {
    if (!isPlaying || !current) return
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = (t - last) / 1000
      last = t
      setPosition((p) => Math.min(p + dt, current.duration))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, current])

  useEffect(() => {
    if (current && position >= current.duration) {
      next()
    }
  }, [position, current, next])

  const nextUp: NextUp | null = (() => {
    if (!current) return null
    if (future.length > 0) {
      return { music: future[0].music, artist: future[0].artist }
    }
    const idx = queue.findIndex((m) => m.id === current.id)
    if (idx >= 0 && idx < queue.length - 1) {
      return { music: queue[idx + 1], artist: currentArtist }
    }
    return null
  })()

  return (
    <PlayerContext.Provider
      value={{
        current,
        currentArtist,
        currentSource,
        nextUp,
        isPlaying,
        position,
        play,
        togglePlay,
        next,
        prev,
        seek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}

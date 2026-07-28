import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useEntityCache } from './EntityCacheContext'
import { postPlay, type PlayKind } from './endpoints'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from './types'

export type PlaybackSource =
  | { kind: 'album'; album: AlbumSummary }
  | { kind: 'playlist'; playlist: PlaylistSummary }
  | { kind: 'music'; album: AlbumSummary | null }

export type RecencyKind = 'playlist' | 'album' | 'artist' | 'music'

export type PromoteKind = 'source' | 'artist' | 'music'

type HistoryEntry = {
  music: Music
  artist: Artist | null
  source: PlaybackSource | null
  queue: Music[]
  promote: PromoteKind
}

type NextUp = { music: Music; artist: Artist | null }

type PlayOpts = {
  artist?: Artist
  queue?: Music[]
  source?: PlaybackSource
  promote?: PromoteKind
}

type PlayerContextValue = {
  current: Music | null
  currentArtist: Artist | null
  currentSource: PlaybackSource | null
  currentPromote: PromoteKind
  queue: Music[]
  nextUp: NextUp | null
  isPlaying: boolean
  position: number
  play: (music: Music, opts?: PlayOpts) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (seconds: number) => void
  getRecency: (kind: RecencyKind, id: string) => number
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

const HISTORY_LIMIT = 50
const RECENT_PLAYS_STORAGE_KEY = 'spotify-frontend:recent-plays'
const PLAY_THRESHOLD_SECONDS = 30
const RECENT_PLAYS_PER_KIND = 8

// Keeps only the RECENT_PLAYS_PER_KIND most recent entries for each entity kind (music/album/artist/playlist).
function trimRecentPlays(map: Record<string, number>): Record<string, number> {
  const groups: Record<string, [string, number][]> = {}
  for (const [key, ts] of Object.entries(map)) {
    const kind = key.split(':')[0]
    if (!groups[kind]) groups[kind] = []
    groups[kind].push([key, ts])
  }
  const out: Record<string, number> = {}
  for (const kind in groups) {
    groups[kind].sort((a, b) => b[1] - a[1])
    for (const [key, ts] of groups[kind].slice(0, RECENT_PLAYS_PER_KIND)) out[key] = ts
  }
  return out
}

// Hydrates the persisted recency map from localStorage; drops any malformed or non-numeric entries.
function loadRecentPlays(): Record<string, number> {
  try {
    const raw = localStorage.getItem(RECENT_PLAYS_STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const out: Record<string, number> = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isFinite(v)) out[k] = v
    }
    return trimRecentPlays(out)
  } catch {
    return {}
  }
}

// Owns playback state (current track, queue, history/future, position) and exposes actions to mutate it.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Music | null>(null)
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null)
  const [currentSource, setCurrentSource] = useState<PlaybackSource | null>(null)
  const [currentPromote, setCurrentPromote] = useState<PromoteKind>('music')
  const [queue, setQueue] = useState<Music[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [future, setFuture] = useState<HistoryEntry[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [recentPlays, setRecentPlays] = useState<Record<string, number>>(loadRecentPlays)
  const stampedRef = useRef<string | null>(null)
  const { artistById } = useEntityCache()

  // Persists recentPlays back to localStorage whenever it changes so Library sort survives reloads.
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_PLAYS_STORAGE_KEY, JSON.stringify(recentPlays))
    } catch {
      // storage full or disabled — ignore
    }
  }, [recentPlays])

  // Timestamps the played music (always) plus the promoted source/artist per the intent flag; drives Library sort + light-up.
  // Caps the stored map to RECENT_PLAYS_PER_KIND per kind and mirrors each mark to the backend fire-and-forget.
  const stampRecency = useCallback(
    (
      music: Music | null,
      artist: Artist | null,
      source: PlaybackSource | null,
      promote: 'source' | 'artist' | 'music',
    ) => {
      const marks: Array<{ key: string; kind: PlayKind; id: string }> = []
      if (music) marks.push({ key: `music:${music.id}`, kind: 'music', id: music.id })
      if (promote === 'source') {
        if (source?.kind === 'playlist')
          marks.push({ key: `playlist:${source.playlist.id}`, kind: 'playlist', id: source.playlist.id })
        else if (source?.kind === 'album')
          marks.push({ key: `album:${source.album.id}`, kind: 'album', id: source.album.id })
      } else if (promote === 'artist' && artist) {
        marks.push({ key: `artist:${artist.id}`, kind: 'artist', id: artist.id })
      }
      if (marks.length === 0) return
      const now = Date.now()
      setRecentPlays((prev) => {
        const next = { ...prev }
        for (const { key } of marks) next[key] = now
        return trimRecentPlays(next)
      })
      for (const { kind, id } of marks) {
        postPlay(kind, id).catch(() => {})
      }
    },
    [],
  )

  // Returns the last-played timestamp for a given library entity, or 0 if never played.
  const getRecency = useCallback(
    (kind: RecencyKind, id: string) => recentPlays[`${kind}:${id}`] ?? 0,
    [recentPlays],
  )

  // Starts playback: pushes prior state to history (capped), swaps in the new track/queue/source/promote, resets position, stamps recency.
  const play = useCallback(
    (music: Music, opts?: PlayOpts) => {
      if (current) {
        setHistory((h) =>
          [
            ...h,
            { music: current, artist: currentArtist, source: currentSource, queue, promote: currentPromote },
          ].slice(-HISTORY_LIMIT),
        )
      }
      setFuture([])
      const nextPromote: PromoteKind = opts?.promote ?? 'music'
      setCurrent(music)
      setCurrentArtist(opts?.artist ?? null)
      setCurrentSource(opts?.source ?? null)
      setCurrentPromote(nextPromote)
      setQueue(opts?.queue ?? [music])
      setPosition(0)
      setIsPlaying(true)
    },
    [current, currentArtist, currentSource, currentPromote, queue],
  )

  // Advances playback: prefers a future entry (redo) if present, otherwise steps forward in the current queue; stops at queue end.
  const next = useCallback(() => {
    if (!current) return
    if (future.length > 0) {
      const [nextEntry, ...rest] = future
      setHistory((h) =>
        [
          ...h,
          { music: current, artist: currentArtist, source: currentSource, queue, promote: currentPromote },
        ].slice(-HISTORY_LIMIT),
      )
      setFuture(rest)
      setCurrent(nextEntry.music)
      setCurrentArtist(nextEntry.artist)
      setCurrentSource(nextEntry.source)
      setCurrentPromote(nextEntry.promote)
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
    setHistory((h) =>
      [
        ...h,
        { music: current, artist: currentArtist, source: currentSource, queue, promote: currentPromote },
      ].slice(-HISTORY_LIMIT),
    )
    const nextMusic = queue[idx + 1]
    const nextArtist = artistById.get(nextMusic.artistId) ?? null
    setCurrent(nextMusic)
    setCurrentArtist(nextArtist)
    setPosition(0)
  }, [current, currentArtist, currentSource, currentPromote, queue, future, artistById])

  // Steps backward in history: current state moves to the future stack, prior state is restored (including source/promote/queue).
  const prev = useCallback(() => {
    if (!current || history.length === 0) return
    const last = history[history.length - 1]
    setFuture((f) => [
      { music: current, artist: currentArtist, source: currentSource, queue, promote: currentPromote },
      ...f,
    ])
    setHistory((h) => h.slice(0, -1))
    setCurrent(last.music)
    setCurrentArtist(last.artist)
    setCurrentSource(last.source)
    setCurrentPromote(last.promote)
    setQueue(last.queue)
    setPosition(0)
    setIsPlaying(true)
  }, [current, currentArtist, currentSource, currentPromote, queue, history])

  // Pauses or resumes; if the track ended, seek back to zero so pressing play restarts it.
  const togglePlay = useCallback(() => {
    if (!current) return
    if (position >= current.duration) setPosition(0)
    setIsPlaying((v) => !v)
  }, [current, position])

  // Clamps and jumps the playhead to the requested second within the current track's duration.
  const seek = useCallback(
    (seconds: number) => {
      if (!current) return
      setPosition(Math.max(0, Math.min(seconds, current.duration)))
    },
    [current],
  )

  // While playing, drives `position` forward each frame via requestAnimationFrame; cleans up on pause/track change.
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

  // Auto-advances when the current track finishes (delegates to next() so queue-end also stops playback).
  useEffect(() => {
    if (current && position >= current.duration) {
      next()
    }
  }, [position, current, next])

  // Resets the "already stamped" marker when the current song changes so the next play can qualify.
  useEffect(() => {
    stampedRef.current = null
  }, [current?.id])

  // Fires stampRecency once per playback when position crosses min(30s, duration/2) — Spotify's rule for counting a "listen".
  // Guarded by stampedRef so the setState cascade fires at most once per song.
  useEffect(() => {
    if (!current || stampedRef.current === current.id) return
    const threshold = Math.min(PLAY_THRESHOLD_SECONDS, current.duration / 2)
    if (position >= threshold) {
      stampedRef.current = current.id
      // eslint-disable-next-line react-hooks/set-state-in-effect
      stampRecency(current, currentArtist, currentSource, currentPromote)
    }
  }, [position, current, currentArtist, currentSource, currentPromote, stampRecency])

  // Peek at what plays next: uses the top of the future stack if any, otherwise the next queue item; null when nothing follows.
  const nextUp: NextUp | null = (() => {
    if (!current) return null
    if (future.length > 0) {
      return { music: future[0].music, artist: future[0].artist }
    }
    const idx = queue.findIndex((m) => m.id === current.id)
    if (idx >= 0 && idx < queue.length - 1) {
      const nextMusic = queue[idx + 1]
      return { music: nextMusic, artist: artistById.get(nextMusic.artistId) ?? null }
    }
    return null
  })()

  return (
    <PlayerContext.Provider
      value={{
        current,
        currentArtist,
        currentSource,
        currentPromote,
        queue,
        nextUp,
        isPlaying,
        position,
        play,
        togglePlay,
        next,
        prev,
        seek,
        getRecency,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

// Hook accessor for player state; throws if used outside PlayerProvider.
export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}

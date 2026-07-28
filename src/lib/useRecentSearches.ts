import { useCallback, useEffect, useState } from 'react'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from './types'

export type RecentSearchItem =
  | { kind: 'music'; music: Music; artist: Artist | null }
  | { kind: 'artist'; artist: Artist }
  | { kind: 'album'; album: AlbumSummary }
  | { kind: 'playlist'; playlist: PlaylistSummary }

const STORAGE_KEY = 'spotify-frontend:recent-searches'
const CAP = 6

function idOf(item: RecentSearchItem): string {
  switch (item.kind) {
    case 'music': return `music:${item.music.id}`
    case 'artist': return `artist:${item.artist.id}`
    case 'album': return `album:${item.album.id}`
    case 'playlist': return `playlist:${item.playlist.id}`
  }
}

function load(): RecentSearchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RecentSearchItem[]).slice(0, CAP) : []
  } catch {
    return []
  }
}

function save(items: RecentSearchItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full or disabled — ignore
  }
}

export function useRecentSearches() {
  const [items, setItems] = useState<RecentSearchItem[]>(load)

  useEffect(() => {
    save(items)
  }, [items])

  const addRecent = useCallback((item: RecentSearchItem) => {
    setItems((prev) => {
      const id = idOf(item)
      const filtered = prev.filter((it) => idOf(it) !== id)
      return [item, ...filtered].slice(0, CAP)
    })
  }, [])

  const removeRecent = useCallback((item: RecentSearchItem) => {
    setItems((prev) => {
      const id = idOf(item)
      return prev.filter((it) => idOf(it) !== id)
    })
  }, [])

  return { recents: items, addRecent, removeRecent }
}

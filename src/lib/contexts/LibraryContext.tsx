import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  followArtist,
  getArtist,
  getFollowedArtists,
  getSavedAlbums,
  getSavedMusics,
  saveAlbum,
  saveMusic,
  unfollowArtist,
  unsaveAlbum,
  unsaveMusic,
} from '../api/endpoints'
import type { AlbumSummary, Artist, Music } from '../api/types'

type LibraryContextValue = {
  savedMusics: Music[]
  savedAlbums: AlbumSummary[]
  followedArtists: Artist[]

  isSaved: (musicId: string) => boolean
  toggleSaved: (music: Music) => void
  isFollowed: (artistId: string) => boolean
  toggleFollowed: (artist: Artist) => void
  isAlbumSaved: (albumId: string) => boolean
  toggleAlbumSaved: (album: AlbumSummary) => void

  isPinned: (artistId: string) => boolean
  togglePinned: (artist: Artist) => void
  isPlaylistPinned: (playlistId: string) => boolean
  togglePlaylistPinned: (playlistId: string) => void
  isPlaylistPrivate: (playlistId: string) => boolean
  togglePlaylistPrivate: (playlistId: string) => void
  isAlbumPinned: (albumId: string) => boolean
  toggleAlbumPinned: (album: AlbumSummary) => void

  getArtistById: (artistId: string) => Artist | null
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

const PINNED_ARTISTS_KEY = 'spotify-frontend:pinned-artists'
const PINNED_PLAYLISTS_KEY = 'spotify-frontend:pinned-playlists'
const PRIVATE_PLAYLISTS_KEY = 'spotify-frontend:private-playlists'
const PINNED_ALBUMS_KEY = 'spotify-frontend:pinned-albums'

// Hydrates a Set<string> from localStorage; returns empty Set on any error.
function loadStringSet(storageKey: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((v): v is string => typeof v === 'string'))
  } catch {
    return new Set()
  }
}

// Reusable boolean-membership set hook; if a storageKey is given, hydrates once and writes back on every change.
function useToggleableSet(storageKey?: string) {
  const [set, setSet] = useState<Set<string>>(() =>
    storageKey ? loadStringSet(storageKey) : new Set(),
  )
  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(set)))
    } catch {
      // storage full or disabled — ignore
    }
  }, [set, storageKey])
  const has = useCallback((id: string) => set.has(id), [set])
  const toggle = useCallback((id: string) => {
    setSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])
  return [has, toggle] as const
}

// Owns all library state (saved/followed/pinned/private) and exposes toggles that sync backend + local state.
export function LibraryProvider({ children }: { children: ReactNode }) {
  const [savedMusics, setSavedMusics] = useState<Music[]>([])
  const [savedAlbums, setSavedAlbums] = useState<AlbumSummary[]>([])
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([])

  const [isPinned, togglePinnedRaw] = useToggleableSet(PINNED_ARTISTS_KEY)
  const [isPlaylistPinned, togglePlaylistPinned] = useToggleableSet(PINNED_PLAYLISTS_KEY)
  const [isPlaylistPrivate, togglePlaylistPrivate] = useToggleableSet(PRIVATE_PLAYLISTS_KEY)
  const [isAlbumPinned, toggleAlbumPinnedRaw] = useToggleableSet(PINNED_ALBUMS_KEY)

  const [artistCache, setArtistCache] = useState<Record<string, Artist>>({})

  // On mount, populate the three server-owned library collections; failures leave them empty.
  useEffect(() => {
    getSavedMusics().then(setSavedMusics).catch(() => setSavedMusics([]))
    getSavedAlbums().then(setSavedAlbums).catch(() => setSavedAlbums([]))
    getFollowedArtists().then(setFollowedArtists).catch(() => setFollowedArtists([]))
  }, [])

  // Backfills artistCache with full Artist DTOs for any saved music whose artist isn't already known.
  useEffect(() => {
    const known = new Set([...followedArtists.map((a) => a.id), ...Object.keys(artistCache)])
    const needed = Array.from(
      new Set(savedMusics.map((m) => m.artistId).filter((id) => !known.has(id))),
    )
    if (needed.length === 0) return
    let cancelled = false
    Promise.all(
      needed.map((id) =>
        getArtist(id)
          .then((a) => [id, a] as const)
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return
      const additions: Record<string, Artist> = {}
      for (const r of results) if (r) additions[r[0]] = r[1]
      if (Object.keys(additions).length === 0) return
      setArtistCache((prev) => ({ ...prev, ...additions }))
    })
    return () => {
      cancelled = true
    }
  }, [savedMusics, followedArtists, artistCache])

  // Read-only artist lookup: checks followed list first, then the cache; returns null if still unknown.
  const getArtistById = useCallback(
    (artistId: string): Artist | null =>
      followedArtists.find((a) => a.id === artistId) ?? artistCache[artistId] ?? null,
    [followedArtists, artistCache],
  )

  // Membership check for saved musics.
  const isSaved = useCallback(
    (musicId: string) => savedMusics.some((m) => m.id === musicId),
    [savedMusics],
  )
  // Membership check for saved albums.
  const isAlbumSaved = useCallback(
    (albumId: string) => savedAlbums.some((a) => a.id === albumId),
    [savedAlbums],
  )
  // Membership check for followed artists.
  const isFollowed = useCallback(
    (artistId: string) => followedArtists.some((a) => a.id === artistId),
    [followedArtists],
  )

  // Saves or removes a music from the library, firing the matching backend request and updating local state optimistically.
  const toggleSaved = useCallback(
    (music: Music) => {
      const already = savedMusics.some((m) => m.id === music.id)
      if (already) unsaveMusic(music.id).catch(() => {})
      else saveMusic(music.id).catch(() => {})
      setSavedMusics((prev) =>
        prev.some((m) => m.id === music.id)
          ? prev.filter((m) => m.id !== music.id)
          : [music, ...prev],
      )
    },
    [savedMusics],
  )

  // Saves or removes an album from the library; same pattern as toggleSaved.
  const toggleAlbumSaved = useCallback(
    (album: AlbumSummary) => {
      const already = savedAlbums.some((a) => a.id === album.id)
      if (already) unsaveAlbum(album.id).catch(() => {})
      else saveAlbum(album.id).catch(() => {})
      setSavedAlbums((prev) =>
        prev.some((a) => a.id === album.id)
          ? prev.filter((a) => a.id !== album.id)
          : [album, ...prev],
      )
    },
    [savedAlbums],
  )

  // Toggles album pin; auto-saves the album to library when pinning something not yet saved (unpin never removes it).
  const toggleAlbumPinned = useCallback(
    (album: AlbumSummary) => {
      const willPin = !isAlbumPinned(album.id)
      if (willPin && !isAlbumSaved(album.id)) {
        saveAlbum(album.id).catch(() => {})
        setSavedAlbums((prev) =>
          prev.some((a) => a.id === album.id) ? prev : [album, ...prev],
        )
      }
      toggleAlbumPinnedRaw(album.id)
    },
    [isAlbumPinned, isAlbumSaved, toggleAlbumPinnedRaw],
  )

  // Toggles artist pin; auto-follows the artist when pinning someone not yet followed (unpin never unfollows).
  const togglePinned = useCallback(
    (artist: Artist) => {
      const willPin = !isPinned(artist.id)
      if (willPin && !isFollowed(artist.id)) {
        followArtist(artist.id).catch(() => {})
        setFollowedArtists((prev) =>
          prev.some((a) => a.id === artist.id) ? prev : [artist, ...prev],
        )
      }
      togglePinnedRaw(artist.id)
    },
    [isPinned, isFollowed, togglePinnedRaw],
  )

  // Follows or unfollows an artist, syncing backend and local followed list.
  const toggleFollowed = useCallback(
    (artist: Artist) => {
      const already = followedArtists.some((a) => a.id === artist.id)
      if (already) unfollowArtist(artist.id).catch(() => {})
      else followArtist(artist.id).catch(() => {})
      setFollowedArtists((prev) =>
        prev.some((a) => a.id === artist.id)
          ? prev.filter((a) => a.id !== artist.id)
          : [artist, ...prev],
      )
    },
    [followedArtists],
  )

  return (
    <LibraryContext.Provider
      value={{
        savedMusics,
        savedAlbums,
        followedArtists,
        isSaved,
        toggleSaved,
        isFollowed,
        toggleFollowed,
        isPinned,
        togglePinned,
        isPlaylistPinned,
        togglePlaylistPinned,
        isPlaylistPrivate,
        togglePlaylistPrivate,
        isAlbumSaved,
        toggleAlbumSaved,
        isAlbumPinned,
        toggleAlbumPinned,
        getArtistById,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

// Hook accessor for library state; throws if used outside LibraryProvider.
export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  followArtist,
  getFollowedArtists,
  getSavedAlbums,
  getSavedMusics,
  saveAlbum,
  saveMusic,
  unfollowArtist,
  unsaveAlbum,
  unsaveMusic,
} from './endpoints'
import type { AlbumSummary, Artist, Music } from './types'

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
  togglePinned: (artistId: string) => void
  isPlaylistPinned: (playlistId: string) => boolean
  togglePlaylistPinned: (playlistId: string) => void
  isPlaylistPrivate: (playlistId: string) => boolean
  togglePlaylistPrivate: (playlistId: string) => void
  isAlbumPinned: (albumId: string) => boolean
  toggleAlbumPinned: (albumId: string) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

function useToggleableSet() {
  const [set, setSet] = useState<Set<string>>(() => new Set())
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

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [savedMusics, setSavedMusics] = useState<Music[]>([])
  const [savedAlbums, setSavedAlbums] = useState<AlbumSummary[]>([])
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([])

  const [isPinned, togglePinned] = useToggleableSet()
  const [isPlaylistPinned, togglePlaylistPinned] = useToggleableSet()
  const [isPlaylistPrivate, togglePlaylistPrivate] = useToggleableSet()
  const [isAlbumPinned, toggleAlbumPinned] = useToggleableSet()

  useEffect(() => {
    getSavedMusics().then(setSavedMusics).catch(() => setSavedMusics([]))
    getSavedAlbums().then(setSavedAlbums).catch(() => setSavedAlbums([]))
    getFollowedArtists().then(setFollowedArtists).catch(() => setFollowedArtists([]))
  }, [])

  const isSaved = useCallback(
    (musicId: string) => savedMusics.some((m) => m.id === musicId),
    [savedMusics],
  )
  const isAlbumSaved = useCallback(
    (albumId: string) => savedAlbums.some((a) => a.id === albumId),
    [savedAlbums],
  )
  const isFollowed = useCallback(
    (artistId: string) => followedArtists.some((a) => a.id === artistId),
    [followedArtists],
  )

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
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}

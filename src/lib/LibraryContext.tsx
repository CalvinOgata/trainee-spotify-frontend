import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type LibraryContextValue = {
  isSaved: (musicId: string) => boolean
  toggleSaved: (musicId: string) => void
  isFollowed: (artistId: string) => boolean
  toggleFollowed: (artistId: string) => void
  isPinned: (artistId: string) => boolean
  togglePinned: (artistId: string) => void
  isPlaylistPinned: (playlistId: string) => boolean
  togglePlaylistPinned: (playlistId: string) => void
  isPlaylistPrivate: (playlistId: string) => boolean
  togglePlaylistPrivate: (playlistId: string) => void
  isAlbumSaved: (albumId: string) => boolean
  toggleAlbumSaved: (albumId: string) => void
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
  const [isSaved, toggleSaved] = useToggleableSet()
  const [isFollowed, toggleFollowed] = useToggleableSet()
  const [isPinned, togglePinned] = useToggleableSet()
  const [isPlaylistPinned, togglePlaylistPinned] = useToggleableSet()
  const [isPlaylistPrivate, togglePlaylistPrivate] = useToggleableSet()
  const [isAlbumSaved, toggleAlbumSaved] = useToggleableSet()
  const [isAlbumPinned, toggleAlbumPinned] = useToggleableSet()

  return (
    <LibraryContext.Provider
      value={{
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

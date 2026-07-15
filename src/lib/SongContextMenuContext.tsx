import { createContext, useCallback, useContext, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import SongContextMenu from '../components/SongContextMenu'
import type { AlbumSummary, Artist, Music } from './types'

type OpenOpts = {
  music: Music
  artist: Artist | null
  album: AlbumSummary | null
  playlistId?: string
}

type SongContextMenuContextValue = {
  openSongMenu: (e: MouseEvent, opts: OpenOpts) => void
}

const Ctx = createContext<SongContextMenuContextValue | null>(null)

type ProviderProps = {
  children: ReactNode
  playlistsKey: number
  onTracksChanged: () => void
  onArtistClick: (a: Artist) => void
  onAlbumClick: (a: AlbumSummary) => void
}

type MenuState = OpenOpts & { x: number; y: number }

export function SongContextMenuProvider({
  children,
  playlistsKey,
  onTracksChanged,
  onArtistClick,
  onAlbumClick,
}: ProviderProps) {
  const [state, setState] = useState<MenuState | null>(null)

  const openSongMenu = useCallback((e: MouseEvent, opts: OpenOpts) => {
    e.preventDefault()
    e.stopPropagation()
    setState({ ...opts, x: e.clientX, y: e.clientY })
  }, [])

  const close = useCallback(() => setState(null), [])

  return (
    <Ctx.Provider value={{ openSongMenu }}>
      {children}
      {state && (
        <SongContextMenu
          music={state.music}
          artist={state.artist}
          album={state.album}
          playlistId={state.playlistId}
          x={state.x}
          y={state.y}
          playlistsKey={playlistsKey}
          onClose={close}
          onTracksChanged={onTracksChanged}
          onArtistClick={onArtistClick}
          onAlbumClick={onAlbumClick}
        />
      )}
    </Ctx.Provider>
  )
}

export function useSongContextMenu() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSongContextMenu must be used within SongContextMenuProvider')
  return ctx
}

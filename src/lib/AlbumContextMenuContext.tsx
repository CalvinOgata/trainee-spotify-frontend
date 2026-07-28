import { createContext, useCallback, useContext, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import AlbumContextMenu from '../components/menus/AlbumContextMenu'
import type { AlbumSummary, Artist } from './types'

type AlbumContextMenuContextValue = {
  openAlbumMenu: (e: MouseEvent, album: AlbumSummary) => void
}

const Ctx = createContext<AlbumContextMenuContextValue | null>(null)

type ProviderProps = {
  children: ReactNode
  onArtistClick: (artist: Artist) => void
}

type MenuState = { album: AlbumSummary; x: number; y: number }

export function AlbumContextMenuProvider({ children, onArtistClick }: ProviderProps) {
  const [state, setState] = useState<MenuState | null>(null)

  const openAlbumMenu = useCallback((e: MouseEvent, album: AlbumSummary) => {
    e.preventDefault()
    e.stopPropagation()
    setState({ album, x: e.clientX, y: e.clientY })
  }, [])

  const close = useCallback(() => setState(null), [])

  return (
    <Ctx.Provider value={{ openAlbumMenu }}>
      {children}
      {state && (
        <AlbumContextMenu
          album={state.album}
          x={state.x}
          y={state.y}
          onClose={close}
          onArtistClick={onArtistClick}
        />
      )}
    </Ctx.Provider>
  )
}

export function useAlbumContextMenu() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAlbumContextMenu must be used within AlbumContextMenuProvider')
  return ctx
}

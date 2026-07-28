import { createContext, useCallback, useContext, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import ArtistContextMenu from '../components/menus/ArtistContextMenu'
import type { Artist } from './types'

type ArtistContextMenuContextValue = {
  openArtistMenu: (e: MouseEvent, artist: Artist) => void
}

const Ctx = createContext<ArtistContextMenuContextValue | null>(null)

type MenuState = { artist: Artist; x: number; y: number }

export function ArtistContextMenuProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MenuState | null>(null)

  const openArtistMenu = useCallback((e: MouseEvent, artist: Artist) => {
    e.preventDefault()
    e.stopPropagation()
    setState({ artist, x: e.clientX, y: e.clientY })
  }, [])

  const close = useCallback(() => setState(null), [])

  return (
    <Ctx.Provider value={{ openArtistMenu }}>
      {children}
      {state && <ArtistContextMenu artist={state.artist} x={state.x} y={state.y} onClose={close} />}
    </Ctx.Provider>
  )
}

export function useArtistContextMenu() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useArtistContextMenu must be used within ArtistContextMenuProvider')
  return ctx
}

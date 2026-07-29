import { createContext, useCallback, useContext, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import PlaylistContextMenu from '../../components/menus/PlaylistContextMenu'
import type { PlaylistSummary } from '../api/types'

type PlaylistContextMenuContextValue = {
  openPlaylistMenu: (e: MouseEvent, playlist: PlaylistSummary) => void
}

const Ctx = createContext<PlaylistContextMenuContextValue | null>(null)

type ProviderProps = {
  children: ReactNode
  onDeleted: (deletedId: string) => void
  onUpdated: (updated: PlaylistSummary) => void
}

type MenuState = { playlist: PlaylistSummary; x: number; y: number }

export function PlaylistContextMenuProvider({ children, onDeleted, onUpdated }: ProviderProps) {
  const [state, setState] = useState<MenuState | null>(null)

  const openPlaylistMenu = useCallback((e: MouseEvent, playlist: PlaylistSummary) => {
    e.preventDefault()
    e.stopPropagation()
    setState({ playlist, x: e.clientX, y: e.clientY })
  }, [])

  const close = useCallback(() => setState(null), [])

  return (
    <Ctx.Provider value={{ openPlaylistMenu }}>
      {children}
      {state && (
        <PlaylistContextMenu
          playlist={state.playlist}
          x={state.x}
          y={state.y}
          onClose={close}
          onDeleted={onDeleted}
          onUpdated={onUpdated}
        />
      )}
    </Ctx.Provider>
  )
}

export function usePlaylistContextMenu() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePlaylistContextMenu must be used within PlaylistContextMenuProvider')
  return ctx
}

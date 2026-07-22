import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLibrary } from '../lib/LibraryContext'
import type { Artist } from '../lib/types'
import { Pin, X } from './icons'

type ArtistContextMenuProps = {
  artist: Artist
  x: number
  y: number
  onClose: () => void
}

type MenuItemProps = {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-white hover:bg-white/10"
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-neutral-400">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  )
}

function ArtistContextMenu({ artist, x, y, onClose }: ArtistContextMenuProps) {
  const { isFollowed, toggleFollowed, isPinned, togglePinned } = useLibrary()
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x, y })

  const followed = isFollowed(artist.id)
  const pinned = isPinned(artist.id)

  useLayoutEffect(() => {
    const el = menuRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let nx = x
    let ny = y
    if (nx + rect.width > vw - 8) nx = Math.max(8, vw - rect.width - 8)
    if (ny + rect.height > vh - 8) ny = Math.max(8, vh - rect.height - 8)
    setPos({ x: nx, y: ny })
  }, [x, y])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t)) return
      onClose()
    }
    const handleContextMenu = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t)) return
      onClose()
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('mousedown', handleClick)
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [onClose])

  const handleFollowToggle = () => {
    toggleFollowed(artist)
    onClose()
  }

  const handlePinToggle = () => {
    togglePinned(artist.id)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      onContextMenu={(e) => e.preventDefault()}
      style={{ top: pos.y, left: pos.x }}
      className="fixed z-50 w-[240px] overflow-hidden rounded-md bg-[#282828] py-1 shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
    >
      <MenuItem
        icon={<X className="h-3.5 w-3.5" />}
        label={followed ? 'Deixar de seguir' : 'Seguir'}
        onClick={handleFollowToggle}
      />
      <MenuItem
        icon={<Pin className="h-4 w-4 text-[#1FDF64]" />}
        label={pinned ? 'Remover pin do artista' : 'Fixar artista'}
        onClick={handlePinToggle}
      />
    </div>
  )
}

export default ArtistContextMenu

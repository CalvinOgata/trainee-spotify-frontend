import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { ChevronRight } from '../icons'

type ContextMenuShellProps = {
  x: number
  y: number
  onClose: () => void
  width: number
  onEscape?: () => void
  extraDismissContainsRefs?: ReadonlyArray<RefObject<HTMLElement | null>>
  children: ReactNode
}

export function ContextMenuShell({
  x,
  y,
  onClose,
  width,
  onEscape,
  extraDismissContainsRefs,
  children,
}: ContextMenuShellProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x, y })

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
    const containsTarget = (t: Node) => {
      if (menuRef.current?.contains(t)) return true
      if (extraDismissContainsRefs) {
        for (const r of extraDismissContainsRefs) {
          if (r.current?.contains(t)) return true
        }
      }
      return false
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (onEscape) onEscape()
      else onClose()
    }
    const handleClick = (e: MouseEvent) => {
      if (containsTarget(e.target as Node)) return
      onClose()
    }
    const handleContextMenu = (e: MouseEvent) => {
      if (containsTarget(e.target as Node)) return
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
  }, [onClose, onEscape, extraDismissContainsRefs])

  return (
    <div
      ref={menuRef}
      onContextMenu={(e) => e.preventDefault()}
      style={{ top: pos.y, left: pos.x, width }}
      className="fixed z-50 overflow-hidden rounded-md bg-[#282828] py-1 shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
    >
      {children}
    </div>
  )
}

type MenuItemProps = {
  icon: ReactNode
  label: string
  disabled?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
}

export function MenuItem({ icon, label, disabled, hasSubmenu, onClick, onMouseEnter }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      className="font-[Inter] flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[10px] font-medium text-[#B3B3B3] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-neutral-400">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </span>
      {hasSubmenu && (
        <span className="shrink-0 text-neutral-400">
          <ChevronRight />
        </span>
      )}
    </button>
  )
}

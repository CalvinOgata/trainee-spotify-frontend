import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from '../icons'

type ModalShellProps = {
  onClose: () => void
  header?: ReactNode
  headerClassName?: string
  maxWidth?: string
  background?: string
  contentClassName?: string
  showClose?: boolean
  children: ReactNode
}

export function ModalShell({
  onClose,
  header,
  headerClassName,
  maxWidth = '420px',
  background = '#282828',
  contentClassName,
  showClose = true,
  children,
}: ModalShellProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const innerClass = `flex w-full flex-col rounded-lg p-5${contentClassName ? ` ${contentClassName}` : ''}`
  const headerWrapperClass = `flex items-start justify-between${headerClassName ? ` ${headerClassName}` : ''}`

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth, background }}
        className={innerClass}
      >
        {header !== undefined && (
          <div className={headerWrapperClass}>
            {header}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

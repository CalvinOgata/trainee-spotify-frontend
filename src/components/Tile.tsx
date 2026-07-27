import type { MouseEvent } from 'react'

type TileProps = {
  src: string
  alt?: string
  title: string
  subtitle?: string
  shape: 'square' | 'circle'
  onClick?: () => void
  onContextMenu?: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  width?: string
  height?: string
  gap?: string
}

export function Tile({
  src,
  alt = '',
  title,
  subtitle,
  shape,
  onClick,
  onContextMenu,
  className,
  width = '132px',
  height = '172px',
  gap = 'gap-2',
}: TileProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[2px]'
  const buttonClass = `flex shrink-0 flex-col text-left ${gap}${className ? ` ${className}` : ''}`
  const style = { width, ...(height !== 'auto' ? { height } : {}) }

  return (
    <button onClick={onClick} onContextMenu={onContextMenu} style={style} className={buttonClass}>
      <img src={src} alt={alt} className={`h-[132px] w-[132px] ${shapeClass} object-cover`} />
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold leading-tight text-white">{title}</p>
        {subtitle && (
          <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">{subtitle}</p>
        )}
      </div>
    </button>
  )
}

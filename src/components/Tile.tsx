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
      <div className="flex min-w-0 flex-col gap-[5px]">
        <p className="truncate font-[Inter] text-[12px] font-medium leading-tight text-white">{title}</p>
        {subtitle && (
          <p className="truncate font-[Inter] text-[10px] font-medium leading-tight text-[#B3B3B3]">{subtitle}</p>
        )}
      </div>
    </button>
  )
}

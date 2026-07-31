import type { MouseEvent } from 'react'
import playButtonLarge from '../../assets/icons/PlayButtonLarge.svg'

type TileProps = {
  src: string
  alt?: string
  title: string
  subtitle?: string
  shape: 'square' | 'circle'
  onClick?: () => void
  onPlay?: () => void
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
  onPlay,
  onContextMenu,
  className,
  width,
  height,
  gap = 'gap-1 md:gap-2',
}: TileProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[2px]'
  const buttonClass = `group flex shrink-0 flex-col text-left w-[60px] md:w-[132px] ${gap}${className ? ` ${className}` : ''}`
  const style = { ...(width ? { width } : {}), ...(height && height !== 'auto' ? { height } : {}) }

  return (
    <button onClick={onClick} onContextMenu={onContextMenu} style={style} className={buttonClass}>
      <div className="relative h-[60px] w-[60px] md:h-[132px] md:w-[132px]">
        <img src={src} alt={alt} className={`h-[60px] w-[60px] md:h-[132px] md:w-[132px] ${shapeClass} object-cover`} />
        {onPlay && (
          <span
            aria-label="Reproduzir"
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
            className="absolute bottom-0 right-0 hidden translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 md:inline-block"
          >
            <img src={playButtonLarge} alt="" className="h-[54px] w-[54px]" />
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-[3px] md:gap-[5px]">
        <p className="line-clamp-2 break-words text-center font-[Inter] text-[11px] font-medium leading-tight text-white md:line-clamp-none md:truncate md:text-left md:text-[12px]">{title}</p>
        {subtitle && (
          <p className="hidden truncate font-[Inter] text-[9px] font-medium leading-tight text-[#B3B3B3] md:block md:text-[10px]">{subtitle}</p>
        )}
      </div>
    </button>
  )
}

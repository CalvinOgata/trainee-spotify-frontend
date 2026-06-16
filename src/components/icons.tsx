export const Spotify = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-white">
    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2.1-10.4-1.1a.75.75 0 1 1-.35-1.46c4.5-1.1 8.4-.7 11.5 1.2.36.22.47.7.25 1.1Zm1.5-3.3a.94.94 0 0 1-1.3.3c-3.2-2-8.1-2.6-11.9-1.4a.94.94 0 1 1-.55-1.8c4.4-1.35 9.8-.7 13.5 1.6.45.27.6.86.3 1.3Zm.13-3.4C15.3 8.4 8.6 8.2 5 9.3a1.12 1.12 0 1 1-.65-2.15C8.5 5.9 16 6.1 20.4 8.7a1.12 1.12 0 1 1-1.16 1.9Z" />
  </svg>
)

type IconProps = { className?: string; strokeWidth?: number }

export const Home = ({ className = 'h-5 w-5', strokeWidth = 2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M3 11 12 3l9 8v10h-6v-7H9v7H3z" />
  </svg>
)

export const Search = ({ className = 'h-4 w-4', strokeWidth = 2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const X = ({ className = 'h-4 w-4', strokeWidth = 2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Bell = ({ className = 'h-5 w-5', strokeWidth = 2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
)

export const Download = ({ className = 'h-3 w-3', strokeWidth = 2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
    <path d="M12 4v11m0 0-5-5m5 5 5-5" />
    <path d="M4 20h16" />
  </svg>
)

export const Dots = () => (
  <span className="text-neutral-400 text-lg leading-none">···</span>
)

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-neutral-400">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

export const Verified = () => (
  <svg viewBox="0 0 24 24" fill="#3b82f6" className="h-4 w-4">
    <path d="M12 1.5 14 3l2.5-.3.7 2.4 2.4.7-.3 2.5 1.5 2-1.5 2 .3 2.5-2.4.7-.7 2.4-2.5-.3L12 19l-2-1.5-2.5.3-.7-2.4-2.4-.7.3-2.5L3 10l1.5-2-.3-2.5 2.4-.7.7-2.4L9.8 3 12 1.5Z" />
    <path d="m8 11 3 3 5-5" stroke="white" strokeWidth="2" fill="none" />
  </svg>
)

export const Play = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
)

export const Prev = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M6 4h2v16H6zM20 4 9 12l11 8z" />
  </svg>
)

export const Next = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M16 4h2v16h-2zM4 4l11 8L4 20z" />
  </svg>
)

export const Volume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M3 9h4l5-4v14l-5-4H3z" />
    <path d="M16 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
)

import { useRef, useState } from 'react'
import artistAboutCover from '../assets/images/artist_about.png'
import songCover from '../assets/images/song_default.png'
import followingButton from '../assets/icons/FollowingButton.svg'
import iconButtons from '../assets/icons/IconButtons.svg'
import CreditsModal from './CreditsModal'
import { Verified } from './icons'
import { resolveImageUrl } from '../lib/api'
import { usePlayer } from '../lib/PlayerContext'
import { useAutoHideScrollbar } from '../lib/useAutoHideScrollbar'
import { formatPlays } from '../lib/format'

const composers = [
  { name: 'WOOJIN of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'LOUIS of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'RYUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'Mehti', role: 'Autores' },
  { name: 'Eric Minz', role: 'Autores • Letrista' },
]

function SongPanel() {
  const [creditsOpen, setCreditsOpen] = useState(false)
  const { current, currentArtist } = usePlayer()
  const ref = useRef<HTMLElement>(null)
  useAutoHideScrollbar(ref)

  if (!current) return null

  const title = current.title
  const subtitle = currentArtist?.name ?? 'Artista'

  return (
    <>
      <aside
        ref={ref}
        className="scroll-auto-hide hidden h-full w-[315px] shrink-0 flex-col overflow-y-auto rounded-lg bg-[#121212] xl:flex"
      >
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-white">you know</h2>
          <button aria-label="Mais opções">
            <img src={iconButtons} alt="" className="h-6 w-6" />
          </button>
        </div>
        <img src={resolveImageUrl(current.imageUrl) ?? songCover} alt="" className="aspect-square w-full object-cover" />
        <div className="px-3 pt-3 pb-3">
          <p className="font-[Inter] text-lg font-extrabold text-white">{title}</p>
          <p className="font-[Inter] text-sm font-semibold text-neutral-400">{subtitle}</p>
        </div>

        <div className="mx-3 mb-3 flex h-[303px] w-[291px] flex-col overflow-hidden rounded-lg bg-neutral-900">
          <div className="relative h-[180px] w-full shrink-0">
            <img
              src={resolveImageUrl(currentArtist?.imageUrl) ?? artistAboutCover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <p className="font-[Inter] absolute top-3 left-3 text-sm font-bold text-white">Sobre o artista</p>
          </div>
          <div className="flex flex-col gap-2 p-3">
            <div className="flex items-center gap-1">
              <p className="font-[Inter] text-base font-bold text-white">{currentArtist?.name ?? '—'}</p>
              <Verified />
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="font-[Inter] text-xs font-medium text-white">
                {currentArtist ? `${formatPlays(currentArtist.listeners)} ouvintes mensais` : ''}
              </p>
              <button aria-label="Deixar de seguir" className="shrink-0">
                <img src={followingButton} alt="" className="h-6 w-[104px]" />
              </button>
            </div>
            <p className="font-[Inter] line-clamp-3 text-xs font-medium text-neutral-400">
              {currentArtist?.about ?? ''}
            </p>
          </div>
        </div>

        <div className="mx-3 mb-3 flex h-[168px] w-[291px] flex-col gap-3 rounded-lg bg-neutral-900 p-3">
          <div className="flex items-center justify-between">
            <p className="font-[Inter] text-xs font-bold text-white">Créditos</p>
            <button
              onClick={() => setCreditsOpen(true)}
              className="font-[Inter] text-[10px] font-bold text-[#B3B3B3] hover:text-white"
            >
              Mostrar tudo
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {currentArtist && (
              <li className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-[Inter] truncate text-xs font-medium text-white">{currentArtist.name}</p>
                  <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">Artista Principal</p>
                </div>
                <button aria-label="Deixar de seguir" className="shrink-0">
                  <img src={followingButton} alt="" className="h-6 w-[104px]" />
                </button>
              </li>
            )}
            {composers.slice(0, 2).map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-[Inter] truncate text-xs font-medium text-white">{c.name}</p>
                  <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">{c.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {creditsOpen && (
        <CreditsModal
          onClose={() => setCreditsOpen(false)}
          title={title}
          artistName={currentArtist?.name ?? '—'}
        />
      )}
    </>
  )
}

export default SongPanel

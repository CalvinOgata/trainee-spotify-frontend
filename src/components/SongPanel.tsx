import { useRef, useState } from 'react'
import artistAboutCover from '../assets/images/artist_about.png'
import songCover from '../assets/images/song_default.png'
import iconButtons from '../assets/icons/IconButtons.svg'
import CreditsModal from './CreditsModal'
import { Verified } from './icons'
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
        <img src={songCover} alt="" className="aspect-square w-full object-cover" />
        <div className="px-3 pt-3 pb-3">
          <p className="text-lg font-bold text-white">{title}</p>
          <p className="text-sm font-normal text-neutral-400">{subtitle}</p>
        </div>

        <div className="mx-3 mb-3 rounded-lg bg-neutral-900 p-3">
          <p className="mb-2 text-xs font-semibold text-neutral-300">Sobre o artista</p>
          <img src={artistAboutCover} alt="" className="aspect-square w-full rounded object-cover" />
          <div className="mt-3 flex items-center gap-1">
            <p className="text-sm font-semibold text-white">{currentArtist?.name ?? '—'}</p>
            <Verified />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-neutral-400">
              {currentArtist ? `${formatPlays(currentArtist.listeners)} ouvintes mensais` : ''}
            </p>
            <button className="rounded-full border border-neutral-500 px-3 py-0.5 text-[10px] font-semibold text-white hover:border-white">
              Deixar de seguir
            </button>
          </div>
          <p className="mt-2 line-clamp-3 text-xs font-normal text-neutral-400">
            {currentArtist?.about ?? ''}
          </p>
        </div>

        <div className="mx-3 mb-3 rounded-lg bg-neutral-900 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-300">Créditos</p>
            <button
              onClick={() => setCreditsOpen(true)}
              className="text-[10px] text-neutral-400 hover:text-white"
            >
              Mostrar tudo
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {currentArtist && (
              <li className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{currentArtist.name}</p>
                  <p className="truncate text-[10px] font-normal text-neutral-400">Artista Principal</p>
                </div>
                <button className="shrink-0 rounded-full border border-neutral-500 px-3 py-0.5 text-[10px] font-semibold text-white hover:border-white">
                  Deixar de seguir
                </button>
              </li>
            )}
            {composers.slice(0, 2).map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{c.name}</p>
                  <p className="truncate text-[10px] font-normal text-neutral-400">{c.role}</p>
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

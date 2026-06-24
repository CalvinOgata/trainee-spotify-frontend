import { useEffect, useState } from 'react'
import artistCover from '../assets/images/artist_default.png'
import songCover from '../assets/images/song_default.png'
import { Dots, Verified, X } from './icons'

const credits = [
  { name: 'LNGSHOT', role: 'Artista Principal', follow: true },
  { name: 'WOOJIN of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'LOUIS of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
]

const fullCredits = {
  artist: { name: 'LNGSHOT', role: 'Artista Principal' },
  composers: [
    { name: 'WOOJIN of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
    { name: 'LOUIS of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
    { name: 'RYUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
    { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
    { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
    { name: 'Mehti', role: 'Autores' },
    { name: 'Eric Minz', role: 'Autores • Letrista' },
  ],
  sources: ['MORE VISION'],
}

function CreditsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-[420px] flex-col overflow-y-auto rounded-lg bg-[#282828] p-5"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Créditos</h2>
            <p className="text-sm font-semibold text-white">Never Let Go</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="mb-5">
          <h3 className="mb-3 text-base font-bold text-white">Artista</h3>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{fullCredits.artist.name}</p>
              <p className="truncate text-xs font-normal text-neutral-400">{fullCredits.artist.role}</p>
            </div>
            <button className="shrink-0 rounded-full border border-neutral-500 px-3 py-1 text-xs font-semibold text-white hover:border-white">
              Deixar de seguir
            </button>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="mb-3 text-base font-bold text-white">Composição e letra</h3>
          <ul className="flex flex-col gap-3">
            {fullCredits.composers.map((c, i) => (
              <li key={i}>
                <p className="truncate text-sm font-semibold text-white">{c.name}</p>
                <p className="truncate text-xs font-normal text-neutral-400">{c.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-base font-bold text-white">Fontes</h3>
          <p className="text-xs font-normal text-neutral-400">{fullCredits.sources.join(' • ')}</p>
        </section>
      </div>
    </div>
  )
}

function SongPanel() {
  const [creditsOpen, setCreditsOpen] = useState(false)

  return (
    <>
      <aside className="flex h-[927px] w-[315px] flex-col overflow-hidden rounded-lg bg-[#121212]">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-white">you know</h2>
          <Dots />
        </div>
        <img src={songCover} alt="" className="aspect-square w-full object-cover" />
        <div className="px-3 pt-3 pb-3">
          <p className="text-lg font-bold text-white">Never Let Go</p>
          <p className="text-sm font-normal text-neutral-400">LNGSHOT</p>
        </div>

        <div className="mx-3 mb-3 rounded-lg bg-neutral-900 p-3">
          <p className="mb-2 text-xs font-semibold text-neutral-300">Sobre o artista</p>
          <img src={artistCover} alt="" className="aspect-[4/3] w-full rounded object-cover" />
          <div className="mt-3 flex items-center gap-1">
            <p className="text-sm font-semibold text-white">LNGSHOT</p>
            <Verified />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-neutral-400">4.965.405 ouvintes mensais</p>
            <button className="rounded-full border border-neutral-500 px-3 py-0.5 text-[10px] font-semibold text-white hover:border-white">
              Deixar de seguir
            </button>
          </div>
          <p className="mt-2 line-clamp-3 text-xs font-normal text-neutral-400">
            LNGSHOT is the first boy group introduced by Jay Park, a defining figure in hiphop, R&B, and Korean pop culture, and the executive producer shaping MORE…
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
            {credits.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{c.name}</p>
                  <p className="truncate text-[10px] font-normal text-neutral-400">{c.role}</p>
                </div>
                {c.follow && (
                  <button className="shrink-0 rounded-full border border-neutral-500 px-3 py-0.5 text-[10px] font-semibold text-white hover:border-white">
                    Deixar de seguir
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {creditsOpen && <CreditsModal onClose={() => setCreditsOpen(false)} />}
    </>
  )
}

export default SongPanel

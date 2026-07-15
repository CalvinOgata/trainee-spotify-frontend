import { useEffect } from 'react'
import { X } from './icons'

const composers = [
  { name: 'WOOJIN of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'LOUIS of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'RYUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'Mehti', role: 'Autores' },
  { name: 'Eric Minz', role: 'Autores • Letrista' },
]

const sources = ['MORE VISION']

type CreditsModalProps = {
  onClose: () => void
  title: string
  artistName: string
}

function CreditsModal({ onClose, title, artistName }: CreditsModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[420px] flex-col overflow-y-auto rounded-lg bg-[#282828] p-5"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Créditos</h2>
            <p className="text-sm font-semibold text-white">{title}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="mb-5">
          <h3 className="mb-3 text-base font-bold text-white">Artista</h3>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{artistName}</p>
              <p className="truncate text-xs font-normal text-neutral-400">Artista Principal</p>
            </div>
            <button className="shrink-0 rounded-full border border-neutral-500 px-3 py-1 text-xs font-semibold text-white hover:border-white">
              Deixar de seguir
            </button>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="mb-3 text-base font-bold text-white">Composição e letra</h3>
          <ul className="flex flex-col gap-3">
            {composers.map((c, i) => (
              <li key={i}>
                <p className="truncate text-sm font-semibold text-white">{c.name}</p>
                <p className="truncate text-xs font-normal text-neutral-400">{c.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-base font-bold text-white">Fontes</h3>
          <p className="text-xs font-normal text-neutral-400">{sources.join(' • ')}</p>
        </section>
      </div>
    </div>
  )
}

export default CreditsModal

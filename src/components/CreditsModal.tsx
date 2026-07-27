import { ModalShell } from './ModalShell'

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
  return (
    <ModalShell
      onClose={onClose}
      header={
        <div>
          <h2 className="text-lg font-bold text-white">Créditos</h2>
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
      }
      headerClassName="mb-4"
      contentClassName="max-h-[85vh] overflow-y-auto"
    >
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
    </ModalShell>
  )
}

export default CreditsModal

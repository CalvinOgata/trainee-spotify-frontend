import FollowButton from '../ui/FollowButton'
import { ModalShell } from './ModalShell'
import type { Artist } from '../../lib/api/types'

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
  artist: Artist | null
}

function CreditsModal({ onClose, title, artist }: CreditsModalProps) {
  return (
    <ModalShell
      onClose={onClose}
      background="#121212"
      maxWidth="331px"
      header={
        <div>
          <h2 className="font-[Inter] text-[18px] font-bold text-white">Créditos</h2>
          <p className="font-[Inter] text-[12px] font-bold text-white">{title}</p>
        </div>
      }
      headerClassName="mb-4"
      contentClassName="!px-8 !py-4 h-[542px]"
    >
      <section className="mb-5 flex flex-col gap-3">
        <h3 className="font-[Inter] text-[16px] font-bold text-white">Artista</h3>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-[Inter] text-[12px] font-medium text-white">{artist?.name ?? '—'}</p>
            <p className="truncate font-[Inter] text-[10px] font-medium text-[#B3B3B3]">Artista Principal</p>
          </div>
          {artist && <FollowButton artist={artist} />}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 font-[Inter] text-[16px] font-bold text-white">Composição e letra</h3>
        <ul className="flex flex-col gap-2">
          {composers.map((c, i) => (
            <li key={i}>
              <p className="truncate font-[Inter] text-[12px] font-medium text-white">{c.name}</p>
              <p className="truncate font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{c.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-1 font-[Inter] text-[12px] font-bold text-white">Fontes</h3>
        <p className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{sources.join(' • ')}</p>
      </section>
    </ModalShell>
  )
}

export default CreditsModal

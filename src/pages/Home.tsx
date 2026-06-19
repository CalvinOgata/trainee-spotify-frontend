import { useState } from 'react'

const filters = ['Tudo', 'Música', 'Playlists'] as const
type Filter = (typeof filters)[number]

const recentItems = Array.from({ length: 8 }, () => ({ title: 'follow the beat (or die trying)' }))
const playlists = Array.from({ length: 7 }, () => ({ title: 'you know', sub: 'Playlist • Vitoria Tenorio' }))
const artists = Array.from({ length: 9 }, () => ({ name: 'aespa', role: 'Artista' }))
const albums = Array.from({ length: 7 }, () => ({ title: 'Hurry Up Tomorrow', sub: '2025 • Album' }))

type HomeProps = { onArtistClick: () => void }

function Home({ onArtistClick }: HomeProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('Tudo')

  return (
    <div className="flex h-full flex-col gap-5">
      <section className="flex flex-col gap-3">
        <div className="flex gap-2.5">
          {filters.map((label) => {
            const active = label === activeFilter
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`flex h-8 w-14 items-center justify-center overflow-hidden whitespace-nowrap rounded-2xl p-2.5 text-[10px] font-semibold leading-none ${
                  active ? 'bg-white text-black' : 'bg-[#343333] text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-[repeat(4,295px)] justify-between gap-y-2">
          {recentItems.map((item, i) => (
            <button
              key={i}
              className="flex h-[60px] w-[295px] items-center gap-2.5 overflow-hidden rounded-[4px] bg-[#2D2D2D] pr-3 text-left hover:brightness-110"
            >
              <div className="h-[60px] w-[60px] shrink-0 bg-neutral-700" />
              <span className="truncate text-sm font-semibold text-white">{item.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-white">Suas Playlists</h3>
        <div className="flex gap-3">
          {playlists.map((p, i) => (
            <div key={i} className="flex h-[172px] w-[132px] flex-col gap-2">
              <div className="h-[132px] w-[132px] rounded-[2px] bg-neutral-700" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{p.title}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Artistas recentes</h3>
          <button className="text-xs font-semibold text-neutral-400 hover:text-white">Mostrar tudo</button>
        </div>
        <div className="flex gap-3">
          {artists.map((a, i) => (
            <button
              key={i}
              onClick={onArtistClick}
              className="flex h-[172px] w-[132px] flex-col gap-2 text-left"
            >
              <div className="h-[132px] w-[132px] rounded-full bg-neutral-700" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{a.name}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">{a.role}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-white">Álbuns recentes</h3>
        <div className="flex gap-3">
          {albums.map((a, i) => (
            <div key={i} className="flex w-[140px] flex-col gap-1.5 rounded-[4px] p-1">
              <div className="h-[132px] w-[132px] rounded-[2px] bg-neutral-700" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{a.title}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">{a.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

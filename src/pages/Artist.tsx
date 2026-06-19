import { Verified } from '../components/icons'

const popularTracks = Array.from({ length: 5 }, () => ({
  title: 'Starboy',
  plays: '4.536.796.459',
  duration: '3:50',
  explicit: true,
}))

const discography = Array.from({ length: 9 }, () => ({
  title: 'Hurry Up Tomorrow',
  year: '2025 • Álbum',
}))

const PlayArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const GreenCheck = () => (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
    <circle cx="8" cy="8" r="8" fill="#1FDF64" />
    <path d="M4.5 8.2 7 10.5l4.5-5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Artist() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="-mx-5 -mt-6 relative flex h-[250px] items-end bg-neutral-700">
        <div className="p-6">
          <h1 className="text-6xl font-bold leading-none text-white">The Weeknd</h1>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-normal text-white">
            <Verified />
            Verified by Spotify
          </p>
          <p className="mt-1 text-xs font-normal text-white">115.716.453 ouvintes mensais</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
          aria-label="Reproduzir"
        >
          <PlayArrow />
        </button>
        <button className="rounded-full border border-neutral-400 px-5 py-1 text-sm font-semibold text-white hover:border-white">
          Seguir
        </button>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-bold text-white">Populares</h2>
        <ul className="flex flex-col">
          {popularTracks.map((t, i) => (
            <li
              key={i}
              className="grid grid-cols-[24px_40px_1fr_160px_40px] items-center gap-4 rounded px-2 py-1 hover:bg-white/5"
            >
              <span className="text-xs font-normal text-neutral-400">{i + 1}</span>
              <div className="h-10 w-10 rounded bg-neutral-700" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-xs font-semibold leading-tight text-white">{t.title}</p>
                {t.explicit && (
                  <span className="inline-grid h-3 w-3 place-items-center rounded-sm bg-neutral-500 text-[8px] font-bold leading-none text-black">
                    E
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 text-xs font-normal text-neutral-400">
                <span>{t.plays}</span>
                <GreenCheck />
              </div>
              <span className="text-right text-xs font-normal text-neutral-400">{t.duration}</span>
            </li>
          ))}
        </ul>
        <button className="self-start text-xs font-semibold text-neutral-400 hover:text-white">
          Mostrar tudo
        </button>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Discografia</h2>
          <button className="text-xs font-semibold text-neutral-400 hover:text-white">Mostrar tudo</button>
        </div>
        <div className="flex gap-3">
          {discography.map((d, i) => (
            <div key={i} className="flex w-[125px] shrink-0 flex-col gap-2">
              <div className="h-[125px] w-[125px] rounded bg-neutral-700" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{d.title}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">{d.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Artist

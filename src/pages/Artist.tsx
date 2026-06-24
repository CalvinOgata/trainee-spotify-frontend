import albumCover from '../assets/images/album_default.png'
import artistBanner from '../assets/images/artist_banner.png'
import songCover from '../assets/images/song_default.png'
import { Verified } from '../components/icons'
import { useApi } from '../lib/useApi'
import { getArtistAlbums, getArtistPopularMusics } from '../lib/endpoints'
import { formatDuration, formatPlays } from '../lib/format'
import type { Artist as ArtistDTO } from '../lib/types'

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

type ArtistProps = { artist: ArtistDTO }

function Artist({ artist }: ArtistProps) {
  const { data: popular } = useApi(() => getArtistPopularMusics(artist.id), [artist.id])
  const { data: albums } = useApi(() => getArtistAlbums(artist.id), [artist.id])

  const popularTracks = popular ?? []
  const discography = albums ?? []

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        className="-mx-5 -mt-6 flex h-[280px] flex-col justify-end bg-cover bg-center px-5 pt-10 pb-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(65, 65, 65, 0) 0%, rgba(0, 0, 0, 0.4) 100%), url(${artistBanner})`,
        }}
      >
        <h1 className="text-7xl font-bold leading-none text-white">{artist.name}</h1>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-normal text-white">
          <Verified />
          Verified by Spotify
        </p>
        <p className="mt-1 text-xs font-normal text-white">
          {formatPlays(artist.listeners)} ouvintes mensais
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
          aria-label="Reproduzir"
        >
          <PlayArrow />
        </button>
        <button className="rounded-full border border-neutral-400 px-4 py-1 text-xs font-semibold text-white hover:border-white">
          Seguir
        </button>
      </div>

      <section className="flex w-[457px] flex-col gap-2.5">
        <h2 className="text-base font-bold leading-tight text-white">Populares</h2>
        <ul className="flex flex-col gap-2.5">
          {popularTracks.map((t, i) => (
            <li
              key={t.id}
              className="grid h-9 w-[455px] grid-cols-[12px_36px_1fr_auto_auto_auto] items-center gap-2.5"
            >
              <span className="text-xs font-normal text-neutral-400">{i + 1}</span>
              <img src={songCover} alt="" className="h-9 w-9 rounded object-cover" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-xs font-semibold leading-none text-white">{t.title}</p>
                {t.explicit && (
                  <span className="inline-grid h-3 w-3 place-items-center rounded-sm bg-neutral-500 text-[8px] font-bold leading-none text-black">
                    E
                  </span>
                )}
              </div>
              <span className="text-xs font-normal text-neutral-400">{formatPlays(t.timesListen)}</span>
              <GreenCheck />
              <span className="text-xs font-normal text-neutral-400">{formatDuration(t.duration)}</span>
            </li>
          ))}
        </ul>
        <button className="self-start text-xs font-semibold text-neutral-400 hover:text-white">
          Mostrar tudo
        </button>
      </section>

      <section className="flex w-[1140px] flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold leading-tight text-white">Discografia</h2>
          <button className="text-xs font-semibold text-neutral-400 hover:text-white">Mostrar tudo</button>
        </div>
        <div className="flex gap-3">
          {discography.map((d) => (
            <div key={d.id} className="flex h-[172px] w-[132px] flex-col gap-2">
              <img src={albumCover} alt="" className="h-[132px] w-[132px] rounded object-cover" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{d.title}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">
                  {d.year ? `${d.year} • Álbum` : 'Álbum'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Artist

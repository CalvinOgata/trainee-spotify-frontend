import { useApi } from '../lib/useApi'
import {
  getFollowers,
  getMostPlayedArtists,
  getMostPlayedMusics,
  getUserPlaylists,
} from '../lib/endpoints'
import { formatDuration, formatPlays } from '../lib/format'
import type { Artist } from '../lib/types'

type ProfileProps = { onArtistClick: (artist: Artist) => void }

function Profile({ onArtistClick }: ProfileProps) {
  const { data: playlists } = useApi(getUserPlaylists)
  const { data: followers } = useApi(getFollowers)
  const { data: topArtists } = useApi(getMostPlayedArtists)
  const { data: topMusics } = useApi(getMostPlayedMusics)

  const playlistCount = playlists?.length ?? 0
  const followerCount = followers?.length ?? 0
  const artistTiles = (topArtists ?? []).slice(0, 3)
  const musicRows = (topMusics ?? []).slice(0, 4)
  const playlistTiles = (playlists ?? []).slice(0, 7)

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="-mx-5 -mt-6 flex items-end gap-2.5 bg-gradient-to-b from-[#938D8E] to-[#3E3939] pt-10 pr-5 pb-4 pl-5">
        <div className="h-[175px] w-[175px] shrink-0 rounded-full bg-neutral-700" />
        <div className="flex min-w-0 flex-col pb-2">
          <p className="text-xs font-semibold leading-none text-white">Perfil</p>
          <h1 className="mt-2 truncate text-7xl font-bold leading-none text-white">Vitoria Tenorio</h1>
          <p className="mt-3 text-xs font-normal leading-none text-white">
            {playlistCount} playlists públicas • {followerCount} seguidores • 2 seguindo
          </p>
        </div>
      </div>

      <section className="flex w-[420px] flex-col gap-2.5">
        <div>
          <h2 className="text-base font-bold leading-tight text-white">Artistas mais tocados este mês</h2>
          <p className="text-xs font-normal leading-tight text-neutral-400">Visíveis apenas para você</p>
        </div>
        <div className="flex gap-3">
          {artistTiles.map((a) => (
            <button
              key={a.id}
              onClick={() => onArtistClick(a)}
              className="flex h-[172px] w-[132px] flex-col gap-2 text-left"
            >
              <div className="h-[132px] w-[132px] rounded-full bg-neutral-700" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{a.name}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">Artista</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex w-[457px] flex-col gap-2.5">
        <div>
          <h2 className="text-base font-bold leading-tight text-white">Músicas mais tocadas este mês</h2>
          <p className="text-xs font-normal leading-tight text-neutral-400">Visíveis apenas para você</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {musicRows.map((t, i) => (
            <li
              key={t.id}
              className="grid h-9 w-[455px] grid-cols-[12px_36px_1fr_auto_auto] items-center gap-2.5"
            >
              <span className="text-xs font-normal text-neutral-400">{i + 1}</span>
              <div className="h-9 w-9 rounded bg-neutral-700" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-xs font-semibold leading-none text-white">{t.title}</p>
                {t.explicit && (
                  <span className="inline-grid h-3 w-3 place-items-center rounded-sm bg-neutral-500 text-[8px] font-bold leading-none text-black">
                    E
                  </span>
                )}
              </div>
              <span className="text-xs font-normal text-neutral-400">{formatPlays(t.timesListen)}</span>
              <span className="text-xs font-normal text-neutral-400">{formatDuration(t.duration)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex w-[996px] flex-col gap-2.5">
        <h2 className="text-base font-bold leading-tight text-white">Playlists públicas</h2>
        <div className="flex gap-3">
          {playlistTiles.map((p) => (
            <div key={p.id} className="flex h-[172px] w-[132px] flex-col gap-2">
              <div className="h-[132px] w-[132px] rounded bg-neutral-700" />
              <p className="truncate text-xs font-semibold text-white">{p.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Profile

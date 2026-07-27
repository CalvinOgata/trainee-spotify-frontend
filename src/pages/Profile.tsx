import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import profilePhoto from '../assets/images/profile_default.png'
import songCover from '../assets/images/song_default.png'
import { Tile } from '../components/Tile'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../lib/PlaylistContextMenuContext'
import {
  getFollowers,
  getMostPlayedArtists,
  getMostPlayedMusics,
  getUserPlaylists,
} from '../lib/endpoints'
import { formatDuration, formatPlays } from '../lib/format'
import type { Artist, PlaylistSummary } from '../lib/types'

type ProfileProps = {
  onArtistClick: (artist: Artist) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
}

const carouselClass =
  'flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible'

function Profile({ onArtistClick, onPlaylistClick }: ProfileProps) {
  const { data: playlists } = useApi(getUserPlaylists)
  const { data: followers } = useApi(getFollowers)
  const { data: topArtists } = useApi(getMostPlayedArtists)
  const { data: topMusics } = useApi(getMostPlayedMusics)
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openArtistMenu } = useArtistContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()

  const playlistCount = playlists?.length ?? 0
  const followerCount = followers?.length ?? 0
  const artistTiles = (topArtists ?? []).slice(0, 5)
  const musicRows = (topMusics ?? []).slice(0, 4)
  const playlistTiles = (playlists ?? []).slice(0, 7)
  const followerTiles = (followers ?? []).slice(0, 8)

  const artistById = new Map((topArtists ?? []).map((a) => [a.id, a]))

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="-mx-5 -mt-6 flex items-end gap-3 bg-gradient-to-b from-[#938D8E] to-[#3E3939] pt-6 pr-5 pb-4 pl-5 md:gap-2.5 md:pt-10">
        <img
          src={profilePhoto}
          alt=""
          className="h-[72px] w-[72px] shrink-0 rounded-full object-cover md:h-[175px] md:w-[175px]"
        />
        <div className="flex min-w-0 flex-col pb-2">
          <p className="text-xs font-semibold leading-none text-white">Perfil</p>
          <h1 className="mt-2 truncate text-2xl font-bold leading-none text-white sm:text-5xl lg:text-7xl">
            Vitoria Tenorio
          </h1>
          <p className="mt-2 text-[11px] font-normal leading-tight text-white md:mt-3 md:text-xs md:leading-none">
            {playlistCount} playlists públicas • {followerCount} seguidores • 2 seguindo
          </p>
        </div>
      </div>

      <section className="flex w-full max-w-[420px] flex-col gap-2.5">
        <div>
          <h2 className="text-base font-bold leading-tight text-white">Artistas mais tocados este mês</h2>
          <p className="text-xs font-normal leading-tight text-neutral-400">Visíveis apenas para você</p>
        </div>
        <div className={carouselClass}>
          {artistTiles.map((a) => (
            <Tile
              key={a.id}
              src={resolveImageUrl(a.imageUrl) ?? artistCover}
              title={a.name}
              subtitle="Artista"
              shape="circle"
              onClick={() => onArtistClick(a)}
              onContextMenu={(e) => openArtistMenu(e, a)}
            />
          ))}
        </div>
      </section>

      <section className="flex w-full max-w-[457px] flex-col gap-2.5">
        <div>
          <h2 className="text-base font-bold leading-tight text-white">Músicas mais tocadas este mês</h2>
          <p className="text-xs font-normal leading-tight text-neutral-400">Visíveis apenas para você</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {musicRows.map((t, i) => (
            <li
              key={t.id}
              onClick={() =>
                play(t, {
                  artist: artistById.get(t.artistId),
                  source: { kind: 'music', album: null },
                })
              }
              onContextMenu={(e) =>
                openSongMenu(e, {
                  music: t,
                  artist: artistById.get(t.artistId) ?? null,
                  album: null,
                })
              }
              className="grid h-9 w-full cursor-pointer grid-cols-[12px_36px_minmax(0,1fr)_auto_auto] items-center gap-2.5 hover:bg-neutral-900"
            >
              <span className="text-xs font-normal text-neutral-400">{i + 1}</span>
              <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-9 w-9 rounded object-cover" />
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

      <section className="flex w-full flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold leading-tight text-white">Playlists públicas</h2>
          <button className="text-xs font-semibold text-neutral-400 hover:text-white">Mostrar tudo</button>
        </div>
        <div className={carouselClass}>
          {playlistTiles.map((p) => (
            <Tile
              key={p.id}
              src={resolveImageUrl(p.imageUrl) ?? (p.name === 'Músicas Curtidas' ? favoritesCover : playlistCover)}
              title={p.name}
              shape="square"
              onClick={() => onPlaylistClick(p)}
              onContextMenu={(e) => openPlaylistMenu(e, p)}
            />
          ))}
        </div>
      </section>

      {followerTiles.length > 0 && (
        <section className="flex w-full flex-col gap-2.5">
          <h2 className="text-base font-bold leading-tight text-white">Seguidores</h2>
          <div className={carouselClass}>
            {followerTiles.map((name, i) => (
              <div key={`${name}-${i}`} className="flex w-[100px] shrink-0 flex-col items-center gap-2">
                <img src={profilePhoto} alt="" className="h-[80px] w-[80px] rounded-full object-cover" />
                <p className="truncate text-xs font-semibold leading-tight text-white">{name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex w-full flex-col gap-2.5">
        <h2 className="text-base font-bold leading-tight text-white">Seguindo</h2>
        <div className={carouselClass}>
          <div className="flex w-[100px] shrink-0 flex-col items-center gap-2">
            <img src={profilePhoto} alt="" className="h-[80px] w-[80px] rounded-full object-cover" />
            <p className="truncate text-xs font-semibold leading-tight text-white">Pessoa</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile

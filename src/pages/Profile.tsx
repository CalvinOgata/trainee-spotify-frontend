import { useMemo } from 'react'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import profilePhoto from '../assets/images/profile_default.png'
import songCover from '../assets/images/song_default.png'
import armstrongPhoto from '../assets/images/Armstrong.jpg'
import capPhoto from '../assets/images/Cap.png'
import jaxPhoto from '../assets/images/Jax.png'
import kirbyPhoto from '../assets/images/Kirby.jpg'
import serjaoPhoto from '../assets/images/Serjao.jpg'
import wandererPhoto from '../assets/images/Wanderer.jpg'
import explicitIcon from '../assets/icons/Explicit.svg'
import { Tile } from '../components/ui/Tile'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../lib/PlaylistContextMenuContext'
import { useLibrary } from '../lib/LibraryContext'
import {
  getArtistPopularMusics,
  getFollowedArtists,
  getFollowers,
  getMostPlayedArtists,
  getMostPlayedMusics,
  getPlaylist,
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

const userPhotos = [armstrongPhoto, capPhoto, jaxPhoto, kirbyPhoto, serjaoPhoto, wandererPhoto]

function Profile({ onArtistClick, onPlaylistClick }: ProfileProps) {
  const { data: playlists } = useApi(getUserPlaylists)
  const { data: followers } = useApi(getFollowers)
  const { data: following } = useApi(getFollowedArtists)
  const { data: topArtists } = useApi(getMostPlayedArtists)
  const { data: topMusics } = useApi(getMostPlayedMusics)
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openArtistMenu } = useArtistContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { isPlaylistPrivate } = useLibrary()

  const publicPlaylists = (playlists ?? []).filter((p) => !isPlaylistPrivate(p.id))
  const playlistCount = publicPlaylists.length
  const followerCount = followers?.length ?? 0
  const followingCount = following?.length ?? 0
  const artistTiles = useMemo(() => {
    const arr = [...(topArtists ?? [])]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, 3)
  }, [topArtists])
  const musicRows = (topMusics ?? []).slice(0, 4)
  const playlistTiles = publicPlaylists.slice(0, 7)
  const followerTiles = (followers ?? []).slice(0, 8)

  const artistById = new Map((topArtists ?? []).map((a) => [a.id, a]))

  const handlePlayPlaylist = async (p: PlaylistSummary) => {
    const full = await getPlaylist(p.id)
    if (full.musics.length === 0) return
    const first = full.musics[0]
    play(first, {
      artist: artistById.get(first.artistId),
      queue: full.musics,
      source: { kind: 'playlist', playlist: p },
      promote: 'source',
    })
  }

  const handlePlayArtist = async (a: Artist) => {
    const popular = await getArtistPopularMusics(a.id)
    if (popular.length === 0) return
    play(popular[0], {
      artist: a,
      queue: popular,
      promote: 'artist',
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="-mx-5 -mt-6 flex h-[231px] items-end gap-3 bg-gradient-to-b from-[#938D8E] to-[#3E3939] px-5 pt-10 pb-4">
        <img
          src={profilePhoto}
          alt=""
          className="h-[175px] w-[175px] shrink-0 rounded-full object-cover shadow-[0_12px_22.2px_0_rgba(0,0,0,0.25)]"
        />
        <div className="flex min-w-0 flex-col gap-[10px] pb-2">
          <p className="font-[Inter] text-[10px] font-medium leading-none text-white">Perfil</p>
          <h1 className="truncate font-[Inter] text-[64px] font-black leading-none text-white">
            Vitoria Tenorio
          </h1>
          <p className="font-[Inter] text-[10px] font-medium leading-none text-[#B3B3B3]">
            {playlistCount} playlists públicas • {followerCount} seguidores • {followingCount} seguindo
          </p>
        </div>
      </div>

      <section className="mt-8 flex h-[211px] w-[420px] flex-col gap-2">
        <div>
          <h2 className="font-[Inter] text-[16px] font-bold text-white">Artistas mais tocados este mês</h2>
          <p className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">Visíveis apenas para você</p>
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
              onPlay={() => handlePlayArtist(a)}
              onContextMenu={(e) => openArtistMenu(e, a)}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 flex h-[260px] w-[457px] flex-col gap-2.5">
        <div>
          <h2 className="font-[Inter] text-[16px] font-bold text-white">Músicas mais tocadas este mês</h2>
          <p className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">Visíveis apenas para você</p>
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
              className="grid h-11 w-full cursor-pointer grid-cols-[12px_36px_minmax(0,1fr)_auto_auto] items-center gap-[10px] rounded-[4px] px-2 py-1 hover:bg-neutral-900"
            >
              <span className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{i + 1}</span>
              <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-9 w-9 rounded object-cover" />
              <div className="flex min-w-0 flex-col gap-[5px]">
                <p className="truncate font-[Arial,_Helvetica,_sans-serif] text-[10px] font-bold leading-none text-white">{t.title}</p>
                {t.explicit && (
                  <img src={explicitIcon} alt="Explícito" className="h-3 w-3" />
                )}
              </div>
              <span className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{formatPlays(t.timesListen)}</span>
              <span className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{formatDuration(t.duration)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 flex flex-col gap-[10px]">
        <h2 className="font-[Inter] text-[16px] font-bold text-white">Playlists públicas</h2>
        <div className={carouselClass}>
          {playlistTiles.map((p) => (
            <Tile
              key={p.id}
              src={resolveImageUrl(p.imageUrl) ?? (p.name === 'Músicas Curtidas' ? favoritesCover : playlistCover)}
              title={p.name}
              shape="square"
              onClick={() => onPlaylistClick(p)}
              onPlay={() => handlePlayPlaylist(p)}
              onContextMenu={(e) => openPlaylistMenu(e, p)}
            />
          ))}
        </div>
      </section>

      {followerTiles.length > 0 && (
        <section className="mt-3 flex w-full flex-col gap-2.5">
          <h2 className="text-base font-bold leading-tight text-white">Seguidores</h2>
          <div className={carouselClass}>
            {followerTiles.map((name, i) => (
              <div key={`${name}-${i}`} className="flex w-[140px] shrink-0 flex-col items-center gap-2">
                <img src={userPhotos[i % userPhotos.length]} alt="" className="h-[132px] w-[132px] rounded-full object-cover" />
                <p className="w-full truncate text-center font-[Inter] text-[12px] font-medium leading-tight text-white">{name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 flex w-full flex-col gap-2.5">
        <h2 className="text-base font-bold leading-tight text-white">Seguindo</h2>
        <div className={carouselClass}>
          <div className="flex w-[140px] shrink-0 flex-col items-center gap-2">
            <img src={userPhotos[5]} alt="" className="h-[132px] w-[132px] rounded-full object-cover" />
            <p className="w-full truncate text-center font-[Inter] text-[12px] font-medium leading-tight text-white">Pessoa</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile

import { useMemo, useState } from 'react'
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
import ShowAllButton from '../components/ui/ShowAllButton'
import { Tile } from '../components/ui/Tile'
import { resolveImageUrl } from '../lib/api/client'
import { useApi } from '../lib/hooks/useApi'
import { usePlayer } from '../lib/contexts/PlayerContext'
import { useSongContextMenu } from '../lib/contexts/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/contexts/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../lib/contexts/PlaylistContextMenuContext'
import { useLibrary } from '../lib/contexts/LibraryContext'
import {
  getArtistPopularMusics,
  getFollowedArtists,
  getFollowers,
  getMostPlayedArtists,
  getMostPlayedMusics,
  getPlaylist,
  getUserPlaylists,
} from '../lib/api/endpoints'
import { formatDuration, formatPlays } from '../lib/format'
import type { Artist, PlaylistSummary } from '../lib/api/types'

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
  const [showAllPlaylists, setShowAllPlaylists] = useState(false)
  const playlistTiles = showAllPlaylists ? publicPlaylists : publicPlaylists.slice(0, 7)
  const canExpandPlaylists = publicPlaylists.length > 0
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
    <div className="flex h-full min-w-0 flex-col">
      <div className="-mx-3 -mt-4 flex min-h-[116px] min-w-[360px] shrink-0 items-end gap-3 bg-gradient-to-b from-[#938D8E] to-[#3E3939] px-3 pt-4 pb-4 md:-mx-5 md:-mt-6 md:h-[231px] md:min-h-0 md:min-w-0 md:px-5 md:pt-10">
        <img
          src={profilePhoto}
          alt=""
          className="h-[60px] w-[60px] shrink-0 rounded-full object-cover shadow-[0_12px_22.2px_0_rgba(0,0,0,0.25)] md:h-[175px] md:w-[175px]"
        />
        <div className="flex min-w-0 max-w-[calc(100vw-160px)] flex-col gap-[4px] pb-1 md:max-w-none md:gap-[10px] md:pb-2">
          <p className="font-[Inter] text-[10px] font-medium leading-none text-white">Perfil</p>
          <h1 className="truncate font-[Inter] text-[20px] font-bold leading-none text-white md:text-[64px] md:font-black">
            Vitoria Tenorio
          </h1>
          <p className="font-[Inter] text-[10px] font-medium leading-tight text-[#B3B3B3] md:leading-none">
            <span className="whitespace-nowrap">{playlistCount} playlists públicas</span>
            {' • '}
            <span className="whitespace-nowrap">{followerCount} seguidores</span>
            {' • '}
            <span className="whitespace-nowrap">{followingCount} seguindo</span>
          </p>
        </div>
      </div>

      <section className="mt-4 flex min-w-0 max-w-full flex-col gap-2 md:mt-8 md:h-[211px] md:w-[420px]">
        <div>
          <h2 className="font-[Inter] text-[12px] font-bold text-white md:text-[16px]">Artistas mais tocados este mês</h2>
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

      <section className="mt-6 flex min-w-0 max-w-full flex-col gap-2.5 md:h-[260px] md:w-[457px]">
        <div>
          <h2 className="font-[Inter] text-[12px] font-bold text-white md:text-[16px]">Músicas mais tocadas este mês</h2>
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
              className="grid h-11 w-full cursor-pointer grid-cols-[12px_40px_minmax(0,1fr)] items-center gap-[10px] rounded-[4px] px-2 py-1 hover:bg-neutral-900 md:grid-cols-[12px_36px_minmax(0,1fr)_auto_auto]"
            >
              <span className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{i + 1}</span>
              <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-10 w-10 rounded object-cover md:h-9 md:w-9" />
              <div className="flex min-w-0 flex-col gap-[5px]">
                <p className="truncate font-[Arial,_Helvetica,_sans-serif] text-[12px] font-bold leading-none text-white md:text-[10px]">{t.title}</p>
                {t.explicit && (
                  <img src={explicitIcon} alt="Explícito" className="h-[10px] w-[10px] md:h-3 md:w-3" />
                )}
              </div>
              <span className="hidden font-[Inter] text-[10px] font-medium text-[#B3B3B3] md:inline">{formatPlays(t.timesListen)}</span>
              <span className="hidden font-[Inter] text-[10px] font-medium text-[#B3B3B3] md:inline">{formatDuration(t.duration)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <h2 className="font-[Inter] text-[12px] font-bold text-white md:text-[16px]">Playlists públicas</h2>
          {canExpandPlaylists && (
            <ShowAllButton
              expanded={showAllPlaylists}
              onClick={() => setShowAllPlaylists((v) => !v)}
            />
          )}
        </div>
        <div className={showAllPlaylists ? 'flex flex-wrap gap-3' : carouselClass}>
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
          <h2 className="font-[Inter] text-[12px] font-bold leading-tight text-white md:text-base">Seguidores</h2>
          <div className={carouselClass}>
            {followerTiles.map((name, i) => (
              <div key={`${name}-${i}`} className="flex w-[60px] shrink-0 flex-col items-center gap-2 md:w-[140px]">
                <img src={userPhotos[i % userPhotos.length]} alt="" className="h-[60px] w-[60px] rounded-full object-cover md:h-[132px] md:w-[132px]" />
                <p className="line-clamp-2 w-full break-words text-center font-[Inter] text-[12px] font-medium leading-tight text-white md:line-clamp-none md:truncate">{name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 flex w-full flex-col gap-2.5">
        <h2 className="font-[Inter] text-[12px] font-bold leading-tight text-white md:text-base">Seguindo</h2>
        <div className={carouselClass}>
          <div className="flex w-[60px] shrink-0 flex-col items-center gap-2 md:w-[140px]">
            <img src={userPhotos[5]} alt="" className="h-[60px] w-[60px] rounded-full object-cover md:h-[132px] md:w-[132px]" />
            <p className="line-clamp-2 w-full break-words text-center font-[Inter] text-[12px] font-medium leading-tight text-white md:line-clamp-none md:truncate">Pessoa</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile

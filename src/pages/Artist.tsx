import { useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistBanner from '../assets/images/artist_banner.png'
import songCover from '../assets/images/song_default.png'
import verifiedIcon from '../assets/icons/artistVerified.svg'
import alreadyAddedIcon from '../assets/icons/AlreadyAdded.svg'
import explicitIcon from '../assets/icons/Explicit.svg'
import FollowButton from '../components/ui/FollowButton'
import ShowAllButton from '../components/ui/ShowAllButton'
import { Tile } from '../components/ui/Tile'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/ArtistContextMenuContext'
import { useAlbumContextMenu } from '../lib/AlbumContextMenuContext'
import { getArtist, getArtistAlbums, getArtistPopularMusics } from '../lib/endpoints'
import { formatDuration, formatPlays } from '../lib/format'
import type { Album, AlbumSummary, Artist as ArtistDTO, Music } from '../lib/types'

const PlayArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 5v14l11-7z" />
  </svg>
)

type ArtistProps = {
  artist: ArtistDTO
  onAlbumClick: (album: AlbumSummary) => void
}

function Artist({ artist: artistProp, onAlbumClick }: ArtistProps) {
  const [showAllSongs, setShowAllSongs] = useState(false)
  const { data: freshArtist } = useApi(() => getArtist(artistProp.id), [artistProp.id])
  const artist = freshArtist ?? artistProp
  const { data: popular } = useApi(() => getArtistPopularMusics(artist.id), [artist.id])
  const { data: albums } = useApi(() => getArtistAlbums(artist.id), [artist.id])
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openArtistMenu } = useArtistContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()

  const popularTracks = popular ?? []
  const discography = albums ?? []
  const albumById = new Map((albums ?? []).map((a) => [a.id, a]))

  const allSongsById = new Map<string, Music>()
  for (const a of discography) {
    for (const m of a.musics) allSongsById.set(m.id, m)
  }
  const popularIds = new Set(popularTracks.map((t) => t.id))
  const rest = Array.from(allSongsById.values())
    .filter((m) => !popularIds.has(m.id))
    .sort((a, b) => b.timesListen - a.timesListen)
  const allSongs = [...popularTracks, ...rest]
  const displayedTracks = showAllSongs ? allSongs : popularTracks
  const canExpand = allSongs.length > popularTracks.length

  const handlePlayAlbum = (a: Album) => {
    if (a.musics.length === 0) return
    const first = a.musics[0]
    play(first, {
      artist,
      queue: a.musics,
      source: { kind: 'album', album: a },
      promote: 'source',
    })
  }

  return (
    <div className="flex flex-col">
      <div
        onContextMenu={(e) => openArtistMenu(e, artist)}
        className="-mx-5 -mt-6 flex h-[386px] flex-col justify-end gap-[10px] bg-cover bg-center p-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(65, 65, 65, 0) 0%, rgba(0, 0, 0, 0.4) 100%), url(${resolveImageUrl(artist.imageUrl) ?? artistBanner})`,
        }}
      >
        <h1 className="font-[Inter] text-[64px] font-bold leading-none text-white">{artist.name}</h1>
        <p className="flex items-center gap-1.5 font-[Inter] text-[10px] font-bold text-white">
          <img src={verifiedIcon} alt="" className="h-[18px] w-[18px]" />
          Verificado pelo Spotify
        </p>
        <p className="font-[Inter] text-[10px] font-medium text-white">
          {formatPlays(artist.listeners)} ouvintes mensais
        </p>
      </div>

      <div className="mt-[10px] flex items-center gap-[10px]">
        <button
          onClick={() => {
            if (popularTracks.length === 0) return
            play(popularTracks[0], {
              artist,
              queue: popularTracks,
              promote: 'artist',
            })
          }}
          disabled={popularTracks.length === 0}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          aria-label="Reproduzir"
        >
          <PlayArrow />
        </button>
        <FollowButton artist={artist} />
      </div>

      <section className="mt-6 flex w-[524px] flex-col gap-2.5">
        <h2 className="font-[Inter] text-[16px] font-bold text-white">
          {showAllSongs ? 'Todas as músicas' : 'Populares'}
        </h2>
        <ul className="flex flex-col gap-2.5">
          {displayedTracks.map((t, i) => (
            <li
              key={t.id}
              onClick={() =>
                play(t, {
                  artist,
                  queue: displayedTracks,
                  source: { kind: 'music', album: albumById.get(t.albumId) ?? null },
                })
              }
              onContextMenu={(e) =>
                openSongMenu(e, {
                  music: t,
                  artist,
                  album: albumById.get(t.albumId) ?? null,
                })
              }
              className="grid h-11 w-full cursor-pointer grid-cols-[12px_36px_minmax(0,1fr)_auto_auto_auto] items-center gap-[10px] rounded-[4px] px-2 py-1 hover:bg-neutral-900"
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
              <img src={alreadyAddedIcon} alt="" className="h-[14px] w-[14px]" />
              <span className="font-[Inter] text-[10px] font-medium text-[#B3B3B3]">{formatDuration(t.duration)}</span>
            </li>
          ))}
        </ul>
        {(canExpand || showAllSongs) && (
          <button
            onClick={() => setShowAllSongs((v) => !v)}
            className="self-start text-xs font-semibold text-neutral-400 hover:text-white"
          >
            {showAllSongs ? 'Mostrar menos' : 'Mostrar tudo'}
          </button>
        )}
      </section>

      <section className="mt-6 flex w-full flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-[Inter] text-[16px] font-bold text-white">Discografia</h2>
          <ShowAllButton />
        </div>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {discography.map((d) => (
            <Tile
              key={d.id}
              src={resolveImageUrl(d.imageUrl) ?? albumCover}
              title={d.title}
              subtitle={d.year ? `${d.year} • Álbum` : 'Álbum'}
              shape="square"
              onClick={() => onAlbumClick(d)}
              onPlay={() => handlePlayAlbum(d)}
              onContextMenu={(e) => openAlbumMenu(e, d)}
            />
          ))}
        </div>
      </section>

      {artist.about && (
        <section className="mt-6 flex w-full max-w-[457px] flex-col gap-2.5">
          <h2 className="font-[Inter] text-[16px] font-bold text-white">Sobre</h2>
          <p className="whitespace-pre-line font-[Inter] text-xs font-medium text-neutral-400">
            {artist.about}
          </p>
        </section>
      )}
    </div>
  )
}

export default Artist

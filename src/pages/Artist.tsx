import { useEffect, useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistBanner from '../assets/images/artist_banner.png'
import songCover from '../assets/images/song_default.png'
import verifiedIcon from '../assets/icons/artistVerified.svg'
import alreadyAddedIcon from '../assets/icons/AlreadyAdded.svg'
import explicitIcon from '../assets/icons/Explicit.svg'
import FollowButton from '../components/ui/FollowButton'
import ShowAllButton from '../components/ui/ShowAllButton'
import { Tile } from '../components/ui/Tile'
import { resolveImageUrl } from '../lib/api/client'
import { useApi } from '../lib/hooks/useApi'
import { usePlayer } from '../lib/contexts/PlayerContext'
import { useSongContextMenu } from '../lib/contexts/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/contexts/ArtistContextMenuContext'
import { useAlbumContextMenu } from '../lib/contexts/AlbumContextMenuContext'
import { getArtist, getArtistAlbums, getArtistPopularMusics } from '../lib/api/endpoints'
import { formatDuration, formatPlays } from '../lib/format'
import type { Album, AlbumSummary, Artist as ArtistDTO } from '../lib/api/types'

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
  const [showAllAlbums, setShowAllAlbums] = useState(false)
  useEffect(() => {
    setShowAllSongs(false)
    setShowAllAlbums(false)
  }, [artistProp.id])
  const { data: freshArtist } = useApi(() => getArtist(artistProp.id), [artistProp.id])
  const artist = freshArtist ?? artistProp
  const { data: popular } = useApi(() => getArtistPopularMusics(artist.id, { all: true }), [artist.id])
  const { data: albums } = useApi(() => getArtistAlbums(artist.id), [artist.id])
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openArtistMenu } = useArtistContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()

  const allSongs = popular ?? []
  const discography = albums ?? []
  const albumById = new Map((albums ?? []).map((a) => [a.id, a]))

  const popularTracks = allSongs.slice(0, 5)
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
    <div className="flex min-w-0 flex-col">
      <div
        onContextMenu={(e) => openArtistMenu(e, artist)}
        className="-mx-3 -mt-4 flex min-h-[180px] min-w-[360px] shrink-0 flex-col justify-end gap-[10px] bg-cover bg-center p-4 md:-mx-5 md:-mt-6 md:h-[386px] md:min-h-0 md:min-w-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(65, 65, 65, 0) 0%, rgba(0, 0, 0, 0.4) 100%), url(${resolveImageUrl(artist.imageUrl) ?? artistBanner})`,
        }}
      >
        <h1 className="font-[Inter] truncate text-[20px] font-bold leading-none text-white md:text-[64px] md:font-black">{artist.name}</h1>
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

      <section className="mt-6 flex w-full min-w-0 max-w-[524px] flex-col gap-2.5">
        <h2 className="font-[Inter] text-[12px] font-bold text-white md:text-[16px]">
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
              className="grid h-11 w-full cursor-pointer grid-cols-[12px_40px_minmax(0,1fr)] items-center gap-[10px] rounded-[4px] px-2 py-1 hover:bg-neutral-900 md:grid-cols-[12px_36px_minmax(0,1fr)_auto_auto_auto]"
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
              <img src={alreadyAddedIcon} alt="" className="hidden h-[14px] w-[14px] md:inline" />
              <span className="hidden font-[Inter] text-[10px] font-medium text-[#B3B3B3] md:inline">{formatDuration(t.duration)}</span>
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
          <h2 className="font-[Inter] text-[12px] font-bold text-white md:text-[16px]">Discografia</h2>
          {discography.length > 0 && (
            <ShowAllButton
              expanded={showAllAlbums}
              onClick={() => setShowAllAlbums((v) => !v)}
            />
          )}
        </div>
        <div
          className={
            showAllAlbums
              ? 'flex flex-wrap gap-3'
              : 'flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible'
          }
        >
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
          <h2 className="font-[Inter] text-[12px] font-bold text-white md:text-[16px]">Sobre</h2>
          <p className="whitespace-pre-line font-[Inter] text-xs font-medium text-neutral-400">
            {artist.about}
          </p>
        </section>
      )}
    </div>
  )
}

export default Artist

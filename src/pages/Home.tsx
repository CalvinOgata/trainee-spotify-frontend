import { useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import songCover from '../assets/images/song_default.png'
import playButtonLarge from '../assets/icons/PlayButtonLarge.svg'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../lib/PlaylistContextMenuContext'
import { useAlbumContextMenu } from '../lib/AlbumContextMenuContext'
import Pill from '../components/ui/Pill'
import PlayingBars from '../components/ui/PlayingBars'
import ShowAllButton from '../components/ui/ShowAllButton'
import { Tile } from '../components/ui/Tile'
import { useTrackEntityMaps } from '../lib/EntityCacheContext'
import { useLibrary } from '../lib/LibraryContext'
import {
  getAlbumMusics,
  getArtistPopularMusics,
  getPlaylist,
  getRecentAlbums,
  getRecentArtists,
  getRecentMusics,
  getUserPlaylists,
} from '../lib/endpoints'
import type { AlbumSummary, Artist, PlaylistSummary } from '../lib/types'

const filters = ['Tudo', 'Música', 'Playlists'] as const
type Filter = (typeof filters)[number]

type HomeProps = {
  onArtistClick: (artist: Artist) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onAlbumClick: (album: AlbumSummary) => void
}

function Home({ onArtistClick, onPlaylistClick, onAlbumClick }: HomeProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('Tudo')
  const { data: recentMusics } = useApi(getRecentMusics)
  const { data: playlists } = useApi(getUserPlaylists)
  const { data: recentArtists } = useApi(getRecentArtists)
  const { data: recentAlbums } = useApi(getRecentAlbums)
  const { play, current, isPlaying, position } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openArtistMenu } = useArtistContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()
  const { isPlaylistPrivate } = useLibrary()

  const recentItems = (recentMusics ?? []).slice(0, 8)
  const playlistTiles = (playlists ?? []).slice(0, 7)
  const artistTiles = (recentArtists ?? []).slice(0, 9)
  const albumTiles = (recentAlbums ?? []).slice(0, 7)

  const showMusic = activeFilter === 'Tudo' || activeFilter === 'Música'
  const showPlaylists = activeFilter === 'Tudo' || activeFilter === 'Playlists'

  const { artistById, albumById } = useTrackEntityMaps(recentMusics, {
    seedArtists: recentArtists,
    seedAlbums: recentAlbums,
  })

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

  const handlePlayAlbum = async (a: AlbumSummary) => {
    const musics = await getAlbumMusics(a.id)
    if (musics.length === 0) return
    const first = musics[0]
    play(first, {
      artist: artistById.get(first.artistId),
      queue: musics,
      source: { kind: 'album', album: a },
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
    <div className="flex h-full flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex gap-2.5">
          {filters.map((label) => (
            <Pill key={label} active={label === activeFilter} onClick={() => setActiveFilter(label)}>
              {label}
            </Pill>
          ))}
        </div>
        {showMusic && (
        <div className="grid grid-cols-[repeat(auto-fill,295px)] gap-2">
          {recentItems.map((m) => {
            const isCurrent = current?.id === m.id && position < m.duration
            return (
              <button
                key={m.id}
                onClick={() =>
                  play(m, {
                    artist: artistById.get(m.artistId),
                    source: { kind: 'music', album: albumById.get(m.albumId) ?? null },
                  })
                }
                onContextMenu={(e) =>
                  openSongMenu(e, {
                    music: m,
                    artist: artistById.get(m.artistId) ?? null,
                    album: albumById.get(m.albumId) ?? null,
                  })
                }
                className="group flex h-[60px] w-[295px] items-center gap-2.5 overflow-hidden rounded-[4px] bg-[#2D2D2D] pr-3 text-left transition-colors hover:bg-[#5B5A5A]/60"
              >
                <img src={resolveImageUrl(m.imageUrl) ?? songCover} alt="" className="h-[60px] w-[60px] shrink-0 object-cover" />
                <span className="min-w-0 flex-1 truncate font-[Arial] text-[12px] font-bold text-white">{m.title}</span>
                {isCurrent ? (
                  <PlayingBars animate={isPlaying} className="ml-auto" />
                ) : (
                  <img
                    src={playButtonLarge}
                    alt=""
                    className="ml-auto h-[54px] w-[54px] shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                )}
              </button>
            )
          })}
        </div>
        )}
      </section>

      {showPlaylists && (
      <section className="flex flex-col gap-2">
        <h3 className="font-[Inter] text-[16px] font-bold text-white">Suas Playlists</h3>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {playlistTiles.map((p) => {
            const label = isPlaylistPrivate(p.id) ? 'Playlist particular' : 'Playlist'
            return (
              <Tile
                key={p.id}
                src={resolveImageUrl(p.imageUrl) ?? (p.name === 'Músicas Curtidas' ? favoritesCover : playlistCover)}
                title={p.name}
                subtitle={p.description ? `${label} • ${p.description}` : label}
                shape="square"
                onClick={() => onPlaylistClick(p)}
                onPlay={() => handlePlayPlaylist(p)}
                onContextMenu={(e) => openPlaylistMenu(e, p)}
              />
            )
          })}
        </div>
      </section>
      )}

      {showMusic && (
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-[Inter] text-[16px] font-bold text-white">Artistas recentes</h3>
          <ShowAllButton />
        </div>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
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
      )}

      {showMusic && (
      <section className="flex flex-col gap-2">
        <h3 className="font-[Inter] text-[16px] font-bold text-white">Álbuns recentes</h3>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {albumTiles.map((a) => (
            <Tile
              key={a.id}
              src={resolveImageUrl(a.imageUrl) ?? albumCover}
              title={a.title}
              subtitle={a.year ? `${a.year} • Álbum` : 'Álbum'}
              shape="square"
              onClick={() => onAlbumClick(a)}
              onPlay={() => handlePlayAlbum(a)}
              onContextMenu={(e) => openAlbumMenu(e, a)}
            />
          ))}
        </div>
      </section>
      )}
    </div>
  )
}

export default Home

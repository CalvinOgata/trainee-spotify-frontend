import { useEffect, useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import songCover from '../assets/images/song_default.png'
import { Dots, Plus } from '../components/icons'
import { resolveImageUrl } from '../lib/api/client'
import { useApi } from '../lib/hooks/useApi'
import { useLibrary } from '../lib/contexts/LibraryContext'
import { usePlayer } from '../lib/contexts/PlayerContext'
import { useSongContextMenu } from '../lib/contexts/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/contexts/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../lib/contexts/PlaylistContextMenuContext'
import { useAlbumContextMenu } from '../lib/contexts/AlbumContextMenuContext'
import { search } from '../lib/api/endpoints'
import type { AlbumSummary, Artist, Music, PlaylistSummary, SearchResponse } from '../lib/api/types'

function FollowInlineButton({ artist }: { artist: Artist }) {
  const { isFollowed, toggleFollowed } = useLibrary()
  const followed = isFollowed(artist.id)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFollowed(artist)
      }}
      aria-label={followed ? 'Deixar de seguir' : 'Seguir'}
      className="group flex h-6 items-center justify-center whitespace-nowrap rounded-full border border-neutral-500 px-3 font-[Inter] font-bold text-white hover:border-white"
    >
      {followed ? (
        <>
          <span className="text-[8px] group-hover:hidden">Seguindo</span>
          <span className="hidden text-[10px] group-hover:inline">Deixar de Seguir</span>
        </>
      ) : (
        <span className="text-[10px]">Seguir</span>
      )}
    </button>
  )
}

type Result =
  | { key: string; title: string; sub: string; pill: 'Música'; action: 'add'; music: Music }
  | { key: string; title: string; sub: string; pill: 'Playlist'; action: 'add'; playlist: PlaylistSummary }
  | { key: string; title: string; sub: string; pill: 'Álbum'; action: 'add'; album: AlbumSummary }
  | { key: string; title: string; sub: string; pill: 'Artista'; action: 'follow'; artist: Artist }

type SearchResultsProps = {
  query: string
  onArtistClick: (artist: Artist) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onAlbumClick: (album: AlbumSummary) => void
}

const EMPTY: SearchResponse = { musics: [], playlists: [], artists: [], albums: [], musicAlbums: [], musicArtists: [] }

function SearchResults({ query, onArtistClick, onPlaylistClick, onAlbumClick }: SearchResultsProps) {
  const [debouncedQ, setDebouncedQ] = useState(query.trim())
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  const { data: results } = useApi<SearchResponse | null>(
    () => (debouncedQ ? search(debouncedQ) : Promise.resolve(null)),
    [debouncedQ],
  )
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openArtistMenu } = useArtistContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()

  const { musics, playlists, artists, albums, musicAlbums, musicArtists } = results ?? EMPTY

  const artistById = new Map([...artists, ...musicArtists].map((a) => [a.id, a]))
  const albumById = new Map([...albums, ...musicAlbums].map((a) => [a.id, a]))

  const all: Result[] = [
    ...musics.map<Result>((m) => {
      const artistName = artistById.get(m.artistId)?.name
      return {
        key: `m-${m.id}`,
        title: m.title,
        sub: artistName ? `Música • ${artistName}` : 'Música',
        pill: 'Música',
        action: 'add',
        music: m,
      }
    }),
    ...playlists.map<Result>((p) => ({
      key: `p-${p.id}`,
      title: p.name,
      sub: p.description ? `Playlist • ${p.description}` : 'Playlist',
      pill: 'Playlist',
      action: 'add',
      playlist: p,
    })),
    ...albums.map<Result>((a) => ({
      key: `al-${a.id}`,
      title: a.title,
      sub: `Álbum • ${a.artistName}`,
      pill: 'Álbum',
      action: 'add',
      album: a,
    })),
    ...artists.map<Result>((a) => ({
      key: `ar-${a.id}`,
      title: a.name,
      sub: 'Artista',
      pill: 'Artista',
      action: 'follow',
      artist: a,
    })),
  ]

  if (!debouncedQ) {
    return (
      <p className="text-sm font-normal text-neutral-400">
        Digite algo na barra de pesquisa para começar.
      </p>
    )
  }

  if (results && all.length === 0) {
    return (
      <p className="text-sm font-normal text-neutral-400">
        Nenhum resultado para <span className="font-semibold text-white">{debouncedQ}</span>.
      </p>
    )
  }

  return (
    <ul className="flex flex-col items-center gap-2">
      {all.map((r) => {
        const remote =
          r.pill === 'Playlist' ? resolveImageUrl(r.playlist.imageUrl) :
          r.pill === 'Álbum' ? resolveImageUrl(r.album.imageUrl) :
          r.pill === 'Artista' ? resolveImageUrl(r.artist.imageUrl) :
          resolveImageUrl(r.music.imageUrl)
        const fallback =
          r.pill === 'Playlist' ? (r.title === 'Músicas Curtidas' ? favoritesCover : playlistCover) :
          r.pill === 'Álbum' ? albumCover :
          r.pill === 'Artista' ? artistCover :
          songCover
        const shape = r.pill === 'Artista' ? 'rounded-full' : 'rounded'
        const handleTitleClick = () => {
          if (r.pill === 'Artista') onArtistClick(r.artist)
          else if (r.pill === 'Playlist') onPlaylistClick(r.playlist)
          else if (r.pill === 'Álbum') onAlbumClick(r.album)
          else
            play(r.music, {
              artist: artistById.get(r.music.artistId),
              source: { kind: 'music', album: albumById.get(r.music.albumId) ?? null },
            })
        }
        return (
          <li
            key={r.key}
            onContextMenu={(e) => {
              if (r.pill === 'Música') {
                openSongMenu(e, {
                  music: r.music,
                  artist: artistById.get(r.music.artistId) ?? null,
                  album: albumById.get(r.music.albumId) ?? null,
                })
              } else if (r.pill === 'Artista') {
                openArtistMenu(e, r.artist)
              } else if (r.pill === 'Playlist') {
                openPlaylistMenu(e, r.playlist)
              } else if (r.pill === 'Álbum') {
                openAlbumMenu(e, r.album)
              }
            }}
            className="flex h-[60px] w-[948px] items-center rounded"
          >
            <div className="flex h-[60px] w-[358px] max-w-[358px] items-center gap-3">
              <img
                src={remote ?? fallback}
                alt=""
                className={`h-[60px] w-[60px] shrink-0 object-cover ${shape}`}
              />
              <div className="flex min-w-0 flex-col justify-center">
                <button
                  onClick={handleTitleClick}
                  className="truncate text-left font-[Inter] text-[16px] font-bold text-white hover:underline"
                >
                  {r.title}
                </button>
                <p className="truncate font-[Inter] text-[10px] font-bold text-[#B3B3B3]">
                  {r.sub}
                </p>
              </div>
            </div>
            <div className="w-[300px]" aria-hidden />
            <span className="flex h-[20px] w-[52px] items-center justify-center gap-[10px] rounded-[2px] bg-[#2D2D2D] px-2 py-1 font-[Inter] text-[10px] font-bold text-[#B3B3B3]">
              {r.pill}
            </span>
            <div className="ml-auto flex items-center gap-4">
              <button className="text-neutral-400 hover:text-white" aria-label="Mais opções">
                <Dots className="text-[25px]" />
              </button>
              {r.action === 'add' ? (
                <button aria-label="Adicionar">
                  <Plus className="h-[14px] w-[14px]" />
                </button>
              ) : (
                <FollowInlineButton artist={r.artist} />
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default SearchResults

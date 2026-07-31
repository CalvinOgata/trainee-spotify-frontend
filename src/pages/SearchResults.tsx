import { useEffect, useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import songCover from '../assets/images/song_default.png'
import { AlreadyAdded, Dots, Plus } from '../components/icons'
import Pill from '../components/ui/Pill'
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

type SearchFilter = 'Tudo' | 'Músicas' | 'Álbuns' | 'Artistas' | 'Playlists'
const searchFilters: SearchFilter[] = ['Tudo', 'Músicas', 'Álbuns', 'Artistas', 'Playlists']
const filterToPill: Record<Exclude<SearchFilter, 'Tudo'>, Result['pill']> = {
  Músicas: 'Música',
  Álbuns: 'Álbum',
  Artistas: 'Artista',
  Playlists: 'Playlist',
}

function SearchResults({ query, onArtistClick, onPlaylistClick, onAlbumClick }: SearchResultsProps) {
  const [debouncedQ, setDebouncedQ] = useState(query.trim())
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('Tudo')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  const { data: results } = useApi<SearchResponse | null>(
    () => (debouncedQ ? search(debouncedQ) : Promise.resolve(null)),
    [debouncedQ],
  )
  const { play } = usePlayer()
  const { isSaved, toggleSaved, isAlbumSaved, toggleAlbumSaved } = useLibrary()
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

  const filtered = activeFilter === 'Tudo' ? all : all.filter((r) => r.pill === filterToPill[activeFilter])

  if (!debouncedQ) {
    return (
      <p className="text-sm font-normal text-neutral-400">
        Digite algo na barra de pesquisa para começar.
      </p>
    )
  }

  const filters = (
    <div className="flex gap-2">
      {searchFilters.map((f) => (
        <Pill key={f} active={f === activeFilter} onClick={() => setActiveFilter(f)}>
          {f}
        </Pill>
      ))}
    </div>
  )

  if (results && all.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {filters}
        <p className="text-sm font-normal text-neutral-400">
          Nenhum resultado para <span className="font-semibold text-white">{debouncedQ}</span>.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {filters}
      {filtered.length === 0 ? (
        <p className="text-sm font-normal text-neutral-400">
          Nenhum resultado nesse filtro.
        </p>
      ) : (
        <ul className="flex flex-col items-center gap-2">
          {filtered.map((r) => {
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
        const inLibrary =
          r.pill === 'Música' ? isSaved(r.music.id) :
          r.pill === 'Álbum' ? isAlbumSaved(r.album.id) :
          false
        const handleAdd = () => {
          if (r.pill === 'Música') toggleSaved(r.music)
          else if (r.pill === 'Álbum') toggleAlbumSaved(r.album)
        }
        return (
          <li
            key={r.key}
            onClick={handleTitleClick}
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
            className="group flex h-[60px] w-full min-w-0 max-w-[948px] cursor-pointer items-center gap-2 rounded px-1 hover:bg-[#2D2D2D] md:gap-0 md:px-0"
          >
            <div className="flex h-[60px] min-w-0 flex-1 items-center gap-3 md:w-[358px] md:max-w-[358px] md:flex-none">
              <div className={`relative h-[60px] w-[60px] shrink-0 overflow-hidden ${shape}`}>
                <img src={remote ?? fallback} alt="" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/30 group-hover:flex">
                  <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex min-w-0 flex-col justify-center">
                <p className="truncate text-left font-[Inter] text-[14px] font-bold text-white md:text-[16px]">
                  {r.title}
                </p>
                <p className="truncate font-[Inter] text-[10px] font-bold text-[#B3B3B3]">
                  {r.sub}
                </p>
              </div>
            </div>
            <div className="hidden flex-1 md:block" aria-hidden />
            <span className="hidden h-[20px] w-[52px] shrink-0 items-center justify-center gap-[10px] rounded-[2px] bg-[#2D2D2D] px-2 py-1 font-[Inter] text-[10px] font-bold text-[#B3B3B3] md:flex">
              {r.pill}
            </span>
            <div className="hidden flex-1 md:block" aria-hidden />
            <div className="ml-auto flex items-center gap-4 md:ml-0">
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-neutral-400 hover:text-white"
                aria-label="Mais opções"
              >
                <Dots className="text-[25px]" />
              </button>
              {r.action === 'add' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAdd()
                  }}
                  aria-label={inLibrary ? 'Remover da biblioteca' : 'Adicionar à biblioteca'}
                >
                  {inLibrary ? (
                    <AlreadyAdded className="h-[14px] w-[14px]" />
                  ) : (
                    <Plus className="h-[14px] w-[14px]" />
                  )}
                </button>
              ) : (
                <FollowInlineButton artist={r.artist} />
              )}
            </div>
          </li>
        )
      })}
    </ul>
      )}
    </div>
  )
}

export default SearchResults

import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import songCover from '../assets/images/song_default.png'
import { Dots, Plus } from '../components/icons'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import {
  getRecentAlbums,
  getRecentArtists,
  getRecentMusics,
  getUserPlaylists,
} from '../lib/endpoints'
import type { Artist, Music, PlaylistSummary } from '../lib/types'

type Result =
  | { key: string; title: string; sub: string; pill: 'Música'; action: 'add'; music: Music }
  | { key: string; title: string; sub: string; pill: 'Playlist'; action: 'add'; playlist: PlaylistSummary }
  | { key: string; title: string; sub: string; pill: 'Álbum'; action: 'add' }
  | { key: string; title: string; sub: string; pill: 'Artista'; action: 'follow'; artist: Artist }

type SearchResultsProps = {
  query: string
  onArtistClick: (artist: Artist) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
}

function SearchResults({ query, onArtistClick, onPlaylistClick }: SearchResultsProps) {
  const { data: musics } = useApi(getRecentMusics)
  const { data: playlists } = useApi(getUserPlaylists)
  const { data: artists } = useApi(getRecentArtists)
  const { data: albums } = useApi(getRecentAlbums)
  const { play } = usePlayer()

  const artistById = new Map((artists ?? []).map((a) => [a.id, a]))

  const all: Result[] = [
    ...(musics ?? []).map<Result>((m) => ({
      key: `m-${m.id}`,
      title: m.title,
      sub: 'Música',
      pill: 'Música',
      action: 'add',
      music: m,
    })),
    ...(playlists ?? []).map<Result>((p) => ({
      key: `p-${p.id}`,
      title: p.name,
      sub: p.description ? `Playlist • ${p.description}` : 'Playlist',
      pill: 'Playlist',
      action: 'add',
      playlist: p,
    })),
    ...(albums ?? []).map<Result>((a) => ({
      key: `al-${a.id}`,
      title: a.title,
      sub: `Álbum • ${a.artistName}`,
      pill: 'Álbum',
      action: 'add',
    })),
    ...(artists ?? []).map<Result>((a) => ({
      key: `ar-${a.id}`,
      title: a.name,
      sub: 'Artista',
      pill: 'Artista',
      action: 'follow',
      artist: a,
    })),
  ]

  const q = query.trim().toLowerCase()
  const filtered = q
    ? all.filter((r) => r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q))
    : all

  return (
    <ul className="flex flex-col gap-2">
      {filtered.map((r) => (
        <li
          key={r.key}
          className="grid grid-cols-[64px_1fr_auto_auto_auto] items-center gap-4 rounded-md px-2 py-1 hover:bg-neutral-900"
        >
          {(() => {
            const src =
              r.pill === 'Playlist' ? (r.title === 'Músicas Curtidas' ? favoritesCover : playlistCover) :
              r.pill === 'Álbum' ? albumCover :
              r.pill === 'Artista' ? artistCover :
              songCover
            const shape = r.pill === 'Artista' ? 'rounded-full' : 'rounded'
            return <img src={src} alt="" className={`h-16 w-16 ${shape} object-cover`} />
          })()}
          <div className="min-w-0">
            {r.pill === 'Artista' ? (
              <button
                onClick={() => onArtistClick(r.artist)}
                className="block w-full truncate text-left text-base font-semibold text-white hover:underline"
              >
                {r.title}
              </button>
            ) : r.pill === 'Música' ? (
              <button
                onClick={() => play(r.music, { artist: artistById.get(r.music.artistId) })}
                className="block w-full truncate text-left text-base font-semibold text-white hover:underline"
              >
                {r.title}
              </button>
            ) : r.pill === 'Playlist' ? (
              <button
                onClick={() => onPlaylistClick(r.playlist)}
                className="block w-full truncate text-left text-base font-semibold text-white hover:underline"
              >
                {r.title}
              </button>
            ) : (
              <p className="truncate text-base font-semibold text-white">{r.title}</p>
            )}
            <p className="truncate text-sm font-normal text-neutral-400">{r.sub}</p>
          </div>
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-normal text-neutral-300">
            {r.pill}
          </span>
          <button className="px-2"><Dots /></button>
          {r.action === 'add' ? (
            <button><Plus /></button>
          ) : (
            <button className="rounded-full border border-neutral-500 px-4 py-1 text-xs font-semibold text-white hover:border-white">
              Seguir
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

export default SearchResults

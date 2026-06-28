import { useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import { Search } from './icons'
import Pill from './Pill'
import { useApi } from '../lib/useApi'
import {
  createPlaylist,
  getRecentAlbums,
  getRecentArtists,
  getUserPlaylists,
} from '../lib/endpoints'
import type { AlbumSummary, Artist, PlaylistSummary } from '../lib/types'

type LibraryFilter = 'Tudo' | 'Playlists' | 'Álbuns' | 'Artistas'
const filters: LibraryFilter[] = ['Tudo', 'Playlists', 'Álbuns', 'Artistas']

type Row =
  | { key: string; kind: 'playlist'; title: string; sub: string; playlist: PlaylistSummary }
  | { key: string; kind: 'album'; title: string; sub: string; album: AlbumSummary }
  | { key: string; kind: 'artist'; title: string; sub: string; artist: Artist }

type LibraryProps = {
  onArtistClick: (artist: Artist) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onAlbumClick: (album: AlbumSummary) => void
  playlistsKey: number
  onPlaylistCreated: () => void
}

const namePattern = /^Minha playlist nº (\d+)$/

function nextPlaylistName(playlists: PlaylistSummary[]): string {
  const max = playlists.reduce((acc, p) => {
    const m = p.name.match(namePattern)
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc
  }, 0)
  return `Minha playlist nº ${max + 1}`
}

function Library({ onArtistClick, onPlaylistClick, onAlbumClick, playlistsKey, onPlaylistCreated }: LibraryProps) {
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('Tudo')
  const { data: playlists } = useApi(getUserPlaylists, [playlistsKey])
  const { data: artists } = useApi(getRecentArtists)
  const { data: albums } = useApi(getRecentAlbums)

  const handleCreate = async () => {
    const name = nextPlaylistName(playlists ?? [])
    try {
      const created = await createPlaylist({ name, description: '' })
      onPlaylistCreated()
      onPlaylistClick(created)
    } catch {
      // ignore
    }
  }

  const sortedPlaylists = [...(playlists ?? [])].sort((a, b) => {
    if (a.name === 'Músicas Curtidas') return -1
    if (b.name === 'Músicas Curtidas') return 1
    return 0
  })

  const rows: Row[] = []
  if (activeFilter === 'Tudo' || activeFilter === 'Playlists') {
    for (const p of sortedPlaylists) {
      rows.push({
        key: `pl-${p.id}`,
        kind: 'playlist',
        title: p.name,
        sub: `Playlist${p.description ? ` • ${p.description}` : ''}`,
        playlist: p,
      })
    }
  }
  if (activeFilter === 'Tudo' || activeFilter === 'Artistas') {
    for (const a of artists ?? []) {
      rows.push({ key: `ar-${a.id}`, kind: 'artist', title: a.name, sub: 'Artista', artist: a })
    }
  }
  if (activeFilter === 'Tudo' || activeFilter === 'Álbuns') {
    for (const a of albums ?? []) {
      rows.push({
        key: `al-${a.id}`,
        kind: 'album',
        title: a.title,
        sub: `Álbum • ${a.artistName}`,
        album: a,
      })
    }
  }

  return (
    <aside className="flex h-[927px] w-[312px] flex-col gap-3 overflow-hidden rounded-lg bg-[#121212] pb-3">
      <div className="flex items-center justify-between px-3 pt-3">
        <h2 className="text-sm font-semibold text-white">Sua Biblioteca</h2>
        <button
          onClick={handleCreate}
          className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-white hover:bg-neutral-700"
        >
          Criar playlist
        </button>
      </div>
      <div className="flex gap-2 px-3">
        {filters.map((f) => (
          <Pill key={f} active={f === activeFilter} onClick={() => setActiveFilter(f)}>
            {f}
          </Pill>
        ))}
      </div>
      <div className="mx-3 flex h-9 items-center gap-2 rounded-md bg-neutral-900 px-3 text-neutral-400">
        <Search />
        <span className="text-xs">Buscar em Sua Biblioteca</span>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 [scrollbar-width:thin] [scrollbar-color:#4d4d4d_transparent]">
        {rows.map((row) => {
          const isArtist = row.kind === 'artist'
          const thumbClass = `h-10 w-10 shrink-0 ${isArtist ? 'rounded-full' : 'rounded'} object-cover`
          const src =
            row.kind === 'playlist' ? (row.title === 'Músicas Curtidas' ? favoritesCover : playlistCover) :
            row.kind === 'album' ? albumCover :
            artistCover
          const thumb = <img src={src} alt="" className={thumbClass} />
          const content = (
            <>
              {thumb}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-normal text-neutral-100">{row.title}</p>
                <p className="truncate text-xs text-neutral-400">{row.sub}</p>
              </div>
            </>
          )
          if (row.kind === 'artist') {
            return (
              <li key={row.key}>
                <button
                  onClick={() => onArtistClick(row.artist)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-neutral-900"
                >
                  {content}
                </button>
              </li>
            )
          }
          if (row.kind === 'playlist') {
            return (
              <li key={row.key}>
                <button
                  onClick={() => onPlaylistClick(row.playlist)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-neutral-900"
                >
                  {content}
                </button>
              </li>
            )
          }
          return (
            <li key={row.key}>
              <button
                onClick={() => onAlbumClick(row.album)}
                className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-neutral-900"
              >
                {content}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default Library

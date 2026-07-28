import { useEffect, useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import songCover from '../assets/images/song_default.png'
import verifiedIcon from '../assets/icons/artistVerified.svg'
import { X } from './icons'
import { resolveImageUrl } from '../lib/api'
import { search } from '../lib/endpoints'
import type { AlbumSummary, Artist, Music, PlaylistSummary, SearchResponse } from '../lib/types'
import type { RecentSearchItem } from '../lib/useRecentSearches'

type Row =
  | { key: string; kind: 'music'; title: string; sub: string; imageUrl: string | null; music: Music; artist: Artist | null }
  | { key: string; kind: 'artist'; title: string; sub: string; imageUrl: string | null; artist: Artist }
  | { key: string; kind: 'album'; title: string; sub: string; imageUrl: string | null; album: AlbumSummary }
  | { key: string; kind: 'playlist'; title: string; sub: string; imageUrl: string | null; playlist: PlaylistSummary }

type SearchDropdownProps = {
  query: string
  recents: RecentSearchItem[]
  onRemoveRecent: (item: RecentSearchItem) => void
  onArtistClick: (artist: Artist) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onAlbumClick: (album: AlbumSummary) => void
  onMusicClick: (music: Music, artist: Artist | null) => void
}

function recentToRow(item: RecentSearchItem): Row {
  switch (item.kind) {
    case 'music':
      return { key: `music:${item.music.id}`, kind: 'music', title: item.music.title, sub: item.artist ? `Música • ${item.artist.name}` : 'Música', imageUrl: item.music.imageUrl, music: item.music, artist: item.artist }
    case 'artist':
      return { key: `artist:${item.artist.id}`, kind: 'artist', title: item.artist.name, sub: 'Artista', imageUrl: item.artist.imageUrl, artist: item.artist }
    case 'album':
      return { key: `album:${item.album.id}`, kind: 'album', title: item.album.title, sub: `Álbum • ${item.album.artistName}`, imageUrl: item.album.imageUrl, album: item.album }
    case 'playlist':
      return { key: `playlist:${item.playlist.id}`, kind: 'playlist', title: item.playlist.name, sub: 'Playlist', imageUrl: item.playlist.imageUrl, playlist: item.playlist }
  }
}

function resultsToRows(r: SearchResponse): Row[] {
  const artistById = new Map(r.musicArtists.map((a) => [a.id, a]))
  return [
    ...r.artists.map<Row>((a) => ({ key: `artist:${a.id}`, kind: 'artist', title: a.name, sub: 'Artista', imageUrl: a.imageUrl, artist: a })),
    ...r.musics.map<Row>((m) => {
      const artist = artistById.get(m.artistId) ?? null
      return { key: `music:${m.id}`, kind: 'music', title: m.title, sub: artist ? `Música • ${artist.name}` : 'Música', imageUrl: m.imageUrl, music: m, artist }
    }),
    ...r.albums.map<Row>((a) => ({ key: `album:${a.id}`, kind: 'album', title: a.title, sub: `Álbum • ${a.artistName}`, imageUrl: a.imageUrl, album: a })),
    ...r.playlists.map<Row>((p) => ({ key: `playlist:${p.id}`, kind: 'playlist', title: p.name, sub: 'Playlist', imageUrl: p.imageUrl, playlist: p })),
  ]
}

function coverFor(row: Row): string {
  const remote = resolveImageUrl(row.imageUrl)
  if (remote) return remote
  switch (row.kind) {
    case 'music': return songCover
    case 'artist': return artistCover
    case 'album': return albumCover
    case 'playlist': return row.title === 'Músicas Curtidas' ? favoritesCover : playlistCover
  }
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="h-10 w-10 shrink-0 rounded bg-[#3A3A3A]" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="h-3 w-3/4 rounded bg-[#3A3A3A]" />
        <div className="h-2.5 w-1/2 rounded bg-[#3A3A3A]" />
      </div>
    </div>
  )
}

function SearchDropdown({
  query,
  recents,
  onRemoveRecent,
  onArtistClick,
  onPlaylistClick,
  onAlbumClick,
  onMusicClick,
}: SearchDropdownProps) {
  const [debouncedQ, setDebouncedQ] = useState(query.trim())
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!debouncedQ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    search(debouncedQ, 6)
      .then((r) => {
        if (!cancelled) {
          setResults(r)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQ])

  const isEmpty = !query.trim()
  const rows: Row[] = isEmpty ? recents.map(recentToRow) : results ? resultsToRows(results).slice(0, 8) : []

  const handleRowClick = (row: Row) => {
    switch (row.kind) {
      case 'artist': onArtistClick(row.artist); break
      case 'playlist': onPlaylistClick(row.playlist); break
      case 'album': onAlbumClick(row.album); break
      case 'music': onMusicClick(row.music, row.artist); break
    }
  }

  const rowToRecent = (row: Row): RecentSearchItem => {
    switch (row.kind) {
      case 'music': return { kind: 'music', music: row.music, artist: row.artist }
      case 'artist': return { kind: 'artist', artist: row.artist }
      case 'album': return { kind: 'album', album: row.album }
      case 'playlist': return { kind: 'playlist', playlist: row.playlist }
    }
  }

  if (isEmpty && recents.length === 0) return null
  if (!isEmpty && !loading && rows.length === 0) return null

  return (
    <div
      className="absolute top-full right-0 z-40 mt-1 w-[355px] rounded-lg bg-[#1F1F1F] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {isEmpty && (
        <h3 className="mb-2 px-1 font-[Inter] text-sm font-bold text-white">Buscas recentes</h3>
      )}
      {loading ? (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : (
        <ul className="flex flex-col">
          {rows.map((row) => {
            const shape = row.kind === 'artist' ? 'rounded-full' : 'rounded'
            return (
              <li key={row.key} className="group">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleRowClick(row)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[#2A2A2A]"
                >
                  <img src={coverFor(row)} alt="" className={`h-10 w-10 shrink-0 object-cover ${shape}`} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-[Inter] text-[13px] font-semibold text-white">{row.title}</span>
                      {row.kind === 'artist' && (
                        <img src={verifiedIcon} alt="" className="h-3 w-3 shrink-0" />
                      )}
                    </div>
                    <span className="truncate font-[Inter] text-[11px] font-normal text-[#B3B3B3]">{row.sub}</span>
                  </div>
                  {isEmpty && (
                    <span
                      role="button"
                      aria-label="Remover"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveRecent(rowToRecent(row))
                      }}
                      className="shrink-0 p-1 text-[#B3B3B3] opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default SearchDropdown

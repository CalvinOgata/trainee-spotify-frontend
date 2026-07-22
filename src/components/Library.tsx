import { useRef, useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import songCover from '../assets/images/song_default.png'
import createPlaylistButton from '../assets/icons/Button.svg'
import librarySearchIcon from '../assets/icons/searchIconLibrary.svg'
import { Pin, X } from './icons'
import Pill from './Pill'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { useAutoHideScrollbar } from '../lib/useAutoHideScrollbar'
import { useArtistContextMenu } from '../lib/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../lib/PlaylistContextMenuContext'
import { useAlbumContextMenu } from '../lib/AlbumContextMenuContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { useLibrary } from '../lib/LibraryContext'
import { usePlayer } from '../lib/PlayerContext'
import { createPlaylist, getUserPlaylists } from '../lib/endpoints'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from '../lib/types'

type LibraryFilter = 'Tudo' | 'Playlists' | 'Álbuns' | 'Artistas'
const filters: LibraryFilter[] = ['Tudo', 'Playlists', 'Álbuns', 'Artistas']

type BaseRow = { key: string; title: string; sub: string; pinned: boolean }
type Row =
  | (BaseRow & { kind: 'playlist'; playlist: PlaylistSummary })
  | (BaseRow & { kind: 'album'; album: AlbumSummary })
  | (BaseRow & { kind: 'artist'; artist: Artist })
  | (BaseRow & { kind: 'music'; music: Music })

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
  const [search, setSearch] = useState('')
  const { data: playlists } = useApi(getUserPlaylists, [playlistsKey])
  const scrollRef = useRef<HTMLUListElement>(null)
  useAutoHideScrollbar(scrollRef)
  const { openArtistMenu } = useArtistContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()
  const { openSongMenu } = useSongContextMenu()
  const { isPinned, isPlaylistPinned, isAlbumPinned, savedMusics, savedAlbums, followedArtists } = useLibrary()
  const { play } = usePlayer()

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

  const unsortedRows: Row[] = []
  if (activeFilter === 'Tudo' || activeFilter === 'Playlists') {
    for (const p of playlists ?? []) {
      unsortedRows.push({
        key: `pl-${p.id}`,
        kind: 'playlist',
        title: p.name,
        sub: `Playlist${p.description ? ` • ${p.description}` : ''}`,
        pinned: p.name === 'Músicas Curtidas' || isPlaylistPinned(p.id),
        playlist: p,
      })
    }
  }
  if (activeFilter === 'Tudo' || activeFilter === 'Artistas') {
    for (const a of followedArtists) {
      unsortedRows.push({
        key: `ar-${a.id}`,
        kind: 'artist',
        title: a.name,
        sub: 'Artista',
        pinned: isPinned(a.id),
        artist: a,
      })
    }
  }
  if (activeFilter === 'Tudo' || activeFilter === 'Álbuns') {
    for (const a of savedAlbums) {
      unsortedRows.push({
        key: `al-${a.id}`,
        kind: 'album',
        title: a.title,
        sub: `Álbum • ${a.artistName}`,
        pinned: isAlbumPinned(a.id),
        album: a,
      })
    }
  }
  if (activeFilter === 'Tudo') {
    for (const m of savedMusics) {
      unsortedRows.push({
        key: `mu-${m.id}`,
        kind: 'music',
        title: m.title,
        sub: 'Música',
        pinned: false,
        music: m,
      })
    }
  }
  const q = search.trim().toLowerCase()
  const filteredRows = q
    ? unsortedRows.filter((r) => r.title.toLowerCase().includes(q))
    : unsortedRows
  const rows = [
    ...filteredRows.filter((r) => r.pinned),
    ...filteredRows.filter((r) => !r.pinned),
  ]

  return (
    <aside className="flex h-full w-[56px] shrink-0 flex-col overflow-hidden rounded-lg bg-[#121212] pb-3 md:w-[80px] lg:w-[312px]">
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex items-center justify-center gap-2 px-3 pt-3 lg:justify-between">
          <h2 className="font-[Inter] hidden text-[12px] font-bold text-white lg:block">Sua Biblioteca</h2>
          <button
            onClick={handleCreate}
            aria-label="Criar playlist"
            title="Criar playlist"
            className="shrink-0"
          >
            <img src={createPlaylistButton} alt="" className="h-6 w-[87px]" />
          </button>
        </div>
        <div className="hidden gap-2 px-3 lg:flex">
          {filters.map((f) => (
            <Pill key={f} active={f === activeFilter} onClick={() => setActiveFilter(f)}>
              {f}
            </Pill>
          ))}
        </div>
        <div className="mx-3 hidden h-5 w-[288px] items-center gap-2 rounded-[2px] bg-[#2D2D2D] px-2 py-1 text-neutral-400 lg:flex">
          <img src={librarySearchIcon} alt="" className="h-[10px] w-[10px]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar em Sua Biblioteca"
            aria-label="Buscar em Sua Biblioteca"
            className="font-[Inter] min-w-0 flex-1 bg-transparent text-[10px] font-normal text-white placeholder:text-[#B3B3B3] outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Limpar busca"
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      {q && rows.length === 0 && (
        <p className="px-4 text-xs text-neutral-400 lg:block hidden">
          Nenhum resultado para <span className="font-semibold text-white">{search.trim()}</span>.
        </p>
      )}
      <ul ref={scrollRef} className="scroll-auto-hide flex min-h-0 flex-1 flex-col overflow-y-auto px-2">
        {rows.map((row) => {
          const isArtist = row.kind === 'artist'
          const thumbClass = `h-10 w-10 shrink-0 ${isArtist ? 'rounded-full' : 'rounded'} object-cover`
          const remote =
            row.kind === 'playlist' ? resolveImageUrl(row.playlist.imageUrl) :
            row.kind === 'album' ? resolveImageUrl(row.album.imageUrl) :
            row.kind === 'music' ? resolveImageUrl(row.music.imageUrl) :
            resolveImageUrl(row.artist.imageUrl)
          const fallback =
            row.kind === 'playlist' ? (row.title === 'Músicas Curtidas' ? favoritesCover : playlistCover) :
            row.kind === 'album' ? albumCover :
            row.kind === 'music' ? songCover :
            artistCover
          const src = remote ?? fallback
          const thumb = <img src={src} alt={row.title} title={row.title} className={thumbClass} />
          const content = (
            <>
              {thumb}
              <div className="hidden min-w-0 flex-1 lg:block">
                <p className="truncate text-sm font-normal text-neutral-100">{row.title}</p>
                <p className="flex items-center gap-1 truncate text-xs text-neutral-400">
                  {row.pinned && <Pin className="h-3 w-3 shrink-0 text-[#1FDF64]" />}
                  <span className="truncate">{row.sub}</span>
                </p>
              </div>
            </>
          )
          const buttonClass =
            'flex w-full items-center justify-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-neutral-900 lg:justify-start'
          if (row.kind === 'artist') {
            return (
              <li key={row.key}>
                <button
                  onClick={() => onArtistClick(row.artist)}
                  onContextMenu={(e) => openArtistMenu(e, row.artist)}
                  className={buttonClass}
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
                  onContextMenu={(e) => openPlaylistMenu(e, row.playlist)}
                  className={buttonClass}
                >
                  {content}
                </button>
              </li>
            )
          }
          if (row.kind === 'music') {
            return (
              <li key={row.key}>
                <button
                  onClick={() => play(row.music)}
                  onContextMenu={(e) =>
                    openSongMenu(e, { music: row.music, artist: null, album: null })
                  }
                  className={buttonClass}
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
                onContextMenu={(e) => openAlbumMenu(e, row.album)}
                className={buttonClass}
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

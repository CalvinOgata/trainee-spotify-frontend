import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import albumCover from '../../assets/images/album_default.png'
import artistCover from '../../assets/images/artist_default.png'
import favoritesCover from '../../assets/images/favorites_default.png'
import playlistCover from '../../assets/images/playlist_default.png'
import songCover from '../../assets/images/song_default.png'
import createPlaylistButton from '../../assets/icons/Button.svg'
import librarySearchIcon from '../../assets/icons/searchIconLibrary.svg'
import libraryPlayingIcon from '../../assets/icons/libraryPlaying.svg'
import pauseIcon from '../../assets/icons/Pause.svg'
import { Lock, Pin, X } from '../icons'
import EditPlaylistDetailsModal from '../modals/EditPlaylistDetailsModal'
import Pill from '../ui/Pill'
import { resolveImageUrl } from '../../lib/api/client'
import { useApi } from '../../lib/hooks/useApi'
import { useAutoHideScrollbar } from '../../lib/hooks/useAutoHideScrollbar'
import { useArtistContextMenu } from '../../lib/contexts/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../../lib/contexts/PlaylistContextMenuContext'
import { useAlbumContextMenu } from '../../lib/contexts/AlbumContextMenuContext'
import { useSongContextMenu } from '../../lib/contexts/SongContextMenuContext'
import { useLibrary } from '../../lib/contexts/LibraryContext'
import { usePlayer } from '../../lib/contexts/PlayerContext'
import { createPlaylist, getUserPlaylists } from '../../lib/api/endpoints'
import type { AlbumSummary, Artist, Music, PlaylistSummary } from '../../lib/api/types'

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

// Lowercases and strips diacritics + punctuation/symbols so searches ignore accents ("cafe" matches "Café") and punctuation ("rock n roll" matches "Rock'n'Roll").
function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\p{P}\p{S}]/gu, '')
}

// Builds the normalized form of a string alongside an index map so a match found in the normalized form can be mapped back to the original char positions.
function buildNormalizedIndex(text: string): { normalized: string; map: number[] } {
  let normalized = ''
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    const nc = normalizeForSearch(text[i])
    for (const c of nc) {
      normalized += c
      map.push(i)
    }
  }
  return { normalized, map }
}

// Wraps the first accent/punctuation-insensitive match of `normalizedQuery` inside `text` in a <mark>; returns raw text if no match or empty query.
function highlightMatch(text: string, normalizedQuery: string): ReactNode {
  if (!normalizedQuery) return text
  const { normalized, map } = buildNormalizedIndex(text)
  const idx = normalized.indexOf(normalizedQuery)
  if (idx < 0) return text
  const origStart = map[idx]
  const origEnd = map[idx + normalizedQuery.length - 1] + 1
  return (
    <>
      {text.slice(0, origStart)}
      <mark className="rounded-sm bg-white/20 text-inherit">
        {text.slice(origStart, origEnd)}
      </mark>
      {text.slice(origEnd)}
    </>
  )
}

// Derives "Minha playlist nº N+1" by scanning existing playlist names for the highest N.
function nextPlaylistName(playlists: PlaylistSummary[]): string {
  const max = playlists.reduce((acc, p) => {
    const m = p.name.match(namePattern)
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc
  }, 0)
  return `Minha playlist nº ${max + 1}`
}

// Left sidebar: builds rows from playlists/artists/albums/musics, applies filter+search+recency sort, renders playing indicators.
function Library({ onArtistClick, onPlaylistClick, onAlbumClick, playlistsKey, onPlaylistCreated }: LibraryProps) {
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('Tudo')
  const [search, setSearch] = useState('')
  const [draftPlaylist, setDraftPlaylist] = useState<PlaylistSummary | null>(null)
  const { data: playlists } = useApi(getUserPlaylists, [playlistsKey])
  const scrollRef = useRef<HTMLUListElement>(null)
  useAutoHideScrollbar(scrollRef)
  const { openArtistMenu } = useArtistContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()
  const { openSongMenu } = useSongContextMenu()
  const {
    isPinned,
    isPlaylistPinned,
    isPlaylistPrivate,
    isAlbumPinned,
    savedMusics,
    savedAlbums,
    followedArtists,
    getArtistById,
  } = useLibrary()
  const {
    play,
    current,
    currentArtist,
    currentSource,
    currentPromote,
    queue,
    isPlaying,
  } = usePlayer()

  // True when the row represents what the player is currently playing per the rules (source promote for album/playlist, artist promote for artist, avulsus for music).
  const isRowPlaying = (row: Row): boolean => {
    switch (row.kind) {
      case 'music':
        return current?.id === row.music.id && queue.length <= 1
      case 'artist':
        return currentPromote === 'artist' && currentArtist?.id === row.artist.id
      case 'album':
        return (
          currentPromote === 'source' &&
          currentSource?.kind === 'album' &&
          currentSource.album.id === row.album.id
        )
      case 'playlist':
        return (
          currentPromote === 'source' &&
          currentSource?.kind === 'playlist' &&
          currentSource.playlist.id === row.playlist.id
        )
    }
  }

  // Opens the details modal with a stubbed draft playlist so the user can edit name/description before we actually create it on the backend.
  const handleCreate = () => {
    setDraftPlaylist({
      id: '',
      name: nextPlaylistName(playlists ?? []),
      description: '',
      musicQtd: 0,
      duration: 0,
      imageUrl: null,
      isPrivate: false,
      lastPlayedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    })
  }

  // Fires when the user clicks Salvar on the draft modal: creates the playlist on the backend, refreshes the sidebar, navigates to it, then closes the modal.
  const handleSaveDraft = async (input: { name: string; description: string }) => {
    try {
      const created = await createPlaylist(input)
      onPlaylistCreated()
      onPlaylistClick(created)
    } catch {
      // ignore
    }
    setDraftPlaylist(null)
  }

  // Assemble raw rows for each library category included by the current filter (Tudo shows all four).
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
  // Apply the search box as an accent/punctuation-insensitive substring filter over the title.
  const q = normalizeForSearch(search.trim())
  const filteredRows = q
    ? unsortedRows.filter((r) => buildNormalizedIndex(r.title).normalized.includes(q))
    : unsortedRows
  // Recency timestamp for a row, used to sort the unpinned section most-recent-first. Backend serves lastPlayedAt on each entity DTO; parse to ms or 0 if never played.
  const recencyOf = (r: Row): number => {
    const ts =
      r.kind === 'playlist' ? r.playlist.lastPlayedAt :
      r.kind === 'album' ? r.album.lastPlayedAt :
      r.kind === 'artist' ? r.artist.lastPlayedAt :
      r.music.lastPlayedAt
    return ts ? Date.parse(ts) : 0
  }
  // Unpinned rows: sorted by recency desc, with never-played items falling back to their natural (data) order.
  const unpinned = filteredRows
    .filter((r) => !r.pinned)
    .map((row, i) => ({ row, i, ts: recencyOf(row) }))
    .sort((a, b) => (b.ts !== a.ts ? b.ts - a.ts : a.i - b.i))
    .map((x) => x.row)
  // Final render list: pinned rows first (data order), then the recency-sorted unpinned tail.
  const rows = [
    ...filteredRows.filter((r) => r.pinned),
    ...unpinned,
  ]

  return (
    <>
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
          const shape = isArtist ? 'rounded-full' : 'rounded'
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
          const playing = isRowPlaying(row)
          const thumb = (
            <div className={`relative h-10 w-10 shrink-0 overflow-hidden ${shape}`}>
              <img src={src} alt={row.title} title={row.title} className="h-full w-full object-cover" />
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    className={`absolute h-5 w-5 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <img
                    src={pauseIcon}
                    alt=""
                    className={`absolute h-4 w-4 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>
              </div>
            </div>
          )
          const content = (
            <>
              {thumb}
              <div className="hidden min-w-0 flex-1 lg:block">
                <p
                  className={`truncate text-sm font-normal transition-colors duration-300 ${playing ? 'text-[#67C260]' : 'text-neutral-100'}`}
                >
                  {highlightMatch(row.title, q)}
                </p>
                <p className="flex items-center gap-1 truncate text-xs text-neutral-400">
                  {row.pinned && <Pin className="h-3 w-3 shrink-0 text-[#1FDF64]" />}
                  {row.kind === 'playlist' && isPlaylistPrivate(row.playlist.id) && (
                    <Lock className="h-3 w-3 shrink-0 text-neutral-400" />
                  )}
                  <span className="truncate">{row.sub}</span>
                </p>
              </div>
              <img
                src={libraryPlayingIcon}
                alt=""
                aria-label="Tocando agora"
                className={`hidden h-3 w-3 shrink-0 transition-opacity duration-300 lg:block ${playing && isPlaying ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          )
          const buttonClass =
            'flex w-full items-center justify-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors duration-200 hover:bg-[#2A2A2A] lg:justify-start'
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
            const musicArtist = getArtistById(row.music.artistId)
            return (
              <li key={row.key}>
                <button
                  onClick={() => play(row.music, { artist: musicArtist ?? undefined })}
                  onContextMenu={(e) =>
                    openSongMenu(e, { music: row.music, artist: musicArtist, album: null })
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
    {draftPlaylist && (
      <EditPlaylistDetailsModal
        playlist={draftPlaylist}
        title="Criar playlist"
        onClose={() => setDraftPlaylist(null)}
        onSave={handleSaveDraft}
      />
    )}
    </>
  )
}

export default Library

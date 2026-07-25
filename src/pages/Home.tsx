import { useEffect, useState } from 'react'
import albumCover from '../assets/images/album_default.png'
import artistCover from '../assets/images/artist_default.png'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import songCover from '../assets/images/song_default.png'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { useArtistContextMenu } from '../lib/ArtistContextMenuContext'
import { usePlaylistContextMenu } from '../lib/PlaylistContextMenuContext'
import { useAlbumContextMenu } from '../lib/AlbumContextMenuContext'
import {
  getArtist,
  getArtistAlbums,
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
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openArtistMenu } = useArtistContextMenu()
  const { openPlaylistMenu } = usePlaylistContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()

  const recentItems = (recentMusics ?? []).slice(0, 8)
  const playlistTiles = (playlists ?? []).slice(0, 7)
  const artistTiles = (recentArtists ?? []).slice(0, 9)
  const albumTiles = (recentAlbums ?? []).slice(0, 7)

  const showMusic = activeFilter === 'Tudo' || activeFilter === 'Música'
  const showPlaylists = activeFilter === 'Tudo' || activeFilter === 'Playlists'

  const [artistCache, setArtistCache] = useState<Record<string, Artist>>({})
  const [albumCache, setAlbumCache] = useState<Record<string, AlbumSummary>>({})

  const artistById = new Map<string, Artist>([
    ...(recentArtists ?? []).map((a): [string, Artist] => [a.id, a]),
    ...Object.entries(artistCache),
  ])
  const albumById = new Map<string, AlbumSummary>([
    ...(recentAlbums ?? []).map((a): [string, AlbumSummary] => [a.id, a]),
    ...Object.entries(albumCache),
  ])

  // Backfills album/artist caches for any recent song whose album or artist is missing from the recent-* strips.
  useEffect(() => {
    if (!recentMusics) return
    const knownArtistIds = new Set([
      ...(recentArtists ?? []).map((a) => a.id),
      ...Object.keys(artistCache),
    ])
    const knownAlbumIds = new Set([
      ...(recentAlbums ?? []).map((a) => a.id),
      ...Object.keys(albumCache),
    ])
    const missingArtistIds = Array.from(
      new Set(recentMusics.map((m) => m.artistId).filter((id) => !knownArtistIds.has(id))),
    )
    const missingAlbumIds = new Set(
      recentMusics.map((m) => m.albumId).filter((id) => !knownAlbumIds.has(id)),
    )
    if (missingArtistIds.length === 0 && missingAlbumIds.size === 0) return

    let cancelled = false

    if (missingArtistIds.length > 0) {
      Promise.all(
        missingArtistIds.map((id) =>
          getArtist(id).then((a) => [id, a] as const).catch(() => null),
        ),
      ).then((results) => {
        if (cancelled) return
        const additions: Record<string, Artist> = {}
        for (const r of results) if (r) additions[r[0]] = r[1]
        if (Object.keys(additions).length > 0) {
          setArtistCache((prev) => ({ ...prev, ...additions }))
        }
      })
    }

    if (missingAlbumIds.size > 0) {
      const artistIdsToScan = Array.from(
        new Set(
          recentMusics
            .filter((m) => missingAlbumIds.has(m.albumId))
            .map((m) => m.artistId),
        ),
      )
      Promise.all(
        artistIdsToScan.map((id) => getArtistAlbums(id).catch(() => [])),
      ).then((results) => {
        if (cancelled) return
        const additions: Record<string, AlbumSummary> = {}
        for (const albums of results) {
          for (const a of albums) {
            if (missingAlbumIds.has(a.id)) {
              const { id, title, year, artistId, artistName, imageUrl, createdAt, updatedAt } = a
              additions[a.id] = { id, title, year, artistId, artistName, imageUrl, createdAt, updatedAt }
            }
          }
        }
        if (Object.keys(additions).length > 0) {
          setAlbumCache((prev) => ({ ...prev, ...additions }))
        }
      })
    }

    return () => {
      cancelled = true
    }
  }, [recentMusics, recentArtists, recentAlbums, artistCache, albumCache])

  return (
    <div className="flex h-full flex-col gap-5">
      <section className="flex flex-col gap-3">
        <div className="flex gap-2.5">
          {filters.map((label) => {
            const active = label === activeFilter
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`flex h-8 w-14 items-center justify-center overflow-hidden whitespace-nowrap rounded-2xl p-2.5 text-[10px] font-semibold leading-none ${
                  active ? 'bg-white text-black' : 'bg-[#343333] text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        {showMusic && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {recentItems.map((m) => (
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
              className="flex h-[60px] w-full items-center gap-2.5 overflow-hidden rounded-[4px] bg-[#2D2D2D] pr-3 text-left hover:brightness-110"
            >
              <img src={resolveImageUrl(m.imageUrl) ?? songCover} alt="" className="h-[60px] w-[60px] shrink-0 object-cover" />
              <span className="truncate text-sm font-semibold text-white">{m.title}</span>
            </button>
          ))}
        </div>
        )}
      </section>

      {showPlaylists && (
      <section className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-white">Suas Playlists</h3>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {playlistTiles.map((p) => (
            <button
              key={p.id}
              onClick={() => onPlaylistClick(p)}
              onContextMenu={(e) => openPlaylistMenu(e, p)}
              className="flex h-[172px] w-[132px] shrink-0 flex-col gap-2 text-left"
            >
              <img src={resolveImageUrl(p.imageUrl) ?? (p.name === 'Músicas Curtidas' ? favoritesCover : playlistCover)} alt="" className="h-[132px] w-[132px] rounded-[2px] object-cover" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{p.name}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">
                  {p.description ? `Playlist • ${p.description}` : 'Playlist'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
      )}

      {showMusic && (
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Artistas recentes</h3>
          <button className="text-xs font-semibold text-neutral-400 hover:text-white">Mostrar tudo</button>
        </div>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {artistTiles.map((a) => (
            <button
              key={a.id}
              onClick={() => onArtistClick(a)}
              onContextMenu={(e) => openArtistMenu(e, a)}
              className="flex h-[172px] w-[132px] shrink-0 flex-col gap-2 text-left"
            >
              <img src={resolveImageUrl(a.imageUrl) ?? artistCover} alt="" className="h-[132px] w-[132px] rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{a.name}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">Artista</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      )}

      {showMusic && (
      <section className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-white">Álbuns recentes</h3>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {albumTiles.map((a) => (
            <button
              key={a.id}
              onClick={() => onAlbumClick(a)}
              onContextMenu={(e) => openAlbumMenu(e, a)}
              className="flex w-[140px] shrink-0 flex-col gap-1.5 rounded-[4px] p-1 text-left hover:brightness-110"
            >
              <img src={resolveImageUrl(a.imageUrl) ?? albumCover} alt="" className="h-[132px] w-[132px] rounded-[2px] object-cover" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{a.title}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">
                  {a.year ? `${a.year} • Álbum` : 'Álbum'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
      )}
    </div>
  )
}

export default Home

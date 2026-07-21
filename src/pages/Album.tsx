import albumCover from '../assets/images/album_default.png'
import songCover from '../assets/images/song_default.png'
import { Clock } from '../components/icons'
import { resolveImageUrl } from '../lib/api'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import { useSongContextMenu } from '../lib/SongContextMenuContext'
import { useAlbumContextMenu } from '../lib/AlbumContextMenuContext'
import { getAlbumMusics } from '../lib/endpoints'
import { formatDuration, formatPlaylistDuration } from '../lib/format'
import type { AlbumSummary, Artist } from '../lib/types'

const PlayArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 5v14l11-7z" />
  </svg>
)

type AlbumProps = { album: AlbumSummary }

function Album({ album }: AlbumProps) {
  const { data: musics } = useApi(() => getAlbumMusics(album.id), [album.id])
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()

  const tracks = musics ?? []
  const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0)
  const isEmpty = tracks.length === 0

  const artist: Artist = {
    id: album.artistId,
    name: album.artistName,
    listeners: 0,
    about: null,
    imageUrl: null,
    createdAt: album.createdAt,
    updatedAt: null,
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        onContextMenu={(e) => openAlbumMenu(e, album)}
        className="-mx-5 -mt-6 flex items-end gap-4 bg-gradient-to-b from-[#535353] to-[#1a1a1a] px-5 pt-10 pb-4"
      >
        <img
          src={resolveImageUrl(album.imageUrl) ?? albumCover}
          alt=""
          className="h-[160px] w-[160px] shrink-0 rounded shadow-[0_4px_60px_rgba(0,0,0,0.5)] object-cover"
        />
        <div className="flex min-w-0 flex-col pb-2">
          <p className="text-xs font-semibold leading-none text-white">Álbum</p>
          <h1 className="mt-2 truncate text-4xl font-bold leading-none text-white sm:text-5xl lg:text-7xl">{album.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white">
            {album.artistName}
            {!isEmpty && (
              <span className="font-normal text-white/80">
                {album.year ? ` • ${album.year}` : ''} • {tracks.length} músicas, {formatPlaylistDuration(totalDuration)}
              </span>
            )}
          </p>
        </div>
      </div>

      {!isEmpty && (
        <div className="flex items-center">
          <button
            onClick={() => play(tracks[0], { artist, queue: tracks, source: { kind: 'album', album } })}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
            aria-label="Reproduzir"
          >
            <PlayArrow />
          </button>
        </div>
      )}

      {!isEmpty && (
        <section className="flex flex-col gap-1">
          <div className="grid grid-cols-[20px_minmax(0,2fr)_60px] items-center gap-3 border-b border-neutral-800 px-2 pb-2 text-xs font-normal text-neutral-400">
            <span>#</span>
            <span>Título</span>
            <span className="flex justify-end"><Clock /></span>
          </div>
          <ul className="flex flex-col">
            {tracks.map((t, i) => (
              <li
                key={t.id}
                onClick={() => play(t, { artist, queue: tracks, source: { kind: 'album', album } })}
                onContextMenu={(e) =>
                  openSongMenu(e, { music: t, artist, album })
                }
                className="grid h-12 cursor-pointer grid-cols-[20px_minmax(0,2fr)_60px] items-center gap-3 rounded px-2 text-xs hover:bg-neutral-900"
              >
                <span className="text-neutral-400">{i + 1}</span>
                <div className="flex min-w-0 items-center gap-2.5">
                  <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight text-white">{t.title}</p>
                    <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">
                      {album.artistName}
                    </p>
                  </div>
                </div>
                <p className="text-right text-neutral-400">{formatDuration(t.duration)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Album

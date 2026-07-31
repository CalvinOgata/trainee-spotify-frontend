import albumCover from '../assets/images/album_default.png'
import songCover from '../assets/images/song_default.png'
import { Clock } from '../components/icons'
import { resolveImageUrl } from '../lib/api/client'
import { useApi } from '../lib/hooks/useApi'
import { usePlayer } from '../lib/contexts/PlayerContext'
import { useSongContextMenu } from '../lib/contexts/SongContextMenuContext'
import { useAlbumContextMenu } from '../lib/contexts/AlbumContextMenuContext'
import { getAlbumMusics, getArtist } from '../lib/api/endpoints'
import { formatDuration, formatPlaylistDuration } from '../lib/format'
import type { AlbumSummary } from '../lib/api/types'

const PlayArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 5v14l11-7z" />
  </svg>
)

type AlbumProps = { album: AlbumSummary }

function Album({ album }: AlbumProps) {
  const { data: musics } = useApi(() => getAlbumMusics(album.id), [album.id])
  const { data: artist } = useApi(() => getArtist(album.artistId), [album.artistId])
  const { play } = usePlayer()
  const { openSongMenu } = useSongContextMenu()
  const { openAlbumMenu } = useAlbumContextMenu()

  const tracks = musics ?? []
  const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0)
  const isEmpty = tracks.length === 0
  const playOpts = { queue: tracks, source: { kind: 'album' as const, album } }

  return (
    <div className="flex h-full min-w-0 flex-col gap-3">
      <div
        onContextMenu={(e) => openAlbumMenu(e, album)}
        className="-mx-3 -mt-4 flex min-h-[116px] min-w-[360px] shrink-0 items-end gap-3 bg-gradient-to-b from-[#535353] to-[#1a1a1a] px-3 pt-4 pb-4 md:-mx-5 md:-mt-6 md:min-h-0 md:min-w-0 md:gap-4 md:px-5 md:pt-10"
      >
        <img
          src={resolveImageUrl(album.imageUrl) ?? albumCover}
          alt=""
          className="h-[100px] w-[100px] shrink-0 rounded shadow-[0_4px_60px_rgba(0,0,0,0.5)] object-cover md:h-[160px] md:w-[160px]"
        />
        <div className="flex min-w-0 max-w-[calc(100vw-200px)] flex-col pb-1 md:max-w-none md:pb-2">
          <p className="font-[Inter] text-[10px] font-semibold leading-none text-white md:text-xs">Álbum</p>
          <h1 className="font-[Inter] mt-2 line-clamp-2 break-words text-[20px] font-bold leading-tight text-white md:line-clamp-none md:truncate md:text-4xl md:font-black md:leading-none lg:text-7xl">{album.title}</h1>
          <p className="mt-2 font-[Inter] text-[10px] font-semibold leading-tight text-white md:mt-3 md:text-xs">
            <span className="whitespace-nowrap">{album.artistName}</span>
            {!isEmpty && (
              <span className="font-normal text-white/80">
                {' '}
                {album.year && (
                  <>
                    <span className="whitespace-nowrap">• {album.year}</span>
                    {' '}
                  </>
                )}
                <span className="whitespace-nowrap">• {tracks.length} músicas</span>
                ,{' '}
                <span className="whitespace-nowrap">{formatPlaylistDuration(totalDuration)}</span>
              </span>
            )}
          </p>
        </div>
      </div>

      {!isEmpty && (
        <div className="flex items-center">
          <button
            onClick={() =>
              play(tracks[0], { ...playOpts, artist: artist ?? undefined, promote: 'source' })
            }
            className="grid h-10 w-10 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
            aria-label="Reproduzir"
          >
            <PlayArrow />
          </button>
        </div>
      )}

      {!isEmpty && (
        <section className="flex flex-col gap-1">
          <div className="hidden grid-cols-[20px_minmax(0,2fr)_60px] items-center gap-3 border-b border-neutral-800 px-2 pb-2 text-xs font-normal text-neutral-400 md:grid">
            <span>#</span>
            <span>Título</span>
            <span className="flex justify-end"><Clock /></span>
          </div>
          <ul className="flex flex-col">
            {tracks.map((t, i) => (
              <li
                key={t.id}
                onClick={() => play(t, { ...playOpts, artist: artist ?? undefined })}
                onContextMenu={(e) =>
                  openSongMenu(e, { music: t, artist, album })
                }
                className="grid h-12 cursor-pointer grid-cols-[20px_minmax(0,1fr)] items-center gap-3 rounded px-2 text-xs hover:bg-neutral-900 md:grid-cols-[20px_minmax(0,2fr)_60px]"
              >
                <span className="text-neutral-400">{i + 1}</span>
                <div className="flex min-w-0 items-center gap-2.5">
                  <img src={resolveImageUrl(t.imageUrl) ?? songCover} alt="" className="h-10 w-10 shrink-0 rounded object-cover md:h-9 md:w-9" />
                  <div className="min-w-0">
                    <p className="truncate font-[Arial,_Helvetica,_sans-serif] text-[12px] font-bold leading-tight text-white md:text-sm md:font-semibold">{t.title}</p>
                    <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">
                      {album.artistName}
                    </p>
                  </div>
                </div>
                <p className="hidden text-right text-neutral-400 md:block">{formatDuration(t.duration)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Album

import { useRef, useState } from 'react'
import artistAboutCover from '../assets/images/artist_about.png'
import songCover from '../assets/images/song_default.png'
import followingButton from '../assets/icons/FollowingButton.svg'
import iconButtons from '../assets/icons/IconButtons.svg'
import CreditsModal from './CreditsModal'
import { Verified } from './icons'
import { resolveImageUrl } from '../lib/api'
import { usePlayer } from '../lib/PlayerContext'
import { useAutoHideScrollbar } from '../lib/useAutoHideScrollbar'
import { formatPlays } from '../lib/format'
import type { AlbumSummary, Artist, PlaylistSummary } from '../lib/types'

const composers = [
  { name: 'WOOJIN of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'LOUIS of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'RYUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'OHUL of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'Mehti', role: 'Autores' },
  { name: 'Eric Minz', role: 'Autores • Letrista' },
]

const tourEvents = [
  {
    month: 'Mai.',
    day: '24',
    city: 'Los Angeles',
    lineup: 'LNGSHOT, P1Harmony e Jay Park',
    when: 'dom., 18:00',
    venue: 'Peacock Theather',
  },
]

type SongPanelProps = {
  onAlbumClick: (album: AlbumSummary) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onArtistClick: (artist: Artist) => void
}

function SongPanel({ onAlbumClick, onPlaylistClick, onArtistClick }: SongPanelProps) {
  const [creditsOpen, setCreditsOpen] = useState(false)
  const { current, currentArtist, currentSource, nextUp, next } = usePlayer()
  const ref = useRef<HTMLElement>(null)
  useAutoHideScrollbar(ref)

  if (!current) return null

  const title = current.title
  const subtitle = currentArtist?.name ?? 'Artista'

  const sourceLabel =
    currentSource?.kind === 'album'
      ? currentSource.album.title
      : currentSource?.kind === 'playlist'
        ? currentSource.playlist.name
        : current.title
  const sourceClickable =
    currentSource?.kind === 'album' ||
    currentSource?.kind === 'playlist' ||
    (currentSource?.kind === 'music' && currentSource.album !== null)
  const handleSourceClick = () => {
    if (currentSource?.kind === 'album') onAlbumClick(currentSource.album)
    else if (currentSource?.kind === 'playlist') onPlaylistClick(currentSource.playlist)
    else if (currentSource?.kind === 'music' && currentSource.album)
      onAlbumClick(currentSource.album)
  }

  const albumFromSource: AlbumSummary | null =
    currentSource?.kind === 'album'
      ? currentSource.album
      : currentSource?.kind === 'music'
        ? currentSource.album
        : null

  return (
    <>
      <aside
        ref={ref}
        className="scroll-auto-hide hidden h-full w-[315px] shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-lg bg-[#121212] xl:flex"
      >
        <div className="flex shrink-0 items-center justify-between px-3 pt-3 pb-2">
          {sourceClickable ? (
            <button
              onClick={handleSourceClick}
              className="font-[Inter] min-w-0 truncate text-left text-[12px] font-bold text-[#FFFFFF] hover:underline"
            >
              {sourceLabel}
            </button>
          ) : (
            <h2 className="font-[Inter] min-w-0 truncate text-[12px] font-bold text-[#FFFFFF]">
              {sourceLabel}
            </h2>
          )}
          <button aria-label="Mais opções">
            <img src={iconButtons} alt="" className="h-6 w-6" />
          </button>
        </div>
        {albumFromSource ? (
          <button
            onClick={() => onAlbumClick(albumFromSource)}
            aria-label={`Abrir álbum ${albumFromSource.title}`}
            className="mx-3 shrink-0 cursor-pointer"
          >
            <img src={resolveImageUrl(current.imageUrl) ?? songCover} alt="" className="h-[291px] w-[291px] object-cover" />
          </button>
        ) : (
          <img src={resolveImageUrl(current.imageUrl) ?? songCover} alt="" className="mx-3 h-[291px] w-[291px] shrink-0 object-cover" />
        )}
        <div className="shrink-0 px-3 pt-3 pb-3">
          <p className="font-[Inter] text-lg font-extrabold text-white">{title}</p>
          {currentArtist ? (
            <button
              onClick={() => onArtistClick(currentArtist)}
              className="font-[Inter] cursor-pointer text-left text-sm font-semibold text-neutral-400 hover:underline"
            >
              {subtitle}
            </button>
          ) : (
            <p className="font-[Inter] text-sm font-semibold text-neutral-400">{subtitle}</p>
          )}
        </div>

        <div className="mx-3 mb-3 flex h-[303px] w-[291px] shrink-0 flex-col overflow-hidden rounded-lg bg-[#1F1F1F]">
          {currentArtist ? (
            <button
              onClick={() => onArtistClick(currentArtist)}
              aria-label={`Abrir página do artista ${currentArtist.name}`}
              className="relative h-[180px] w-full shrink-0 cursor-pointer"
            >
              <img
                src={resolveImageUrl(currentArtist.imageUrl) ?? artistAboutCover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <p className="font-[Inter] absolute top-3 left-3 text-sm font-bold text-white">Sobre o artista</p>
            </button>
          ) : (
            <div className="relative h-[180px] w-full shrink-0">
              <img
                src={artistAboutCover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <p className="font-[Inter] absolute top-3 left-3 text-sm font-bold text-white">Sobre o artista</p>
            </div>
          )}
          <div className="flex flex-col gap-2 p-3">
            <div className="flex items-center gap-1">
              {currentArtist ? (
                <button
                  onClick={() => onArtistClick(currentArtist)}
                  className="font-[Inter] cursor-pointer text-left text-base font-bold text-white hover:underline"
                >
                  {currentArtist.name}
                </button>
              ) : (
                <p className="font-[Inter] text-base font-bold text-white">—</p>
              )}
              <Verified />
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="font-[Inter] text-xs font-medium text-white">
                {currentArtist ? `${formatPlays(currentArtist.listeners)} ouvintes mensais` : ''}
              </p>
              <button aria-label="Deixar de seguir" className="shrink-0">
                <img src={followingButton} alt="" className="h-6 w-[104px]" />
              </button>
            </div>
            <p className="font-[Inter] line-clamp-3 text-xs font-medium text-neutral-400">
              {currentArtist?.about ?? ''}
            </p>
          </div>
        </div>

        <div className="mx-3 mb-3 flex h-[168px] w-[291px] shrink-0 flex-col gap-3 rounded-lg bg-[#1F1F1F] p-3">
          <div className="flex items-center justify-between">
            <p className="font-[Inter] text-xs font-bold text-white">Créditos</p>
            <button
              onClick={() => setCreditsOpen(true)}
              className="font-[Inter] text-[10px] font-bold text-[#B3B3B3] hover:text-white"
            >
              Mostrar tudo
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {currentArtist && (
              <li className="-mx-2 -my-1 flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-[#3E3E3E]">
                <div className="min-w-0">
                  <p className="font-[Inter] truncate text-xs font-medium text-white">{currentArtist.name}</p>
                  <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">Artista Principal</p>
                </div>
                <button aria-label="Deixar de seguir" className="shrink-0">
                  <img src={followingButton} alt="" className="h-6 w-[104px]" />
                </button>
              </li>
            )}
            {composers.slice(0, 2).map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-[Inter] truncate text-xs font-medium text-white">{c.name}</p>
                  <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">{c.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-3 mb-3 flex w-[291px] shrink-0 flex-col gap-3 rounded-lg bg-[#1F1F1F] p-3">
          <p className="font-[Inter] text-sm font-bold text-white">Em turnê</p>
          <ul className="flex flex-col gap-3">
            {tourEvents.map((e, i) => (
              <li key={i} className="-mx-2 -my-1 flex items-center gap-3 rounded-md px-2 py-1 hover:bg-[#3E3E3E]">
                <div className="flex h-[42px] w-[42px] shrink-0 flex-col items-center justify-center rounded-md bg-[#121212]">
                  <p className="font-[Inter] text-[8px] font-bold text-[#FFFFFF]">{e.month}</p>
                  <p className="font-[Inter] text-[16px] font-bold leading-none text-[#FFFFFF]">{e.day}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-[Inter] truncate text-[11px] font-semibold text-[#FFFFFF]">{e.city}</p>
                  <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">{e.lineup}</p>
                  <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">
                    {e.when} • {e.venue}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {nextUp && (
          <div className="mx-3 mb-3 flex w-[291px] shrink-0 flex-col gap-3 rounded-lg bg-[#1F1F1F] p-3">
            <p className="font-[Inter] text-sm font-bold text-white">A seguir</p>
            <button
              onClick={next}
              aria-label={`Tocar a seguir: ${nextUp.music.title}`}
              className="group -mx-2 -my-1 flex w-[calc(100%+16px)] items-center gap-3 rounded-md px-2 py-1 text-left hover:bg-[#3E3E3E]"
            >
              <div className="relative h-[42px] w-[42px] shrink-0">
                <img
                  src={resolveImageUrl(nextUp.music.imageUrl) ?? songCover}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition group-hover:bg-black/30">
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    className="h-5 w-5 opacity-0 transition group-hover:opacity-100"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-[Inter] truncate text-[11px] font-semibold text-[#FFFFFF]">{nextUp.music.title}</p>
                <p className="font-[Inter] truncate text-[10px] font-medium text-[#B3B3B3]">
                  {nextUp.artist?.name ?? 'Artista'}
                </p>
              </div>
            </button>
          </div>
        )}
      </aside>
      {creditsOpen && (
        <CreditsModal
          onClose={() => setCreditsOpen(false)}
          title={title}
          artistName={currentArtist?.name ?? '—'}
        />
      )}
    </>
  )
}

export default SongPanel

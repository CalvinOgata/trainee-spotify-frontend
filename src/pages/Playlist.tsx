import { useEffect, useState } from 'react'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import profilePhoto from '../assets/images/profile_default.png'
import songCover from '../assets/images/song_default.png'
import { Clock, Lock, MusicNote, Pen, Trash, X } from '../components/icons'
import { useApi } from '../lib/useApi'
import { usePlayer } from '../lib/PlayerContext'
import {
  deletePlaylist,
  getPlaylist,
  getRecentAlbums,
  getRecentArtists,
  removeMusicFromPlaylist,
  updatePlaylistAttributes,
} from '../lib/endpoints'
import { formatDuration, formatPlaylistDuration, formatPtDate } from '../lib/format'
import type { PlaylistSummary } from '../lib/types'

const PlayArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 5v14l11-7z" />
  </svg>
)

type ConfirmDeleteProps = {
  playlistName: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDelete({ playlistName, onConfirm, onCancel }: ConfirmDeleteProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-[420px] flex-col gap-4 rounded-lg bg-[#282828] p-5"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-white">Excluir playlist?</h2>
          <button onClick={onCancel} aria-label="Fechar" className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm font-normal text-neutral-300">
          Tem certeza que deseja excluir <span className="font-semibold text-white">{playlistName}</span>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="rounded-full border border-neutral-500 px-4 py-1.5 text-xs font-semibold text-white hover:border-white"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-[#e34a4a] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#c93b3b]"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

type EditDetailsProps = {
  playlist: PlaylistSummary
  cover: string
  isEmpty: boolean
  onClose: () => void
  onSave: (input: { name: string; description: string }) => Promise<void>
}

function EditDetails({ playlist, cover, isEmpty, onClose, onSave }: EditDetailsProps) {
  const [name, setName] = useState(playlist.name)
  const [description, setDescription] = useState(playlist.description ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      await onSave({ name: trimmed, description: description.trim() })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-[760px] flex-col gap-5 rounded-lg bg-[#282828] p-7"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-white">Editar detalhes</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-5">
          {isEmpty ? (
            <div className="grid h-[200px] w-[200px] shrink-0 place-items-center rounded bg-[#3e3e3e] text-neutral-400 shadow-[0_4px_60px_rgba(0,0,0,0.5)]">
              <MusicNote className="h-16 w-16" />
            </div>
          ) : (
            <img src={cover} alt="" className="h-[200px] w-[200px] shrink-0 rounded object-cover shadow-[0_4px_60px_rgba(0,0,0,0.5)]" />
          )}
          <div className="flex flex-1 flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              className="rounded bg-[#3e3e3e] px-3 py-3 text-base text-white outline-none focus:bg-[#4a4a4a]"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição opcional"
              className="h-[140px] resize-none rounded bg-[#3e3e3e] px-3 py-3 text-base text-white outline-none focus:bg-[#4a4a4a]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-neutral-500 px-4 py-1.5 text-xs font-semibold text-white hover:border-white"
          >
            <Lock />
            Tornar privada
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Salvar
          </button>
        </div>

        <p className="text-xs font-bold leading-snug text-white">
          Ao continuar, você autoriza o Spotify a acessar a imagem enviada. Certifique-se de que você tem o direito de fazer o upload dessa imagem.
        </p>
      </div>
    </div>
  )
}

type PlaylistProps = {
  playlist: PlaylistSummary
  playlistsKey: number
  onDeleted: () => void
  onUpdated: (updated: PlaylistSummary) => void
  onTracksChanged: () => void
}

function Playlist({ playlist, playlistsKey, onDeleted, onUpdated, onTracksChanged }: PlaylistProps) {
  const { data: full } = useApi(() => getPlaylist(playlist.id), [playlist.id, playlistsKey])
  const { data: artists } = useApi(getRecentArtists)
  const { data: albums } = useApi(getRecentAlbums)
  const { play } = usePlayer()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const handleRemoveTrack = async (musicId: string) => {
    try {
      await removeMusicFromPlaylist(playlist.id, musicId)
      onTracksChanged()
    } catch {
      // ignore
    }
  }

  const tracks = full?.musics ?? []
  const artistById = new Map((artists ?? []).map((a) => [a.id, a]))
  const albumById = new Map((albums ?? []).map((a) => [a.id, a]))

  const musicQtd = full?.musicQtd ?? playlist.musicQtd
  const duration = full?.duration ?? playlist.duration
  const isEmpty = musicQtd === 0

  const isLikedPlaylist = playlist.name === 'Músicas Curtidas'
  const cover = isLikedPlaylist ? favoritesCover : playlistCover

  const handleDelete = async () => {
    setConfirmOpen(false)
    try {
      await deletePlaylist(playlist.id)
      onDeleted()
    } catch {
      // ignore
    }
  }

  const handleSaveEdit = async (input: { name: string; description: string }) => {
    try {
      const updated = await updatePlaylistAttributes(playlist.id, input)
      onUpdated(updated)
      setEditOpen(false)
    } catch {
      // ignore
    }
  }

  return (
    <>
    <div className="flex h-full flex-col gap-3">
      <div className="-mx-5 -mt-6 flex items-end gap-4 bg-gradient-to-b from-[#535353] to-[#1a1a1a] px-5 pt-10 pb-4">
        {isEmpty ? (
          <div className="grid h-[160px] w-[160px] shrink-0 place-items-center rounded bg-[#282828] text-neutral-400 shadow-[0_4px_60px_rgba(0,0,0,0.5)]">
            <MusicNote className="h-14 w-14" />
          </div>
        ) : (
          <img src={cover} alt="" className="h-[160px] w-[160px] shrink-0 rounded shadow-[0_4px_60px_rgba(0,0,0,0.5)] object-cover" />
        )}
        <div className="flex min-w-0 flex-col pb-2">
          <p className="text-xs font-semibold leading-none text-white">Playlist pública</p>
          <h1 className="mt-2 truncate text-7xl font-bold leading-none text-white">{playlist.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white">
            <img src={profilePhoto} alt="" className="h-4 w-4 rounded-full object-cover" />
            Vitoria Tenorio
            {!isEmpty && (
              <span className="font-normal text-white/80">
                {' • '}
                {musicQtd} músicas, {formatPlaylistDuration(duration)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {isEmpty ? (
          <div />
        ) : (
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-[#1FDF64] text-black transition hover:scale-105"
            aria-label="Reproduzir"
          >
            <PlayArrow />
          </button>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditOpen(true)}
            className="text-neutral-400 hover:text-white"
            aria-label="Editar detalhes"
            title="Editar detalhes"
          >
            <Pen />
          </button>
          {!isLikedPlaylist && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="text-neutral-400 hover:text-white"
              aria-label="Excluir playlist"
              title="Excluir playlist"
            >
              <Trash />
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-white">Nenhuma música adicionada ainda</p>
          <p className="text-xs font-normal text-neutral-400">Adicione músicas para começar</p>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-1">
            <div className="grid grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] items-center gap-3 border-b border-neutral-800 px-2 pb-2 text-xs font-normal text-neutral-400">
              <span>#</span>
              <span>Título</span>
              <span>Álbum</span>
              <span>Adicionada em</span>
              <span className="flex justify-end"><Clock /></span>
              <span />
            </div>
            <ul className="flex flex-col">
              {tracks.map((t, i) => {
                const artist = artistById.get(t.artistId)
                const album = albumById.get(t.albumId)
                return (
                  <li
                    key={t.id}
                    onClick={() => play(t, { artist, queue: tracks })}
                    className="grid h-12 cursor-pointer grid-cols-[20px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_60px_24px] items-center gap-3 rounded px-2 text-xs hover:bg-neutral-900"
                  >
                    <span className="text-neutral-400">{i + 1}</span>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <img src={songCover} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight text-white">{t.title}</p>
                        <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">
                          {artist?.name ?? 'Artista'}
                        </p>
                      </div>
                    </div>
                    <p className="truncate font-semibold text-white">{album?.title ?? '—'}</p>
                    <p className="truncate text-neutral-400">{formatPtDate(t.createdAt)}</p>
                    <p className="text-right text-neutral-400">{formatDuration(t.duration)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveTrack(t.id)
                      }}
                      className="text-neutral-400 hover:text-white"
                      aria-label="Remover desta playlist"
                      title="Remover desta playlist"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}
    </div>
    {confirmOpen && (
      <ConfirmDelete
        playlistName={playlist.name}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    )}
    {editOpen && (
      <EditDetails
        playlist={playlist}
        cover={cover}
        isEmpty={isEmpty}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />
    )}
    </>
  )
}

export default Playlist

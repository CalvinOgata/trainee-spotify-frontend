import { useEffect, useState } from 'react'
import favoritesCover from '../assets/images/favorites_default.png'
import playlistCover from '../assets/images/playlist_default.png'
import { Lock, MusicNote, X } from './icons'
import { resolveImageUrl } from '../lib/api'
import type { PlaylistSummary } from '../lib/types'

type EditPlaylistDetailsModalProps = {
  playlist: PlaylistSummary
  onClose: () => void
  onSave: (input: { name: string; description: string }) => Promise<void>
}

function EditPlaylistDetailsModal({ playlist, onClose, onSave }: EditPlaylistDetailsModalProps) {
  const [name, setName] = useState(playlist.name)
  const [description, setDescription] = useState(playlist.description ?? '')
  const [saving, setSaving] = useState(false)

  const isLikedPlaylist = playlist.name === 'Músicas Curtidas'
  const cover = resolveImageUrl(playlist.imageUrl) ?? (isLikedPlaylist ? favoritesCover : playlistCover)
  const isEmpty = playlist.musicQtd === 0

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-[760px] flex-col gap-5 overflow-y-auto rounded-lg bg-[#282828] p-5 sm:p-7"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-white">Editar detalhes</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row">
          {isEmpty ? (
            <div className="grid h-[200px] w-[200px] shrink-0 place-items-center self-center rounded bg-[#3e3e3e] text-neutral-400 shadow-[0_4px_60px_rgba(0,0,0,0.5)] sm:self-auto">
              <MusicNote className="h-16 w-16" />
            </div>
          ) : (
            <img
              src={cover}
              alt=""
              className="h-[200px] w-[200px] shrink-0 self-center rounded object-cover shadow-[0_4px_60px_rgba(0,0,0,0.5)] sm:self-auto"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
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
          Ao continuar, você autoriza o Spotify a acessar a imagem enviada. Certifique-se de que você
          tem o direito de fazer o upload dessa imagem.
        </p>
      </div>
    </div>
  )
}

export default EditPlaylistDetailsModal

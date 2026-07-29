import { useState } from 'react'
import favoritesCover from '../../assets/images/favorites_default.png'
import playlistCover from '../../assets/images/playlist_default.png'
import { Lock } from '../icons'
import { ModalShell } from './ModalShell'
import { resolveImageUrl } from '../../lib/api'
import { useLibrary } from '../../lib/LibraryContext'
import type { PlaylistSummary } from '../../lib/types'

type EditPlaylistDetailsModalProps = {
  playlist: PlaylistSummary
  title?: string
  onClose: () => void
  onSave: (input: { name: string; description: string }) => Promise<void>
}

function EditPlaylistDetailsModal({ playlist, title = 'Editar detalhes', onClose, onSave }: EditPlaylistDetailsModalProps) {
  const [name, setName] = useState(playlist.name)
  const [description, setDescription] = useState(playlist.description ?? '')
  const [saving, setSaving] = useState(false)
  const { isPlaylistPrivate, togglePlaylistPrivate } = useLibrary()
  const isPrivate = isPlaylistPrivate(playlist.id)

  const isLikedPlaylist = playlist.name === 'Músicas Curtidas'
  const cover = resolveImageUrl(playlist.imageUrl) ?? (isLikedPlaylist ? favoritesCover : playlistCover)

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
    <ModalShell
      onClose={onClose}
      header={<h2 className="font-[Inter] text-[16px] font-bold text-white">{title}</h2>}
      maxWidth="396px"
      contentClassName="gap-4 min-h-[297px]"
    >
      <div className="flex gap-4">
        <img
          src={cover}
          alt=""
          className="h-[134px] w-[134px] shrink-0 rounded object-cover shadow-[0_4px_60px_rgba(0,0,0,0.5)]"
        />
        <div className="flex h-[131px] w-[210px] shrink-0 flex-col gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="rounded bg-[#3e3e3e] px-3 py-2 font-[Inter] text-[10px] font-medium text-white outline-none focus:bg-[#4a4a4a]"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Adicione uma descrição opcional"
            className="flex-1 resize-none rounded bg-[#3e3e3e] px-3 py-2 font-[Inter] text-[10px] font-medium text-white outline-none focus:bg-[#4a4a4a]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => togglePlaylistPrivate(playlist.id)}
          className="flex h-[26px] w-[114px] items-center justify-center gap-1 whitespace-nowrap rounded-[16px] border border-neutral-500 px-3 py-1.5 font-[Inter] text-[10px] font-bold text-white hover:border-white"
        >
          <Lock className="h-[14px] w-[14px]" />
          {isPrivate ? 'Tornar pública' : 'Tornar privada'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="flex h-[36px] w-[83px] items-center justify-center gap-1 rounded-[16px] bg-white px-3 py-1.5 font-[Inter] text-[12px] font-bold text-black hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Salvar
        </button>
      </div>

      <p className="font-[Inter] text-[8px] font-bold leading-snug text-white">
        Ao continuar, você autoriza o Spotify a acessar a imagem enviada. Certifique-se de que você
        tem o direito de fazer o upload dessa imagem.
      </p>
    </ModalShell>
  )
}

export default EditPlaylistDetailsModal

import { useEffect } from 'react'
import { X } from './icons'

type ConfirmDeletePlaylistModalProps = {
  playlistName: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDeletePlaylistModal({
  playlistName,
  onConfirm,
  onCancel,
}: ConfirmDeletePlaylistModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[420px] flex-col gap-4 rounded-lg bg-[#282828] p-5"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-white">Excluir playlist?</h2>
          <button onClick={onCancel} aria-label="Fechar" className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm font-normal text-neutral-300">
          Tem certeza que deseja excluir <span className="font-semibold text-white">{playlistName}</span>?
          Esta ação não pode ser desfeita.
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

export default ConfirmDeletePlaylistModal

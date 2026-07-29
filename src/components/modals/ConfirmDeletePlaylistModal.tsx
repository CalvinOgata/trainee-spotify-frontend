import { useEffect } from 'react'

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
        style={{ width: 432, height: 173, padding: 40, gap: 16, borderRadius: 12, background: '#FFFFFF' }}
        className="flex flex-col"
      >
        <h2 className="font-[Inter] text-[18px] font-bold text-[#121212]">
          Apagar da sua biblioteca?
        </h2>
        <p className="font-[Inter] text-[12px] font-medium text-[#121212]">
          A playlist <span className="font-bold">{playlistName}</span> será excluída da sua biblioteca.
        </p>
        <div className="mt-auto flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            style={{ padding: '6px 12px', borderRadius: 16 }}
            className="bg-white font-[Inter] text-[12px] font-bold text-black transition-colors hover:bg-[#EDEDED]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ width: 83, height: 36, padding: '6px 12px', gap: 4, borderRadius: 16 }}
            className="flex items-center justify-center bg-[#D03930] font-[Inter] text-[12px] font-bold text-white transition-colors hover:bg-[#B02F27]"
          >
            Apagar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeletePlaylistModal

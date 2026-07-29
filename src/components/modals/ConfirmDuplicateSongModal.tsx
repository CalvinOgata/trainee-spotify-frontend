import { useEffect } from 'react'

type ConfirmDuplicateSongModalProps = {
  playlistName: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDuplicateSongModal({
  playlistName,
  onConfirm,
  onCancel,
}: ConfirmDuplicateSongModalProps) {
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
      onMouseDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 432, padding: 40, gap: 16, borderRadius: 12, background: '#FFFFFF' }}
        className="flex flex-col"
      >
        <h2 className="font-[Inter] text-[18px] font-bold text-[#121212]">
          Adicionar novamente?
        </h2>
        <p className="font-[Inter] text-[12px] font-medium text-[#121212]">
          Essa música já está na playlist <span className="font-bold">{playlistName}</span>. Deseja adicionar mesmo assim?
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
            className="flex items-center justify-center bg-[#1FDF64] font-[Inter] text-[12px] font-bold text-black transition-colors hover:bg-[#17B851]"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDuplicateSongModal

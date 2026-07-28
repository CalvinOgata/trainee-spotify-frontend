import { ModalShell } from './ModalShell'

type ConfirmDuplicateSongModalProps = {
  songTitle: string
  playlistName: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDuplicateSongModal({
  songTitle,
  playlistName,
  onConfirm,
  onCancel,
}: ConfirmDuplicateSongModalProps) {
  return (
    <ModalShell
      onClose={onCancel}
      header={<h2 className="text-lg font-bold text-white">Adicionar novamente?</h2>}
      contentClassName="gap-4"
    >
      <p className="text-sm font-normal text-neutral-300">
        <span className="font-semibold text-white">{songTitle}</span> já está em{' '}
        <span className="font-semibold text-white">{playlistName}</span>. Deseja adicionar mesmo assim?
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
          className="rounded-full bg-[#1FDF64] px-4 py-1.5 text-xs font-semibold text-black hover:brightness-110"
        >
          Adicionar
        </button>
      </div>
    </ModalShell>
  )
}

export default ConfirmDuplicateSongModal

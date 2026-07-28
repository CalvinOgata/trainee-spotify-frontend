import { ModalShell } from './ModalShell'

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
  return (
    <ModalShell
      onClose={onCancel}
      header={<h2 className="text-lg font-bold text-white">Excluir playlist?</h2>}
      contentClassName="gap-4"
    >
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
    </ModalShell>
  )
}

export default ConfirmDeletePlaylistModal

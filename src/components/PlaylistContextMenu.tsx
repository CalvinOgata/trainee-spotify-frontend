import { useState } from 'react'
import { deletePlaylist, updatePlaylistAttributes } from '../lib/endpoints'
import { useLibrary } from '../lib/LibraryContext'
import type { PlaylistSummary } from '../lib/types'
import ConfirmDeletePlaylistModal from './ConfirmDeletePlaylistModal'
import { ContextMenuShell, MenuItem } from './ContextMenuShell'
import EditPlaylistDetailsModal from './EditPlaylistDetailsModal'
import { EditPlaylist, LockIcon, Pin, RemovePlaylist } from './icons'

type PlaylistContextMenuProps = {
  playlist: PlaylistSummary
  x: number
  y: number
  onClose: () => void
  onDeleted: (id: string) => void
  onUpdated: (updated: PlaylistSummary) => void
}

function PlaylistContextMenu({
  playlist,
  x,
  y,
  onClose,
  onDeleted,
  onUpdated,
}: PlaylistContextMenuProps) {
  const { isPlaylistPinned, togglePlaylistPinned, isPlaylistPrivate, togglePlaylistPrivate } =
    useLibrary()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const isLiked = playlist.name === 'Músicas Curtidas'
  const pinned = isPlaylistPinned(playlist.id)
  const priv = isPlaylistPrivate(playlist.id)

  const handleDelete = async () => {
    setConfirmOpen(false)
    try {
      await deletePlaylist(playlist.id)
      onDeleted(playlist.id)
    } catch {
      // ignore
    }
    onClose()
  }

  const handleSaveEdit = async (input: { name: string; description: string }) => {
    try {
      const updated = await updatePlaylistAttributes(playlist.id, input)
      onUpdated(updated)
    } catch {
      // ignore
    }
    setEditOpen(false)
    onClose()
  }

  const handlePrivateToggle = () => {
    togglePlaylistPrivate(playlist.id)
    onClose()
  }

  const handlePinToggle = () => {
    togglePlaylistPinned(playlist.id)
    onClose()
  }

  return (
    <>
      {!confirmOpen && !editOpen && (
        <ContextMenuShell x={x} y={y} onClose={onClose} width={240}>
          <MenuItem
            icon={<EditPlaylist />}
            label="Editar os detalhes"
            onClick={() => setEditOpen(true)}
          />
          {!isLiked && (
            <MenuItem
              icon={<RemovePlaylist />}
              label="Apagar playlist"
              onClick={() => setConfirmOpen(true)}
            />
          )}
          <MenuItem
            icon={<LockIcon />}
            label={priv ? 'Tornar pública' : 'Tornar particular'}
            onClick={handlePrivateToggle}
          />
          {!isLiked && (
            <MenuItem
              icon={<Pin className="h-4 w-4 text-[#1FDF64]" />}
              label={pinned ? 'Remover pin da playlist' : 'Fixar playlist'}
              onClick={handlePinToggle}
            />
          )}
        </ContextMenuShell>
      )}
      {confirmOpen && (
        <ConfirmDeletePlaylistModal
          playlistName={playlist.name}
          onConfirm={handleDelete}
          onCancel={() => {
            setConfirmOpen(false)
            onClose()
          }}
        />
      )}
      {editOpen && (
        <EditPlaylistDetailsModal
          playlist={playlist}
          onClose={() => {
            setEditOpen(false)
            onClose()
          }}
          onSave={handleSaveEdit}
        />
      )}
    </>
  )
}

export default PlaylistContextMenu

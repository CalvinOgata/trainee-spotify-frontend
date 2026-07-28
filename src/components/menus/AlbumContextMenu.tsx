import { useLibrary } from '../../lib/LibraryContext'
import type { AlbumSummary, Artist } from '../../lib/types'
import { ContextMenuShell, MenuItem } from './ContextMenuShell'
import { AddLikedSongs, AlreadyAdded, GoToArtist, Pin } from '../icons'

type AlbumContextMenuProps = {
  album: AlbumSummary
  x: number
  y: number
  onClose: () => void
  onArtistClick: (artist: Artist) => void
}

function AlbumContextMenu({ album, x, y, onClose, onArtistClick }: AlbumContextMenuProps) {
  const { isAlbumSaved, toggleAlbumSaved, isAlbumPinned, toggleAlbumPinned } = useLibrary()

  const saved = isAlbumSaved(album.id)
  const pinned = isAlbumPinned(album.id)

  const handleSaveToggle = () => {
    toggleAlbumSaved(album)
    onClose()
  }

  const handlePinToggle = () => {
    toggleAlbumPinned(album)
    onClose()
  }

  const handleGoArtist = () => {
    const artist: Artist = {
      id: album.artistId,
      name: album.artistName,
      listeners: 0,
      about: null,
      imageUrl: null,
      createdAt: album.createdAt,
      updatedAt: null,
    }
    onArtistClick(artist)
    onClose()
  }

  return (
    <ContextMenuShell x={x} y={y} onClose={onClose} width={260}>
      <MenuItem
        icon={saved ? <AlreadyAdded /> : <AddLikedSongs />}
        label={saved ? 'Remover da sua biblioteca' : 'Adicionar à sua biblioteca'}
        onClick={handleSaveToggle}
      />
      <MenuItem
        icon={<Pin className="h-4 w-4 text-[#1FDF64]" />}
        label={pinned ? 'Remover pin do álbum' : 'Fixar álbum'}
        onClick={handlePinToggle}
      />
      <MenuItem icon={<GoToArtist />} label="Ir para o artista" onClick={handleGoArtist} />
    </ContextMenuShell>
  )
}

export default AlbumContextMenu

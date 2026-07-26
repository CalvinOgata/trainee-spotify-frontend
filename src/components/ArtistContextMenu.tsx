import { useLibrary } from '../lib/LibraryContext'
import type { Artist } from '../lib/types'
import { ContextMenuShell, MenuItem } from './ContextMenuShell'
import { Pin, X } from './icons'

type ArtistContextMenuProps = {
  artist: Artist
  x: number
  y: number
  onClose: () => void
}

function ArtistContextMenu({ artist, x, y, onClose }: ArtistContextMenuProps) {
  const { isFollowed, toggleFollowed, isPinned, togglePinned } = useLibrary()

  const followed = isFollowed(artist.id)
  const pinned = isPinned(artist.id)

  const handleFollowToggle = () => {
    toggleFollowed(artist)
    onClose()
  }

  const handlePinToggle = () => {
    togglePinned(artist)
    onClose()
  }

  return (
    <ContextMenuShell x={x} y={y} onClose={onClose} width={240}>
      <MenuItem
        icon={<X className={`h-3.5 w-3.5 ${followed ? 'text-[#67C260]' : ''}`} />}
        label={followed ? 'Deixar de seguir' : 'Seguir'}
        onClick={handleFollowToggle}
      />
      <MenuItem
        icon={<Pin className="h-4 w-4 text-[#1FDF64]" />}
        label={pinned ? 'Remover pin do artista' : 'Fixar artista'}
        onClick={handlePinToggle}
      />
    </ContextMenuShell>
  )
}

export default ArtistContextMenu

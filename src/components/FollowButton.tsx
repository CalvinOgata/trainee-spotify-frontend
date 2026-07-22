import followIcon from '../assets/icons/Follow.svg'
import followHoveringIcon from '../assets/icons/FollowHovering.svg'
import followingIcon from '../assets/icons/Following.svg'
import unfollowIcon from '../assets/icons/Unfollow.svg'
import { useLibrary } from '../lib/LibraryContext'
import type { Artist } from '../lib/types'

type FollowButtonProps = {
  artist: Artist
  className?: string
}

function FollowButton({ artist, className = '' }: FollowButtonProps) {
  const { isFollowed, toggleFollowed } = useLibrary()
  const followed = isFollowed(artist.id)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFollowed(artist)
      }}
      aria-label={followed ? 'Deixar de seguir' : 'Seguir'}
      className={`group relative h-6 w-[104px] shrink-0 ${className}`}
    >
      <img
        src={followIcon}
        alt=""
        className={`absolute inset-0 h-6 w-[104px] transition-opacity duration-200 ${
          followed ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
        }`}
      />
      <img
        src={followHoveringIcon}
        alt=""
        className={`absolute inset-0 h-6 w-[104px] transition-opacity duration-200 ${
          followed ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
      <img
        src={followingIcon}
        alt=""
        className={`absolute inset-0 h-6 w-[104px] transition-opacity duration-200 ${
          followed ? 'opacity-100 group-hover:opacity-0' : 'opacity-0'
        }`}
      />
      <img
        src={unfollowIcon}
        alt=""
        className={`absolute inset-0 h-6 w-[104px] transition-opacity duration-200 ${
          followed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  )
}

export default FollowButton

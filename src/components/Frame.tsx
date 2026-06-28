import Library from './Library'
import MainSection from './MainSection'
import SongPanel from './SongPanel'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import Profile from '../pages/Profile'
import Artist from '../pages/Artist'
import Playlist from '../pages/Playlist'
import type { Page } from '../App'
import type { Artist as ArtistDTO, PlaylistSummary } from '../lib/types'

type FrameProps = {
  query: string
  page: Page
  selectedArtist: ArtistDTO | null
  selectedPlaylist: PlaylistSummary | null
  onArtistClick: (artist: ArtistDTO) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onPlaylistDeleted: () => void
  onPlaylistUpdated: (updated: PlaylistSummary) => void
  playlistsKey: number
  onPlaylistCreated: () => void
}

function Frame({
  query,
  page,
  selectedArtist,
  selectedPlaylist,
  onArtistClick,
  onPlaylistClick,
  onPlaylistDeleted,
  onPlaylistUpdated,
  playlistsKey,
  onPlaylistCreated,
}: FrameProps) {
  return (
    <div className="flex justify-center gap-2 overflow-hidden py-[14.5px]">
      <Library
        onArtistClick={onArtistClick}
        onPlaylistClick={onPlaylistClick}
        playlistsKey={playlistsKey}
        onPlaylistCreated={onPlaylistCreated}
      />
      <MainSection>
        {page === 'home' && (
          <Home onArtistClick={onArtistClick} onPlaylistClick={onPlaylistClick} />
        )}
        {page === 'search' && (
          <SearchResults
            query={query}
            onArtistClick={onArtistClick}
            onPlaylistClick={onPlaylistClick}
          />
        )}
        {page === 'profile' && (
          <Profile onArtistClick={onArtistClick} onPlaylistClick={onPlaylistClick} />
        )}
        {page === 'artist' && selectedArtist && <Artist artist={selectedArtist} />}
        {page === 'playlist' && selectedPlaylist && (
          <Playlist
            playlist={selectedPlaylist}
            playlistsKey={playlistsKey}
            onDeleted={onPlaylistDeleted}
            onUpdated={onPlaylistUpdated}
            onTracksChanged={onPlaylistCreated}
          />
        )}
      </MainSection>
      <SongPanel />
    </div>
  )
}

export default Frame

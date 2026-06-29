import Library from './Library'
import MainSection from './MainSection'
import SongPanel from './SongPanel'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import Profile from '../pages/Profile'
import Artist from '../pages/Artist'
import Playlist from '../pages/Playlist'
import Album from '../pages/Album'
import type { Page } from '../App'
import type { AlbumSummary, Artist as ArtistDTO, PlaylistSummary } from '../lib/types'

type FrameProps = {
  query: string
  page: Page
  selectedArtist: ArtistDTO | null
  selectedPlaylist: PlaylistSummary | null
  selectedAlbum: AlbumSummary | null
  onArtistClick: (artist: ArtistDTO) => void
  onPlaylistClick: (playlist: PlaylistSummary) => void
  onAlbumClick: (album: AlbumSummary) => void
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
  selectedAlbum,
  onArtistClick,
  onPlaylistClick,
  onAlbumClick,
  onPlaylistDeleted,
  onPlaylistUpdated,
  playlistsKey,
  onPlaylistCreated,
}: FrameProps) {
  return (
    <div className="flex min-h-0 gap-2 overflow-hidden px-2 py-[14.5px]">
      <Library
        onArtistClick={onArtistClick}
        onPlaylistClick={onPlaylistClick}
        onAlbumClick={onAlbumClick}
        playlistsKey={playlistsKey}
        onPlaylistCreated={onPlaylistCreated}
      />
      <MainSection>
        {page === 'home' && (
          <Home
            onArtistClick={onArtistClick}
            onPlaylistClick={onPlaylistClick}
            onAlbumClick={onAlbumClick}
          />
        )}
        {page === 'search' && (
          <SearchResults
            query={query}
            onArtistClick={onArtistClick}
            onPlaylistClick={onPlaylistClick}
            onAlbumClick={onAlbumClick}
          />
        )}
        {page === 'profile' && (
          <Profile onArtistClick={onArtistClick} onPlaylistClick={onPlaylistClick} />
        )}
        {page === 'artist' && selectedArtist && (
          <Artist artist={selectedArtist} onAlbumClick={onAlbumClick} />
        )}
        {page === 'playlist' && selectedPlaylist && (
          <Playlist
            playlist={selectedPlaylist}
            playlistsKey={playlistsKey}
            onDeleted={onPlaylistDeleted}
            onUpdated={onPlaylistUpdated}
            onTracksChanged={onPlaylistCreated}
          />
        )}
        {page === 'album' && selectedAlbum && <Album album={selectedAlbum} />}
      </MainSection>
      <SongPanel />
    </div>
  )
}

export default Frame

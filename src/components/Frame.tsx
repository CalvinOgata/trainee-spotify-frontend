import Library from './Library'
import MainSection from './MainSection'
import SongPanel from './SongPanel'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import Profile from '../pages/Profile'
import Artist from '../pages/Artist'
import type { Page } from '../App'
import type { Artist as ArtistDTO } from '../lib/types'

type FrameProps = {
  query: string
  page: Page
  selectedArtist: ArtistDTO | null
  onArtistClick: (artist: ArtistDTO) => void
}

function Frame({ query, page, selectedArtist, onArtistClick }: FrameProps) {
  return (
    <div className="flex justify-center gap-2 overflow-hidden py-[14.5px]">
      <Library onArtistClick={onArtistClick} />
      <MainSection>
        {page === 'home' && <Home onArtistClick={onArtistClick} />}
        {page === 'search' && <SearchResults query={query} onArtistClick={onArtistClick} />}
        {page === 'profile' && <Profile onArtistClick={onArtistClick} />}
        {page === 'artist' && selectedArtist && <Artist artist={selectedArtist} />}
      </MainSection>
      <SongPanel />
    </div>
  )
}

export default Frame

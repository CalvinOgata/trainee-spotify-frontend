import Library from './Library'
import MainSection from './MainSection'
import SongPanel from './SongPanel'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import Profile from '../pages/Profile'
import Artist from '../pages/Artist'
import type { Page } from '../App'

type FrameProps = {
  query: string
  page: Page
  onArtistClick: () => void
}

function Frame({ query, page, onArtistClick }: FrameProps) {
  return (
    <div className="flex justify-center gap-2 overflow-hidden py-[14.5px]">
      <Library />
      <MainSection>
        {page === 'home' && <Home onArtistClick={onArtistClick} />}
        {page === 'search' && <SearchResults query={query} />}
        {page === 'profile' && <Profile onArtistClick={onArtistClick} />}
        {page === 'artist' && <Artist />}
      </MainSection>
      <SongPanel />
    </div>
  )
}

export default Frame

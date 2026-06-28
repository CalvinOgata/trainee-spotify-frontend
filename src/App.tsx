import { useState } from 'react'
import { flushSync } from 'react-dom'
import Navbar from './components/Navbar'
import Frame from './components/Frame'
import Player from './components/Player'
import PlayingSong from './pages/PlayingSong'
import type { AlbumSummary, Artist, PlaylistSummary } from './lib/types'

export type Page = 'home' | 'search' | 'profile' | 'artist' | 'playlist' | 'album'

function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState<Page>('home')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSummary | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumSummary | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playlistsKey, setPlaylistsKey] = useState(0)
  const refreshPlaylists = () => setPlaylistsKey((k) => k + 1)

  const handleQueryChange = (q: string) => {
    setQuery(q)
    if (q) setPage('search')
  }

  const goHome = () => {
    setQuery('')
    setPage('home')
  }

  const goProfile = () => {
    setQuery('')
    setPage('profile')
  }

  const goArtist = (artist: Artist) => {
    setQuery('')
    setSelectedArtist(artist)
    setPage('artist')
  }

  const goPlaylist = (playlist: PlaylistSummary) => {
    setQuery('')
    setSelectedPlaylist(playlist)
    setPage('playlist')
  }

  const goAlbum = (album: AlbumSummary) => {
    setQuery('')
    setSelectedAlbum(album)
    setPage('album')
  }

  const handlePlaylistDeleted = () => {
    setSelectedPlaylist(null)
    refreshPlaylists()
    setPage('home')
  }

  const handlePlaylistUpdated = (updated: PlaylistSummary) => {
    setSelectedPlaylist(updated)
    refreshPlaylists()
  }

  const toggleFullscreen = () => {
    const next = !isFullscreen
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown
    }
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        flushSync(() => setIsFullscreen(next))
      })
    } else {
      setIsFullscreen(next)
    }
  }

  return (
    <div className="grid h-screen w-screen grid-rows-[60px_minmax(0,1fr)_64px] bg-black font-sans text-white overflow-hidden">
      {isFullscreen ? (
        <div className="row-span-2 min-h-0">
          <PlayingSong />
        </div>
      ) : (
        <>
          <Navbar
            query={query}
            onQueryChange={handleQueryChange}
            onHomeClick={goHome}
            onProfileClick={goProfile}
          />
          <Frame
            query={query}
            page={page}
            selectedArtist={selectedArtist}
            selectedPlaylist={selectedPlaylist}
            selectedAlbum={selectedAlbum}
            onArtistClick={goArtist}
            onPlaylistClick={goPlaylist}
            onAlbumClick={goAlbum}
            onPlaylistDeleted={handlePlaylistDeleted}
            onPlaylistUpdated={handlePlaylistUpdated}
            playlistsKey={playlistsKey}
            onPlaylistCreated={refreshPlaylists}
          />
        </>
      )}
      <Player
        onFullscreenClick={toggleFullscreen}
        isFullscreen={isFullscreen}
        playlistsKey={playlistsKey}
        onPlaylistsChanged={refreshPlaylists}
      />
    </div>
  )
}

export default App

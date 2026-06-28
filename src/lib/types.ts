export type PlaylistSummary = {
  id: string
  name: string
  description: string | null
  musicQtd: number
  duration: number
  createdAt: string
  updatedAt: string | null
}

export type Music = {
  id: string
  title: string
  artistId: string
  albumId: string
  playlistsId: string[]
  duration: number
  releaseDate: string
  timesListen: number
  explicit: boolean | null
  createdAt: string
  updatedAt: string | null
}

export type Playlist = {
  id: string
  name: string
  description: string | null
  musicQtd: number
  duration: number
  musics: Music[]
  createdAt: string
  updatedAt: string | null
}

export type Artist = {
  id: string
  name: string
  listeners: number
  about: string | null
  createdAt: string
  updatedAt: string | null
}

export type AlbumSummary = {
  id: string
  title: string
  year: string | null
  artistId: string
  artistName: string
  createdAt: string
  updatedAt: string | null
}

export type Album = AlbumSummary & {
  musics: Music[]
}

export type CreatePlaylistInput = {
  name: string
  description: string
}

export type PutPlaylistInput = {
  name: string
  description: string
}

export type SearchResponse = {
  musics: Music[]
  playlists: PlaylistSummary[]
  artists: Artist[]
  albums: AlbumSummary[]
}

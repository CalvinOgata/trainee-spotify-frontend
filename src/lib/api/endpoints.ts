import { api } from './client'
import type {
  Album,
  AlbumSummary,
  Artist,
  CreatePlaylistInput,
  Music,
  Playlist,
  PlaylistSummary,
  PutPlaylistInput,
  SearchResponse,
} from './types'

// /user
export const getUserPlaylists = () => api.get<PlaylistSummary[]>('/user/playlists')
export const getRecentArtists = () => api.get<Artist[]>('/user/recentArtists')
export const getMostPlayedArtists = () => api.get<Artist[]>('/user/mostPlayedArtists')
export const getRecentMusics = () => api.get<Music[]>('/user/recentMusics')
export const getMostPlayedMusics = () => api.get<Music[]>('/user/mostPlayedMusics')
export const getRecentAlbums = () => api.get<AlbumSummary[]>('/user/recentAlbums')
export const getFollowers = () => api.get<string[]>('/user/followers')

export type PlayKind = 'music' | 'album' | 'artist' | 'playlist'
export const postPlay = (kind: PlayKind, id: string) =>
  api.post<void>('/user/plays', { kind, id })

// /user/saved*
export const getSavedMusics = () => api.get<Music[]>('/user/savedMusics')
export const saveMusic = (id: string) => api.post<void>(`/user/savedMusics/${id}`, {})
export const unsaveMusic = (id: string) => api.delete<void>(`/user/savedMusics/${id}`)
export const getSavedAlbums = () => api.get<AlbumSummary[]>('/user/savedAlbums')
export const saveAlbum = (id: string) => api.post<void>(`/user/savedAlbums/${id}`, {})
export const unsaveAlbum = (id: string) => api.delete<void>(`/user/savedAlbums/${id}`)
export const getFollowedArtists = () => api.get<Artist[]>('/user/followedArtists')
export const followArtist = (id: string) => api.post<void>(`/user/followedArtists/${id}`, {})
export const unfollowArtist = (id: string) => api.delete<void>(`/user/followedArtists/${id}`)

// /playlist
export const getPlaylist = (id: string) => api.get<Playlist>(`/playlist/${id}`)
export const createPlaylist = (body: CreatePlaylistInput) =>
  api.post<PlaylistSummary>('/playlist', body)
export const updatePlaylistAttributes = (id: string, body: PutPlaylistInput) =>
  api.put<PlaylistSummary>(`/playlist/${id}/attributes`, body)
export const togglePlaylistMusic = (playlistId: string, musicId: string) =>
  api.patch<Playlist>(`/playlist/${playlistId}/${musicId}`)
export const forceAddMusicToPlaylist = (playlistId: string, musicId: string) =>
  api.post<Playlist>(`/playlist/${playlistId}/musics/${musicId}`, {})
export const deletePlaylist = (id: string) => api.delete<void>(`/playlist/${id}`)
export const removeMusicFromPlaylistAt = (playlistId: string, position: number) =>
  api.delete<void>(`/playlist/${playlistId}/positions/${position}`)
export const reorderPlaylist = (
  playlistId: string,
  musicIds: string[],
  options?: { keepalive?: boolean },
) => api.put<Playlist>(`/playlist/${playlistId}/order`, { musicIds }, options)

// /artist
export const getArtist = (id: string) => api.get<Artist>(`/artist/${id}`)
export const getArtistPopularMusics = (artistId: string, options?: { all?: boolean }) =>
  api.get<Music[]>(`/artist/${artistId}/popularMusics${options?.all ? '?all=true' : ''}`)
export const getArtistAlbums = (artistId: string) =>
  api.get<Album[]>(`/artist/${artistId}/albums`)

// /album
export const getAlbumMusics = (albumId: string) =>
  api.get<Music[]>(`/album/${albumId}/musics`)

// /search
export const search = (q: string, limit?: number) =>
  api.get<SearchResponse>(
    `/search?q=${encodeURIComponent(q)}${limit ? `&limit=${limit}` : ''}`,
  )

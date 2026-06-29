import { api } from './api'
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

// /playlist
export const getPlaylist = (id: string) => api.get<Playlist>(`/playlist/${id}`)
export const createPlaylist = (body: CreatePlaylistInput) =>
  api.post<PlaylistSummary>('/playlist', body)
export const updatePlaylistAttributes = (id: string, body: PutPlaylistInput) =>
  api.put<PlaylistSummary>(`/playlist/${id}/attributes`, body)
export const togglePlaylistMusic = (playlistId: string, musicId: string) =>
  api.patch<Playlist>(`/playlist/${playlistId}/${musicId}`)
export const deletePlaylist = (id: string) => api.delete<void>(`/playlist/${id}`)
export const removeMusicFromPlaylist = (playlistId: string, musicId: string) =>
  api.delete<void>(`/playlist/${playlistId}/${musicId}`)
export const reorderPlaylist = (playlistId: string, musicIds: string[]) =>
  api.put<Playlist>(`/playlist/${playlistId}/order`, { musicIds })

// /artist
export const getArtistPopularMusics = (artistId: string) =>
  api.get<Music[]>(`/artist/${artistId}/popularMusics`)
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

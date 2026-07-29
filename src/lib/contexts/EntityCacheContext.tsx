import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getArtist, getArtistAlbums } from '../api/endpoints'
import type { AlbumSummary, Artist, Music } from '../api/types'

type EntityCacheValue = {
  artistById: Map<string, Artist>
  albumById: Map<string, AlbumSummary>
  addArtists: (list: readonly Artist[]) => void
  addAlbums: (list: readonly AlbumSummary[]) => void
  ensureTracksResolved: (tracks: readonly Music[]) => void
}

const EntityCacheContext = createContext<EntityCacheValue | null>(null)

export function EntityCacheProvider({ children }: { children: ReactNode }) {
  const [artistCache, setArtistCache] = useState<Record<string, Artist>>({})
  const [albumCache, setAlbumCache] = useState<Record<string, AlbumSummary>>({})

  const artistRef = useRef<Record<string, Artist>>({})
  const albumRef = useRef<Record<string, AlbumSummary>>({})
  const inFlightArtists = useRef<Set<string>>(new Set())
  const inFlightAlbumScans = useRef<Set<string>>(new Set())

  const addArtists = useCallback((list: readonly Artist[]) => {
    if (!list.length) return
    const additions: Record<string, Artist> = {}
    for (const a of list) {
      if (!artistRef.current[a.id]) additions[a.id] = a
    }
    if (Object.keys(additions).length === 0) return
    artistRef.current = { ...artistRef.current, ...additions }
    setArtistCache((prev) => ({ ...prev, ...additions }))
  }, [])

  const addAlbums = useCallback((list: readonly AlbumSummary[]) => {
    if (!list.length) return
    const additions: Record<string, AlbumSummary> = {}
    for (const a of list) {
      if (!albumRef.current[a.id]) additions[a.id] = a
    }
    if (Object.keys(additions).length === 0) return
    albumRef.current = { ...albumRef.current, ...additions }
    setAlbumCache((prev) => ({ ...prev, ...additions }))
  }, [])

  const ensureTracksResolved = useCallback((tracks: readonly Music[]) => {
    if (!tracks.length) return

    const missingArtistIds: string[] = []
    const missingAlbumIdSet = new Set<string>()
    for (const t of tracks) {
      if (!artistRef.current[t.artistId] && !inFlightArtists.current.has(t.artistId)) {
        missingArtistIds.push(t.artistId)
      }
      if (!albumRef.current[t.albumId]) {
        missingAlbumIdSet.add(t.albumId)
      }
    }

    const uniqueMissingArtists = Array.from(new Set(missingArtistIds))
    for (const id of uniqueMissingArtists) {
      inFlightArtists.current.add(id)
      getArtist(id)
        .then((a) => {
          artistRef.current = { ...artistRef.current, [id]: a }
          setArtistCache((prev) => ({ ...prev, [id]: a }))
        })
        .catch(() => {})
        .finally(() => {
          inFlightArtists.current.delete(id)
        })
    }

    if (missingAlbumIdSet.size > 0) {
      const artistIdsToScan = new Set<string>()
      for (const t of tracks) {
        if (missingAlbumIdSet.has(t.albumId) && !inFlightAlbumScans.current.has(t.artistId)) {
          artistIdsToScan.add(t.artistId)
        }
      }
      for (const artistId of artistIdsToScan) {
        inFlightAlbumScans.current.add(artistId)
        getArtistAlbums(artistId)
          .then((albums) => {
            const additions: Record<string, AlbumSummary> = {}
            for (const a of albums) {
              if (missingAlbumIdSet.has(a.id) && !albumRef.current[a.id]) {
                const { id, title, year, artistId, artistName, imageUrl, createdAt, updatedAt } = a
                additions[a.id] = { id, title, year, artistId, artistName, imageUrl, createdAt, updatedAt }
              }
            }
            if (Object.keys(additions).length > 0) {
              albumRef.current = { ...albumRef.current, ...additions }
              setAlbumCache((prev) => ({ ...prev, ...additions }))
            }
          })
          .catch(() => {})
          .finally(() => {
            inFlightAlbumScans.current.delete(artistId)
          })
      }
    }
  }, [])

  const artistById = useMemo(
    () => new Map(Object.entries(artistCache)),
    [artistCache],
  )
  const albumById = useMemo(
    () => new Map(Object.entries(albumCache)),
    [albumCache],
  )

  const value = useMemo<EntityCacheValue>(
    () => ({ artistById, albumById, addArtists, addAlbums, ensureTracksResolved }),
    [artistById, albumById, addArtists, addAlbums, ensureTracksResolved],
  )

  return <EntityCacheContext.Provider value={value}>{children}</EntityCacheContext.Provider>
}

export function useEntityCache(): EntityCacheValue {
  const ctx = useContext(EntityCacheContext)
  if (!ctx) throw new Error('useEntityCache must be used inside EntityCacheProvider')
  return ctx
}

type UseTrackEntityMapsOptions = {
  seedArtists?: readonly Artist[] | null
  seedAlbums?: readonly AlbumSummary[] | null
}

export function useTrackEntityMaps(
  tracks: readonly Music[] | null | undefined,
  opts: UseTrackEntityMapsOptions = {},
) {
  const { artistById, albumById, addArtists, addAlbums, ensureTracksResolved } = useEntityCache()
  const { seedArtists, seedAlbums } = opts

  useEffect(() => {
    if (seedArtists && seedArtists.length) addArtists(seedArtists)
  }, [seedArtists, addArtists])

  useEffect(() => {
    if (seedAlbums && seedAlbums.length) addAlbums(seedAlbums)
  }, [seedAlbums, addAlbums])

  useEffect(() => {
    if (tracks && tracks.length) ensureTracksResolved(tracks)
  }, [tracks, ensureTracksResolved])

  return { artistById, albumById }
}

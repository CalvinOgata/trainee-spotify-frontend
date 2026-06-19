import { Dots, Plus } from '../components/icons'

type Result = {
  title: string
  sub: string
  pill: 'Música' | 'Playlist' | 'Álbum' | 'Artista'
  action: 'add' | 'follow'
}

const results: Result[] = [
  { title: 'Touch It', sub: 'Música • Ariana Grande', pill: 'Música', action: 'add' },
  { title: 'touch your heart', sub: 'Playlist • Ariana Grande', pill: 'Playlist', action: 'add' },
  { title: 'Touch', sub: 'Álbum • Katseye', pill: 'Álbum', action: 'add' },
  { title: 'Katseye', sub: 'Artista', pill: 'Artista', action: 'follow' },
  { title: 'Touch It', sub: 'Música • Ariana Grande', pill: 'Música', action: 'add' },
  { title: 'touch your heart', sub: 'Playlist • Ariana Grande', pill: 'Playlist', action: 'add' },
  { title: 'Touch', sub: 'Álbum • Katseye', pill: 'Álbum', action: 'add' },
  { title: 'Katseye', sub: 'Artista', pill: 'Artista', action: 'follow' },
]

type SearchResultsProps = { query: string }

function SearchResults({ query }: SearchResultsProps) {
  const q = query.trim().toLowerCase()
  const filteredResults = q
    ? results.filter(
        (r) => r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q),
      )
    : results

  return (
    <ul className="flex flex-col gap-2">
      {filteredResults.map((r, i) => (
        <li key={i} className="grid grid-cols-[64px_1fr_auto_auto_auto] items-center gap-4 rounded-md px-2 py-1 hover:bg-neutral-900">
          <div className="h-16 w-16 rounded bg-neutral-700" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">{r.title}</p>
            <p className="truncate text-sm font-normal text-neutral-400">{r.sub}</p>
          </div>
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-normal text-neutral-300">
            {r.pill}
          </span>
          <button className="px-2"><Dots /></button>
          {r.action === 'add' ? (
            <button><Plus /></button>
          ) : (
            <button className="rounded-full border border-neutral-500 px-4 py-1 text-xs font-semibold text-white hover:border-white">
              Seguir
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

export default SearchResults

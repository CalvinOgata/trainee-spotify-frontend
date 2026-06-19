import { Search } from './icons'
import Pill from './Pill'

const libraryItems = [
  { title: 'Músicas curtidas', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'aespa', sub: 'Artista' },
  { title: 'LEMONADE - The 2nd Album', sub: 'Álbum • aespa', playing: true },
  { title: 'follow the beat (or die trying)', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'foreign', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'you know', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'Kendrick Lamar', sub: 'Artista' },
  { title: 'flow state', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'LEMONADE - The 2nd Album', sub: 'Álbum • aespa' },
  { title: 'follow the beat (or die trying)', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'foreign', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'you know', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'Kendrick Lamar', sub: 'Artista' },
  { title: 'flow state', sub: 'Playlist • Vitoria Tenorio' },
  { title: 'LEMONADE - The 2nd Album', sub: 'Álbum • aespa' },
]

function Library() {
  return (
    <aside className="flex h-[927px] w-[312px] flex-col gap-3 overflow-hidden rounded-lg bg-[#121212] pb-3">
      <div className="flex items-center justify-between px-3 pt-3">
        <h2 className="text-sm font-semibold text-white">Sua Biblioteca</h2>
        <button className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-white hover:bg-neutral-700">
          Criar playlist
        </button>
      </div>
      <div className="flex gap-2 px-3">
        <Pill active>Tudo</Pill>
        <Pill>Playlists</Pill>
        <Pill>Álbuns</Pill>
        <Pill>Artistas</Pill>
      </div>
      <div className="mx-3 flex h-9 items-center gap-2 rounded-md bg-neutral-900 px-3 text-neutral-400">
        <Search />
        <span className="text-xs">Buscar em Sua Biblioteca</span>
      </div>
      <ul className="flex min-h-0 flex-col overflow-hidden px-2">
        {libraryItems.map((item, i) => (
          <li key={i} className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-neutral-900">
            <div className="h-10 w-10 shrink-0 rounded bg-neutral-700" />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm ${item.playing ? 'font-semibold text-emerald-400' : 'font-normal text-neutral-100'}`}>
                {item.title}
              </p>
              <p className="truncate text-xs text-neutral-400">{item.sub}</p>
            </div>
            {item.playing && <span className="text-emerald-400 text-xs">♪</span>}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Library

import { Search, Dots, Plus, Verified } from './icons'

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

const credits = [
  { name: 'LNGSHOT', role: 'Artista Principal', follow: true },
  { name: 'WOOJIN of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
  { name: 'LOUIS of LNGSHOT', role: 'Arranjos • Autores • Letrista' },
]

function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
      }`}
    >
      {children}
    </button>
  )
}

type FrameProps = { query: string }

function Frame({ query }: FrameProps) {
  const q = query.trim().toLowerCase()
  const filteredResults = q
    ? results.filter(
        (r) => r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q),
      )
    : results

  return (
    <div className="flex justify-center gap-2 overflow-hidden py-[14.5px]">
      {/* Library ────────────────────────────────────────────────── */}
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

      {/* Main section (search results) ──────────────────────────── */}
      <main className="flex h-[927px] w-[1268px] flex-col gap-8 overflow-hidden rounded-lg bg-gradient-to-b from-[#202020] to-[#121212] pt-6 pr-5 pb-6 pl-5">
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
      </main>

      {/* Song panel ─────────────────────────────────────────────── */}
      <aside className="flex h-[927px] w-[315px] flex-col overflow-hidden rounded-lg bg-[#121212]">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-white">you know</h2>
          <Dots />
        </div>
        <div className="aspect-square w-full bg-neutral-700" />
        <div className="px-3 pt-3 pb-3">
          <p className="text-lg font-bold text-white">Never Let Go</p>
          <p className="text-sm font-normal text-neutral-400">LNGSHOT</p>
        </div>

        <div className="mx-3 mb-3 rounded-lg bg-neutral-900 p-3">
          <p className="mb-2 text-xs font-semibold text-neutral-300">Sobre o artista</p>
          <div className="aspect-[4/3] w-full rounded bg-neutral-700" />
          <div className="mt-3 flex items-center gap-1">
            <p className="text-sm font-semibold text-white">LNGSHOT</p>
            <Verified />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-neutral-400">4.965.405 ouvintes mensais</p>
            <button className="rounded-full border border-neutral-500 px-3 py-0.5 text-[10px] font-semibold text-white hover:border-white">
              Deixar de seguir
            </button>
          </div>
          <p className="mt-2 line-clamp-3 text-xs font-normal text-neutral-400">
            LNGSHOT is the first boy group introduced by Jay Park, a defining figure in hiphop, R&B, and Korean pop culture, and the executive producer shaping MORE…
          </p>
        </div>

        <div className="mx-3 mb-3 rounded-lg bg-neutral-900 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-300">Créditos</p>
            <button className="text-[10px] text-neutral-400 hover:text-white">Mostrar tudo</button>
          </div>
          <ul className="flex flex-col gap-2">
            {credits.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{c.name}</p>
                  <p className="truncate text-[10px] font-normal text-neutral-400">{c.role}</p>
                </div>
                {c.follow && (
                  <button className="shrink-0 rounded-full border border-neutral-500 px-3 py-0.5 text-[10px] font-semibold text-white hover:border-white">
                    Deixar de seguir
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default Frame

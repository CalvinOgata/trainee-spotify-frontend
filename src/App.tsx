// ────────────────────────────────────────────────────────────────────
// Inline icons (kept tiny — just enough to read the chrome at a glance)
// ────────────────────────────────────────────────────────────────────
const Spotify = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-white">
    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2.1-10.4-1.1a.75.75 0 1 1-.35-1.46c4.5-1.1 8.4-.7 11.5 1.2.36.22.47.7.25 1.1Zm1.5-3.3a.94.94 0 0 1-1.3.3c-3.2-2-8.1-2.6-11.9-1.4a.94.94 0 1 1-.55-1.8c4.4-1.35 9.8-.7 13.5 1.6.45.27.6.86.3 1.3Zm.13-3.4C15.3 8.4 8.6 8.2 5 9.3a1.12 1.12 0 1 1-.65-2.15C8.5 5.9 16 6.1 20.4 8.7a1.12 1.12 0 1 1-1.16 1.9Z" />
  </svg>
)
const Home = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M3 11 12 3l9 8v10h-6v-7H9v7H3z" />
  </svg>
)
const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
const X = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
const Bell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
)
const Dots = () => <span className="text-neutral-400 text-lg leading-none">···</span>
const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-neutral-400">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)
const Verified = () => (
  <svg viewBox="0 0 24 24" fill="#3b82f6" className="h-4 w-4">
    <path d="M12 1.5 14 3l2.5-.3.7 2.4 2.4.7-.3 2.5 1.5 2-1.5 2 .3 2.5-2.4.7-.7 2.4-2.5-.3L12 19l-2-1.5-2.5.3-.7-2.4-2.4-.7.3-2.5L3 10l1.5-2-.3-2.5 2.4-.7.7-2.4L9.8 3 12 1.5Z" />
    <path d="m8 11 3 3 5-5" stroke="white" strokeWidth="2" fill="none" />
  </svg>
)
const Play = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
)
const Prev = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M6 4h2v16H6zM20 4 9 12l11 8z" />
  </svg>
)
const Next = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M16 4h2v16h-2zM4 4l11 8L4 20z" />
  </svg>
)
const Volume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M3 9h4l5-4v14l-5-4H3z" />
    <path d="M16 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
)

// ────────────────────────────────────────────────────────────────────
// Mock data
// ────────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────────
// App
// ────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="grid h-screen w-screen grid-rows-[60px_minmax(0,1fr)_64px] bg-black font-sans text-white overflow-hidden">
      {/* Top bar ───────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between bg-black p-3 border-b border-neutral-800">
        <div className="flex items-center">
          <Spotify />
        </div>
        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-neutral-900 text-neutral-300 hover:bg-neutral-800">
            <Home />
          </button>
          <div className="flex h-10 w-[440px] items-center gap-3 rounded-full border border-neutral-700 bg-neutral-900 px-4">
            <Search />
            <span className="flex-1 text-sm text-neutral-200">touch</span>
            <X />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-300">
          <button className="flex items-center gap-2 hover:text-white">
            <span className="inline-block h-2 w-2 rounded-full bg-neutral-400" />
            Instalar aplicativo
          </button>
          <button className="text-neutral-400 hover:text-white"><Bell /></button>
          <div className="h-8 w-8 rounded-full bg-neutral-700" />
        </div>
      </header>

      {/* Main 3-column "frame" ─────────────────────────────────────── */}
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
            {results.map((r, i) => (
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

      {/* Bottom player bar ────────────────────────────────────────── */}
      <footer className="flex items-center justify-between bg-black p-2.5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded bg-neutral-700" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Never Let Go</p>
            <p className="truncate text-xs font-normal text-neutral-400">LNGSHOT</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-4 text-neutral-300">
            <button className="hover:text-white"><Prev /></button>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-white text-black hover:scale-105 transition-transform">
              <Play />
            </button>
            <button className="hover:text-white"><Next /></button>
          </div>
          <div className="flex w-full max-w-[600px] items-center gap-2 text-[10px] text-neutral-400">
            <span>0:35</span>
            <div className="relative flex-1 h-1 rounded-full bg-neutral-700">
              <div className="absolute inset-y-0 left-0 w-1/6 rounded-full bg-white" />
            </div>
            <span>3:18</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 text-neutral-400">
          <Volume />
          <div className="relative h-1 w-24 rounded-full bg-neutral-700">
            <div className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-white" />
          </div>
        </div>
      </footer>
    </div>
  )
}

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

export default App

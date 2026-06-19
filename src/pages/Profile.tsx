const profileArtists = Array.from({ length: 3 }, () => ({ name: 'aespa', role: 'Artista' }))
const profileTracks = [
  { title: 'Starboy', plays: '4.536.796.459', duration: '3:50' },
  { title: 'Right Back!', plays: '4.536.796.459', duration: '3:50' },
  { title: 'Right Back!', plays: '4.536.796.459', duration: '3:50' },
  { title: 'Right Back!', plays: '4.536.796.459', duration: '3:50' },
]
const profilePlaylists = Array.from({ length: 9 }, () => ({ title: 'you know' }))

type ProfileProps = { onArtistClick: () => void }

function Profile({ onArtistClick }: ProfileProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="-mx-5 -mt-6 flex items-end gap-6 bg-[#4A4A4A] px-6 pt-6 pb-5">
        <div className="h-44 w-44 shrink-0 rounded-full bg-neutral-700" />
        <div className="flex min-w-0 flex-col gap-3 pb-2">
          <p className="text-xs font-semibold text-white">Perfil</p>
          <h1 className="truncate text-7xl font-bold leading-none text-white">Vitoria Tenorio</h1>
          <p className="text-xs font-normal text-white">8 playlists públicas • 2 seguidores • 2 seguindo</p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-bold text-white">Artistas mais tocados este mês</h2>
          <p className="mt-1 text-xs font-normal text-neutral-400">Visíveis apenas para você</p>
        </div>
        <div className="flex gap-3">
          {profileArtists.map((a, i) => (
            <button
              key={i}
              onClick={onArtistClick}
              className="flex w-[110px] flex-col gap-2 text-left"
            >
              <div className="h-[110px] w-[110px] rounded-full bg-neutral-700" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{a.name}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">{a.role}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div>
          <h2 className="text-base font-bold text-white">Músicas mais tocadas este mês</h2>
          <p className="mt-1 text-xs font-normal text-neutral-400">Visíveis apenas para você</p>
        </div>
        <ul className="flex flex-col">
          {profileTracks.map((t, i) => (
            <li
              key={i}
              className="grid grid-cols-[24px_40px_1fr_140px_40px] items-center gap-4 rounded px-2 py-1 hover:bg-white/5"
            >
              <span className="text-xs font-normal text-neutral-400">{i + 1}</span>
              <div className="h-10 w-10 rounded bg-neutral-700" />
              <p className="truncate text-xs font-semibold text-white">{t.title}</p>
              <span className="text-right text-xs font-normal text-neutral-400">{t.plays}</span>
              <span className="text-right text-xs font-normal text-neutral-400">{t.duration}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-white">Playlists públicas</h2>
        <div className="flex gap-3">
          {profilePlaylists.map((p, i) => (
            <div key={i} className="flex w-[110px] flex-col gap-2">
              <div className="h-[110px] w-[110px] rounded bg-neutral-700" />
              <p className="truncate text-xs font-semibold text-white">{p.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Profile

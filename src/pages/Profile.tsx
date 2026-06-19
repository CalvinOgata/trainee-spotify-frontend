const profileArtists = Array.from({ length: 3 }, () => ({ name: 'aespa', role: 'Artista' }))
const profileTracks = [
  { title: 'Starboy', plays: '4.536.796.459', duration: '3:50', explicit: true },
  { title: 'Right Back!', plays: '4.536.796.459', duration: '3:50', explicit: true },
  { title: 'Right Back!', plays: '4.536.796.459', duration: '3:50', explicit: true },
  { title: 'Right Back!', plays: '4.536.796.459', duration: '3:50', explicit: true },
]
const profilePlaylists = Array.from({ length: 7 }, () => ({ title: 'you know' }))

type ProfileProps = { onArtistClick: () => void }

function Profile({ onArtistClick }: ProfileProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="-mx-5 -mt-6 flex items-end gap-2.5 bg-gradient-to-b from-[#938D8E] to-[#3E3939] pt-10 pr-5 pb-4 pl-5">
        <div className="h-[175px] w-[175px] shrink-0 rounded-full bg-neutral-700" />
        <div className="flex min-w-0 flex-col pb-2">
          <p className="text-xs font-semibold leading-none text-white">Perfil</p>
          <h1 className="mt-2 truncate text-7xl font-bold leading-none text-white">Vitoria Tenorio</h1>
          <p className="mt-3 text-xs font-normal leading-none text-white">8 playlists públicas • 2 seguidores • 2 seguindo</p>
        </div>
      </div>

      <section className="flex w-[420px] flex-col gap-2.5">
        <div>
          <h2 className="text-base font-bold leading-tight text-white">Artistas mais tocados este mês</h2>
          <p className="text-xs font-normal leading-tight text-neutral-400">Visíveis apenas para você</p>
        </div>
        <div className="flex gap-3">
          {profileArtists.map((a, i) => (
            <button
              key={i}
              onClick={onArtistClick}
              className="flex h-[172px] w-[132px] flex-col gap-2 text-left"
            >
              <div className="h-[132px] w-[132px] rounded-full bg-neutral-700" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight text-white">{a.name}</p>
                <p className="truncate text-[11px] font-normal leading-tight text-neutral-400">{a.role}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex w-[457px] flex-col gap-2.5">
        <div>
          <h2 className="text-base font-bold leading-tight text-white">Músicas mais tocadas este mês</h2>
          <p className="text-xs font-normal leading-tight text-neutral-400">Visíveis apenas para você</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {profileTracks.map((t, i) => (
            <li
              key={i}
              className="grid h-9 w-[455px] grid-cols-[12px_36px_1fr_auto_auto] items-center gap-2.5"
            >
              <span className="text-xs font-normal text-neutral-400">{i + 1}</span>
              <div className="h-9 w-9 rounded bg-neutral-700" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-xs font-semibold leading-none text-white">{t.title}</p>
                {t.explicit && (
                  <span className="inline-grid h-3 w-3 place-items-center rounded-sm bg-neutral-500 text-[8px] font-bold leading-none text-black">
                    E
                  </span>
                )}
              </div>
              <span className="text-xs font-normal text-neutral-400">{t.plays}</span>
              <span className="text-xs font-normal text-neutral-400">{t.duration}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex w-[996px] flex-col gap-2.5">
        <h2 className="text-base font-bold leading-tight text-white">Playlists públicas</h2>
        <div className="flex gap-3">
          {profilePlaylists.map((p, i) => (
            <div key={i} className="flex h-[172px] w-[132px] flex-col gap-2">
              <div className="h-[132px] w-[132px] rounded bg-neutral-700" />
              <p className="truncate text-xs font-semibold text-white">{p.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Profile

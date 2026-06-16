import { Play, Prev, Next, Volume } from './icons'

function Player() {
  return (
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
  )
}

export default Player

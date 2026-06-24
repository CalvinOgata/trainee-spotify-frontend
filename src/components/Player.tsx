import songCover from '../assets/images/song_default.png'
import { Play, Prev, Next, Mixer, MinimizedPlayer } from './icons'

function Player() {
  return (
    <footer className="flex items-center justify-between bg-black p-2.5">
      <div className="flex h-[35px] w-[111px] items-center gap-3">
        <img src={songCover} alt="" className="h-[35px] w-9 shrink-0 rounded-[2px] object-cover" />
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-white">Never Let Go</p>
          <p className="truncate text-[10px] font-normal text-neutral-400">LNGSHOT</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-10 w-[509px] items-center justify-center gap-3">
          <button className="text-[#B3B3B3] hover:text-white" aria-label="Anterior">
            <Prev />
          </button>
          <button className="hover:scale-105 transition-transform" aria-label="Pausar">
            <Play />
          </button>
          <button className="text-[#B3B3B3] hover:text-white" aria-label="Próxima">
            <Next />
          </button>
        </div>
        <div className="flex w-[509px] items-center gap-1.5">
          <span className="w-[22px] text-right text-[11px] font-medium leading-3 text-[#B3B3B3]">0:35</span>
          <div className="relative h-1 flex-1 rounded-full bg-neutral-700">
            <div className="absolute inset-y-0 left-0 w-1/6 rounded-full bg-white" />
          </div>
          <span className="w-[22px] text-[11px] font-medium leading-3 text-[#B3B3B3]">3:18</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 text-[#B3B3B3]">
        <Mixer />
        <div className="relative h-1 w-24 rounded-full bg-neutral-700">
          <div className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-white" />
        </div>
        <button className="hover:text-white" aria-label="Tela cheia">
          <MinimizedPlayer />
        </button>
      </div>
    </footer>
  )
}

export default Player

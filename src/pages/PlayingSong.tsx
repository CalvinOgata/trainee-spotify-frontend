import songCover from '../assets/images/song_default.png'
import { resolveImageUrl } from '../lib/api/client'
import { usePlayer } from '../lib/contexts/PlayerContext'

function PlayingSong() {
  const { current } = usePlayer()
  const cover = resolveImageUrl(current?.imageUrl) ?? songCover
  return (
    <div className="relative ml-[4px] mt-[4px] flex h-full w-full flex-col gap-[10px] overflow-hidden rounded-[16px] bg-black p-[10px]">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${cover})`,
          filter: 'blur(120px) saturate(1.6) brightness(0.55)',
          transform: 'scale(1.4)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div className="relative flex w-full flex-1 items-center justify-center">
        <img
          src={cover}
          alt=""
          className="aspect-square rounded-lg object-cover shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
          style={{ width: 'min(600px, 70vmin)', viewTransitionName: 'song-cover' }}
        />
      </div>
    </div>
  )
}

export default PlayingSong

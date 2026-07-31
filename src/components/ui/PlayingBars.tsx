type PlayingBarsProps = {
  animate?: boolean
  className?: string
}

const delays = ['0s', '0.15s', '0.3s', '0.05s']

function PlayingBars({ animate = true, className }: PlayingBarsProps) {
  return (
    <div className={`flex h-[10px] shrink-0 items-end gap-[1px] md:h-4 md:gap-[2px] ${className ?? ''}`}>
      {delays.map((delay, i) => (
        <span
          key={i}
          className="h-full w-[2px] origin-bottom bg-[#1FDF64] md:w-[3px]"
          style={{
            animation: animate ? 'playing-bar 0.9s ease-in-out infinite' : undefined,
            animationDelay: animate ? delay : undefined,
          }}
        />
      ))}
    </div>
  )
}

export default PlayingBars

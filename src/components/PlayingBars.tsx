type PlayingBarsProps = {
  animate?: boolean
  className?: string
}

const delays = ['0s', '0.15s', '0.3s', '0.05s']

function PlayingBars({ animate = true, className }: PlayingBarsProps) {
  return (
    <div className={`flex h-4 shrink-0 items-end gap-[2px] ${className ?? ''}`}>
      {delays.map((delay, i) => (
        <span
          key={i}
          className="h-full w-[3px] origin-bottom bg-[#1FDF64]"
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

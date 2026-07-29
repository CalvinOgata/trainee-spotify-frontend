type PillProps = {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

function Pill({ children, active, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`font-[Inter] flex h-8 w-14 items-center justify-center overflow-hidden whitespace-nowrap rounded-2xl p-2.5 text-[10px] font-medium leading-none transition-colors ${
        active ? 'bg-white text-black' : 'bg-[#343333] text-white hover:bg-[#4E4E4E]'
      }`}
    >
      {children}
    </button>
  )
}

export default Pill

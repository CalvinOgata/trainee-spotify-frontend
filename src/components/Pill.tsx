type PillProps = { children: React.ReactNode; active?: boolean }

function Pill({ children, active }: PillProps) {
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

export default Pill

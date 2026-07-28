import { useRef, type ReactNode } from 'react'
import { useAutoHideScrollbar } from '../../lib/useAutoHideScrollbar'

type MainSectionProps = { children: ReactNode }

function MainSection({ children }: MainSectionProps) {
  const ref = useRef<HTMLElement>(null)
  useAutoHideScrollbar(ref)
  return (
    <main
      ref={ref}
      className="scroll-auto-hide flex h-full min-w-0 flex-1 flex-col gap-8 overflow-auto rounded-lg bg-gradient-to-b from-[#202020] to-[#121212] pt-6 pr-5 pb-6 pl-5"
    >
      {children}
    </main>
  )
}

export default MainSection

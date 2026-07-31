import { useRef, type ReactNode } from 'react'
import { useAutoHideScrollbar } from '../../lib/hooks/useAutoHideScrollbar'

type MainSectionProps = { children: ReactNode }

function MainSection({ children }: MainSectionProps) {
  const ref = useRef<HTMLElement>(null)
  useAutoHideScrollbar(ref)
  return (
    <main
      ref={ref}
      className="scroll-auto-hide flex h-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden rounded-lg bg-gradient-to-b from-[#202020] to-[#121212] px-3 pt-4 pb-4 md:gap-8 md:px-5 md:pt-6 md:pb-6"
    >
      {children}
    </main>
  )
}

export default MainSection

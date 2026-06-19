import type { ReactNode } from 'react'

type MainSectionProps = { children: ReactNode }

function MainSection({ children }: MainSectionProps) {
  return (
    <main className="flex h-[927px] w-[1268px] flex-col gap-8 overflow-hidden rounded-lg bg-gradient-to-b from-[#202020] to-[#121212] pt-6 pr-5 pb-6 pl-5">
      {children}
    </main>
  )
}

export default MainSection

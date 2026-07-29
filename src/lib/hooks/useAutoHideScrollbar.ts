import { useEffect, type RefObject } from 'react'

export function useAutoHideScrollbar<T extends HTMLElement>(
  ref: RefObject<T | null>,
  hideAfterMs = 800,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const onScroll = () => {
      el.classList.add('is-scrolling')
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => el.classList.remove('is-scrolling'), hideAfterMs)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [ref, hideAfterMs])
}

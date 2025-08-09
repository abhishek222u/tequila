// SmoothScrollProvider.tsx
'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LenisScrollContextType {
  scroll: React.MutableRefObject<number>
  lenis: React.MutableRefObject<Lenis | null>
}

const LenisScrollContext = createContext<LenisScrollContextType>({
  scroll: { current: 0 },
  lenis: { current: null }
})

export function useLenisScroll() {
  return useContext(LenisScrollContext)
}

interface LenisProviderProps {
  children: ReactNode
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const scroll = useRef(0)
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis with optimized settings
    lenis.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      gestureOrientation: 'vertical',
      touchMultiplier: 1.2,
      wheelMultiplier: 1,
      infinite: false,
      autoResize: true
    })

    const raf = (time: number) => {
      lenis.current?.raf(time)
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }

    // Track scroll position
    lenis.current.on('scroll', ({ scroll: y, progress }) => {
      scroll.current = y
    })

    // Start animation loop
    requestAnimationFrame(raf)

    return () => {
      lenis.current?.destroy()
      lenis.current = null
    }
  }, [])

  return (
    <LenisScrollContext.Provider value={{ scroll, lenis }}>{children}</LenisScrollContext.Provider>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
// @ts-ignore
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

type AnimatedHeadingProps = {
  text: string
  className?: string
  color?: string
  greyColor?: string
}

export default function AnimatedHeading({ 
  text, 
  className = '', 
  color = '#000000',
  greyColor = '#888888'
}: AnimatedHeadingProps) {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headingRef.current) return

    const split1 = new SplitText(headingRef.current, {
      type: 'lines',
      linesClass: 'overflow-hidden'
    })

    const split2 = new SplitText(split1.lines, {
      type: 'lines',
      linesClass: 'line'
    })

    const lines = headingRef.current.querySelectorAll('.line')

    // Create a timeline for the left-to-right reveal animation
    const tl = gsap.timeline({ 
      paused: true,
      onComplete: () => {
        // Ensure text stays in final position and color
        gsap.set(lines, {
          x: 0,
          clipPath: 'inset(0 0% 0 0)',
          color: '#FFFFFF'
        })
      }
    })
    
    // Set initial state - all lines start with grey color and clipped from left
    gsap.set(lines, {
      color: greyColor,
      clipPath: 'inset(0 100% 0 0)', // Start completely clipped from left
      x: -50, // Start slightly off-screen to the left
      opacity: 0.7
    })

    // Animate each line to reveal from left to right with color fill
    tl.to(lines, {
      x: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out'
    })
    .to(lines, {
      clipPath: 'inset(0 0% 0 0)', // Reveal completely
      color: color, // Change to final color
      duration: 1.5,
      stagger: 0.15,
      ease: 'power2.inOut'
    }, '-=0.8') // Start color transition before position animation ends
    .to(lines, {
      color: '#FFFFFF', // Final white color
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // Create scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: headingRef.current,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: () => tl.play(),
      onLeaveBack: () => {
        // Don't reverse animation when scrolling back up
        if (tl.progress() > 0.5) {
          tl.progress(1) // Keep animation complete
        } else {
          tl.reverse() // Only reverse if animation hasn't progressed much
        }
      },
      onLeave: () => tl.progress(1), // Keep animation complete when scrolling down
      onEnterBack: () => {
        // Don't reverse if animation is mostly complete
        if (tl.progress() > 0.5) {
          tl.progress(1)
        }
      }
    })

    return () => {
      trigger.kill()
      split1.revert()
      split2.revert()
    }
  }, [color, greyColor])

  return (
    <div
      ref={headingRef}
      className={`heading__animation ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    ></div>
  )
}

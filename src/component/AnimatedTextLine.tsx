'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedTextLineProps {
  text: string;
  className?: string;
  delay?: number;
}

const AnimatedTextLine: React.FC<AnimatedTextLineProps> = ({ 
  text, 
  className = '', 
  delay = 0 
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    
    // Split text into characters for character-by-character animation
    const chars = text.split('');
    element.innerHTML = chars.map(char => 
      char === ' ' ? '&nbsp;' : `<span class="char">${char}</span>`
    ).join('');

    // Get all character spans
    const charSpans = element.querySelectorAll('.char');

    // Set initial state
    gsap.set(charSpans, {
      y: '100%',
      opacity: 0,
      color: '#6b7280' // grey color
    });

    // Create the animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          // Animate characters in sequence
          gsap.to(charSpans, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.03,
            delay: delay
          });

          // Animate color from grey to white
          gsap.to(charSpans, {
            color: '#ffffff',
            duration: 1.2,
            ease: 'power2.out',
            delay: delay + 0.2
          });
        },
        onLeave: () => {
          // Reverse animation when leaving viewport
          gsap.to(charSpans, {
            y: '-100%',
            opacity: 0,
            color: '#6b7280',
            duration: 0.6,
            ease: 'power3.in'
          });
        },
        onEnterBack: () => {
          // Re-animate when entering viewport again
          gsap.to(charSpans, {
            y: '0%',
            opacity: 1,
            color: '#ffffff',
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.02
          });
        },
        onLeaveBack: () => {
          // Reverse animation when leaving viewport backwards
          gsap.to(charSpans, {
            y: '100%',
            opacity: 0,
            color: '#6b7280',
            duration: 0.6,
            ease: 'power3.in'
          });
        }
      }
    });

    // Cleanup function
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [text, delay]);

  return (
    <p 
      ref={textRef} 
      className={`overflow-hidden animated-text-line ${className}`}
      style={{ 
        lineHeight: '1.2',
        position: 'relative'
      }}
    />
  );
};

export default AnimatedTextLine;

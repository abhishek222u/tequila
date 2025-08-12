'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroTextLineProps {
  text: string;
  className?: string;
  delay?: number;
  index: number;
}

const HeroTextLine: React.FC<HeroTextLineProps> = ({ 
  text, 
  className = '', 
  delay = 0,
  index 
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const element = textRef.current;
    const container = containerRef.current;
    
    // Split text into characters for character-by-character animation
    const chars = text.split('');
    element.innerHTML = chars.map(char => 
      char === ' ' ? '&nbsp;' : `<span class="char">${char}</span>`
    ).join('');

    // Get all character spans
    const charSpans = element.querySelectorAll('.char');

    // Set initial state with sophisticated positioning
    gsap.set(charSpans, {
      y: '120%',
      opacity: 0,
      rotationX: 90,
      scale: 0.8,
      filter: 'blur(4px)',
      color: '#6b7280'
    });

    // Set initial container state
    gsap.set(container, {
      opacity: 0,
      y: 30,
      scale: 0.95
    });

    // Create the main animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          // Animate container first
          gsap.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: delay
          });

          // Animate characters in sequence with advanced effects
          gsap.to(charSpans, {
            y: '0%',
            opacity: 1,
            rotationX: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.04,
            delay: delay + 0.2
          });

          // Animate color from grey to white with glow effect
          gsap.to(charSpans, {
            color: '#ffffff',
            duration: 1.5,
            ease: 'power2.out',
            delay: delay + 0.4
          });

          // Add subtle floating animation after main animation
          gsap.to(charSpans, {
            y: '-2px',
            duration: 2,
            ease: 'power1.inOut',
            stagger: 0.02,
            delay: delay + 1.5,
            yoyo: true,
            repeat: -1
          });
        },
        onLeave: () => {
          // Smooth exit animation
          gsap.to(charSpans, {
            y: '-80px',
            opacity: 0,
            rotationX: -45,
            scale: 0.9,
            filter: 'blur(2px)',
            duration: 0.8,
            ease: 'power3.in',
            stagger: 0.02
          });
          
          gsap.to(container, {
            opacity: 0,
            y: -20,
            scale: 0.98,
            duration: 0.6,
            ease: 'power3.in'
          });
        },
        onEnterBack: () => {
          // Re-animate when entering viewport again
          gsap.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out'
          });

          gsap.to(charSpans, {
            y: '0%',
            opacity: 1,
            rotationX: 0,
            scale: 1,
            filter: 'blur(0px)',
            color: '#ffffff',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.03
          });
        },
        onLeaveBack: () => {
          // Reverse animation when leaving viewport backwards
          gsap.to(charSpans, {
            y: '80px',
            opacity: 0,
            rotationX: 45,
            scale: 0.9,
            filter: 'blur(2px)',
            duration: 0.6,
            ease: 'power3.in',
            stagger: 0.02
          });
          
          gsap.to(container, {
            opacity: 0,
            y: 20,
            scale: 0.98,
            duration: 0.5,
            ease: 'power3.in'
          });
        }
      }
    });

    // Add hover effects for interactive feel
    const handleMouseEnter = () => {
      gsap.to(charSpans, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.01
      });
    };

    const handleMouseLeave = () => {
      gsap.to(charSpans, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.01
      });
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [text, delay, index]);

  return (
    <div 
      ref={containerRef}
      className={`hero-text-line-container ${className}`}
      style={{ 
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default'
      }}
    >
      <span 
        ref={textRef} 
        className="hero-text-line inline-block"
        style={{ 
          // lineHeight: '1.2',
          position: 'relative',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};

export default HeroTextLine;

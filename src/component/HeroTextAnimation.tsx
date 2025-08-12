'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Optimized animation setup with useCallback
  const setupAnimation = useCallback(() => {
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

    // Set initial state with optimized positioning
    gsap.set(charSpans, {
      y: '100%',
      opacity: 0,
      rotationX: 60,
      scale: 0.85,
      filter: 'blur(3px)',
      color: '#6b7280',
      transformOrigin: 'center center'
    });

    // Set initial container state
    gsap.set(container, {
      opacity: 0,
      y: 20,
      scale: 0.98
    });

    // Create the main animation timeline with better performance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          // Kill any existing animations for better performance
          if (animationRef.current) {
            animationRef.current.kill();
          }

          // Create new optimized timeline
          animationRef.current = gsap.timeline({
            onComplete: () => {
              // Add subtle floating animation after main animation
              gsap.to(charSpans, {
                y: '-1px',
                duration: 3,
                ease: 'power1.inOut',
                stagger: 0.01,
                yoyo: true,
                repeat: -1
              });
            }
          });

          // Animate container first with smoother easing
          animationRef.current.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: delay
          });

          // Animate characters in sequence with optimized effects
          animationRef.current.to(charSpans, {
            y: '0%',
            opacity: 1,
            rotationX: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.03,
            delay: delay + 0.1
          }, delay + 0.1);

          // Animate color from grey to white with smoother transition
          animationRef.current.to(charSpans, {
            color: '#ffffff',
            duration: 1.2,
            ease: 'power1.out',
            delay: delay + 0.3
          }, delay + 0.3);
        },
        onLeave: () => {
          // Smooth exit animation with better performance
          if (animationRef.current) {
            animationRef.current.kill();
          }
          
          gsap.to(charSpans, {
            y: '-60px',
            opacity: 0,
            rotationX: -30,
            scale: 0.9,
            filter: 'blur(2px)',
            duration: 0.6,
            ease: 'power2.in',
            stagger: 0.015
          });
          
          gsap.to(container, {
            opacity: 0,
            y: -15,
            scale: 0.98,
            duration: 0.5,
            ease: 'power2.in'
          });
        },
        onEnterBack: () => {
          // Re-animate when entering viewport again
          if (animationRef.current) {
            animationRef.current.kill();
          }

          gsap.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          });

          gsap.to(charSpans, {
            y: '0%',
            opacity: 1,
            rotationX: 0,
            scale: 1,
            filter: 'blur(0px)',
            color: '#ffffff',
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.02
          });
        },
        onLeaveBack: () => {
          // Reverse animation when leaving viewport backwards
          if (animationRef.current) {
            animationRef.current.kill();
          }
          
          gsap.to(charSpans, {
            y: '60px',
            opacity: 0,
            rotationX: 30,
            scale: 0.9,
            filter: 'blur(2px)',
            duration: 0.5,
            ease: 'power2.in',
            stagger: 0.015
          });
          
          gsap.to(container, {
            opacity: 0,
            y: 15,
            scale: 0.98,
            duration: 0.4,
            ease: 'power2.in'
          });
        }
      }
    });

    // Add optimized hover effects for interactive feel
    const handleMouseEnter = () => {
      gsap.to(charSpans, {
        scale: 1.03,
        duration: 0.2,
        ease: 'power1.out',
        stagger: 0.005
      });
    };

    const handleMouseLeave = () => {
      gsap.to(charSpans, {
        scale: 1,
        duration: 0.2,
        ease: 'power1.out',
        stagger: 0.005
      });
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function
    return () => {
      tl.kill();
      if (animationRef.current) {
        animationRef.current.kill();
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [text, delay, index]);

  useEffect(() => {
    const cleanup = setupAnimation();
    return cleanup;
  }, [setupAnimation]);

  return (
    <div 
      ref={containerRef}
      className={`hero-text-line-container ${className}`}
      style={{ 
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        willChange: 'transform, opacity'
      }}
    >
      <span 
        ref={textRef} 
        className="hero-text-line inline-block"
        style={{ 
          position: 'relative',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
      />
    </div>
  );
};

export default HeroTextLine;

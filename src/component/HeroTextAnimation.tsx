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
  showLine?: boolean;
}

const HeroTextLine: React.FC<HeroTextLineProps> = ({ 
  text, 
  className = '', 
  delay = 0,
  index,
  showLine = false
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Optimized animation setup with useCallback
  const setupAnimation = useCallback(() => {
    if (!textRef.current || !containerRef.current) return;

    const element = textRef.current;
    const container = containerRef.current;
    
    // Set the text content directly without character splitting
    element.textContent = text;

    // Set initial state for smooth bottom-to-top animation
    gsap.set(element, {
      y: '100%',
      opacity: 0,
      scale: 0.95,
      filter: 'blur(2px)',
      transformOrigin: 'center center'
    });

    // Set initial container state
    gsap.set(container, {
      opacity: 0,
      y: 30,
      scale: 0.98
    });

    // Set initial line state if showLine is true
    if (showLine && lineRef.current) {
      console.log('Setting up line for:', text);
      gsap.set(lineRef.current, { width: 0 });
    }

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
              gsap.to(element, {
                y: '-2px',
                duration: 4,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1
              });

              // Animate the line from left to right if showLine is true
              if (showLine && lineRef.current) {
                console.log('Animating line for:', text);
                gsap.to(lineRef.current, {
                  width: '100%',
                  duration: 1.5,
                  ease: 'power2.out',
                  delay: 0.3
                });
              }
            }
          });

          // Animate container first with smoother easing
          animationRef.current.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: delay
          });

          // Animate text with smooth bottom-to-top motion
          animationRef.current.to(element, {
            y: '0%',
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            delay: delay + 0.1
          }, delay + 0.1);
        },
        onLeave: () => {
          // Smooth exit animation with better performance
          if (animationRef.current) {
            animationRef.current.kill();
          }
          
          gsap.to(element, {
            y: '-60px',
            opacity: 0,
            scale: 0.9,
            filter: 'blur(2px)',
            duration: 0.6,
            ease: 'power2.in'
          });
          
          gsap.to(container, {
            opacity: 0,
            y: -15,
            scale: 0.98,
            duration: 0.5,
            ease: 'power2.in'
          });

          // Hide the line when leaving
          if (showLine && lineRef.current) {
            gsap.to(lineRef.current, {
              width: 0,
              duration: 0.4,
              ease: 'power2.in'
            });
          }
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

          gsap.to(element, {
            y: '0%',
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out'
          });

          // Show the line again
          if (showLine && lineRef.current) {
            gsap.to(lineRef.current, {
              width: '100%',
              duration: 1.2,
              ease: 'power2.out',
              delay: 0.2
            });
          }
        },
        onLeaveBack: () => {
          // Reverse animation when leaving viewport backwards
          if (animationRef.current) {
            animationRef.current.kill();
          }
          
          gsap.to(element, {
            y: '60px',
            opacity: 0,
            scale: 0.9,
            filter: 'blur(2px)',
            duration: 0.5,
            ease: 'power2.in'
          });
          
          gsap.to(container, {
            opacity: 0,
            y: 15,
            scale: 0.98,
            duration: 0.4,
            ease: 'power2.in'
          });

          // Hide the line when leaving backwards
          if (showLine && lineRef.current) {
            gsap.to(lineRef.current, {
              width: 0,
              duration: 0.4,
              ease: 'power2.in'
            });
          }
        }
      }
    });

    // Add optimized hover effects for interactive feel
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power1.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power1.out'
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
  }, [text, delay, index, showLine]);

  useEffect(() => {
    const cleanup = setupAnimation();
    return cleanup;
  }, [setupAnimation]);

  return (
    <div 
      ref={containerRef}
      className={`hero-text-line-container ${className} text-[var(--foreground)]`}
      style={{ 
        display: 'block',
        position: 'relative',
        overflow: 'visible',
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
      {showLine && (
        <div 
          ref={lineRef}
          className="hero-text-line-underline"
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: 0,
            height: '4px',
            backgroundColor: 'var(--foreground) !important',
            width: 0,
            willChange: 'width',
            zIndex: 10,
            boxShadow: '0 0 8px rgba(var(--foreground-rgb), 0.6)'
          }}
        />
      )}
    </div>
  );
};

export default HeroTextLine;

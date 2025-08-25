'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedLineProps {
  delay?: number;
  className?: string;
}

const AnimatedLine: React.FC<AnimatedLineProps> = ({ 
  delay = 0,
  className = ''
}) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    const line = lineRef.current;
    
    // Set initial state
    gsap.set(line, { width: 0 });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: line,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });

    // Animate line from left to right
    tl.to(line, {
      width: '44.5%',
      duration: 1.5,
      ease: 'power2.out',
      delay: delay
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [delay]);

  return (
    <div 
      ref={lineRef}
      className={`animated-line ${className}`}
      style={{
        height: '3px',
        backgroundColor: 'var(--foreground)',
        width: '44.5%',
        // marginLeft: '8px',
        flexShrink: 0
      }}
    />
  );
};

export default AnimatedLine;

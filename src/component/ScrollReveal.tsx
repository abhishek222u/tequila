"use client";
import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

type props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function ScrollReveal({ children, delay = 0, className }: props) {
  const ref = useRef(null);
  const isInview = useInView(ref, { 
    once: false,
    margin: "-10% 0px -10% 0px",
    amount: 0.3
  });
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);

  // Optimized animation variants with better easing
  const variants = {
    hidden: { 
      opacity: 0, 
      translateY: 40,
      scale: 0.98,
      filter: 'blur(2px)'
    },
    visible: { 
      opacity: 1, 
      translateY: 0,
      scale: 1,
      filter: 'blur(0px)'
    },
  };

  // Optimized transition settings
  const transition = {
    type: "spring",
    duration: 0.8,
    damping: 25,
    stiffness: 100,
    delay: delay,
    mass: 0.8,
    restDelta: 0.001
  };

  // Optimized animation handling with useCallback
  const handleAnimation = useCallback(() => {
    if (isInview) {
      controls.start("visible");
      // Add a small delay to trigger CSS animations after Framer Motion
      const timer = setTimeout(() => setIsVisible(true), delay ? delay * 1000 + 200 : 200);
      return () => clearTimeout(timer);
    } else {
      // Reset animation state when element leaves viewport
      controls.start("hidden");
      setIsVisible(false);
    }
  }, [isInview, delay, controls]);

  useEffect(() => {
    handleAnimation();
  }, [handleAnimation]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      transition={transition}
      initial="hidden"
      animate={controls}
      className={`${className} ${isVisible ? 'animate' : ''}`}
      style={{
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
}

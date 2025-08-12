"use client";
import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";

type props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function ScrollReveal({ children, delay, className }: props) {
  const ref = useRef(null);
  const isInview = useInView(ref, { once: false });
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInview) {
      controls.start("visible");
      // Add a small delay to trigger CSS animations after Framer Motion
      setTimeout(() => setIsVisible(true), delay ? delay * 1000 + 300 : 300);
    } else {
      // Reset animation state when element leaves viewport
      controls.start("hidden");
      setIsVisible(false);
    }
  }, [isInview, delay, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, translateY: 50 },
        visible: { opacity: 1, translateY: 0 },
      }}
      transition={{
        type: "tween",
        duration: 0.3,
        damping: 8,
        delay: delay,
        stiffness: 100,
      }}
      initial="hidden"
      animate={controls}
      className={`${className} ${isVisible ? 'animate' : ''}`}
    >
      {children}
    </motion.div>
  );
}

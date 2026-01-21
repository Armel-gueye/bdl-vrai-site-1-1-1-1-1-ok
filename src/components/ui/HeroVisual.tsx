import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const HeroVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const x1 = useSpring(useTransform(mouseX, [-300, 300], [-20, 20]), springConfig);
  const y1 = useSpring(useTransform(mouseY, [-300, 300], [-20, 20]), springConfig);
  const x2 = useSpring(useTransform(mouseX, [-300, 300], [15, -15]), springConfig);
  const y2 = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />

      {/* Large Red Orb - Top Right */}
      <motion.div
        className="absolute top-[10%] right-[15%] w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
        style={{ x: x1, y: y1 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-red-600 to-red-700 opacity-20 blur-3xl" />
      </motion.div>

      {/* Medium Black Orb - Center */}
      <motion.div
        className="absolute top-[40%] right-[25%] w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72"
        style={{ x: x2, y: y2 }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-15 blur-2xl" />
      </motion.div>

      {/* Small Red Accent - Bottom Left */}
      <motion.div
        className="absolute bottom-[20%] right-[40%] w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-red-500 opacity-25 blur-2xl" />
      </motion.div>

      {/* Geometric accent shapes */}
      <motion.div
        className="absolute top-[25%] right-[10%] w-24 h-24 md:w-32 md:h-32"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full border-2 border-primary/10 rounded-lg transform rotate-45" />
      </motion.div>

      <motion.div
        className="absolute bottom-[30%] right-[20%] w-16 h-16 md:w-20 md:h-20"
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full border-2 border-black/5 rounded-full" />
      </motion.div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            top: `${20 + i * 15}%`,
            right: `${10 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-black/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};

export default HeroVisual;

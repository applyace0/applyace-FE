import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const Card3D: React.FC<Card3DProps> = ({ 
  children, 
  className = "",
  glowColor = "rgba(59, 130, 246, 0.3)"
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const xSpring = useSpring(x);
  const ySpring = useSpring(y);
  
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = (e.clientX - rect.left) * 100 / width;
    const mouseY = (e.clientY - rect.top) * 100 / height;
    
    const rX = (mouseY - 50) * 0.1;
    const rY = (mouseX - 50) * -0.1;
    
    x.set(rX);
    y.set(rY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      className={`relative perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        style={{
          transform,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
          }}
          whileHover={{ opacity: 1 }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          whileHover={{
            translateX: "200%",
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  className = "",
  delay = 0
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{ 
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Card3D; 
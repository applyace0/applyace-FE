import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  className = "",
  suffix = "",
  prefix = ""
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animation = animate(count, value, { duration });
    
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [value, duration, count, rounded]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

interface RollingNumberProps {
  value: number;
  className?: string;
}

export const RollingNumber: React.FC<RollingNumberProps> = ({ value, className = "" }) => {
  const digits = value.toString().split('');
  
  return (
    <div className={`flex ${className}`}>
      {digits.map((digit, index) => (
        <motion.div
          key={`${index}-${digit}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="relative overflow-hidden"
        >
          <motion.span
            key={digit}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="block"
          >
            {digit}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedCounter; 
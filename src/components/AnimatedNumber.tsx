
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className,
  duration = 1000,
  prefix = "",
  suffix = "",
  formatter = (v) => v.toLocaleString()
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    previousValueRef.current = displayValue;
    startTimeRef.current = null;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animateValue = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsedTime = timestamp - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const newValue = previousValueRef.current + (value - previousValueRef.current) * easedProgress;
      setDisplayValue(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateValue);
      }
    };

    animationRef.current = requestAnimationFrame(animateValue);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Easing function
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };

  return (
    <span className={cn("transition-all duration-300", className)}>
      {prefix}{formatter(Math.round(displayValue))}{suffix}
    </span>
  );
};

export default AnimatedNumber;

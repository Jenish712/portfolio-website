import React from 'react';
import { motion, useInView } from 'framer-motion';

const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 40,
  duration = 0.8,
  once = true,
  scale = 1,
  rotate = 0
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once,
    margin: "-50px 0px -50px 0px" // Trigger animation 50px before element enters view
  });

  const getInitialPosition = () => {
    const base = { opacity: 0, scale: scale < 1 ? scale : 0.9 };
    if (rotate !== 0) base.rotate = rotate;

    switch (direction) {
      case 'up':
        return { ...base, y: distance };
      case 'down':
        return { ...base, y: -distance };
      case 'left':
        return { ...base, x: distance };
      case 'right':
        return { ...base, x: -distance };
      case 'fade':
        return { ...base };
      default:
        return { ...base, y: distance };
    }
  };

  const getAnimatePosition = () => {
    return {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0
    };
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={isInView ? getAnimatePosition() : getInitialPosition()}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Improved easing for smoother animation
        scale: {
          duration: duration * 0.8,
          ease: [0.34, 1.56, 0.64, 1]
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export { ScrollReveal };
// Simple motion components to avoid the full framer-motion dependency in this prototype
// In a production app, you'd use framer-motion or another animation library

import { ReactElement, cloneElement } from "react";

interface MotionProps {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  children: ReactElement;
  className?: string;
  onClick?: () => void;
}

export const motion = {
  div: ({ initial, animate, transition, children, ...props }: MotionProps) => {
    return cloneElement(children, {
      style: {
        opacity: animate?.opacity ?? 1,
        transform: `translateY(${animate?.y ?? 0}px) translateX(${animate?.x ?? 0}px)`,
        transition: `all ${transition?.duration ?? 0.3}s ease-in-out ${transition?.delay ?? 0}s`,
      },
      ...props,
    });
  },
};
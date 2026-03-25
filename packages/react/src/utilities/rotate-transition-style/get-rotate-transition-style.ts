import type { CSSProperties } from 'react';

export function getRotateTransitionStyle(
  isOpen: boolean,
  {
    degrees = -180,
    duration = 0.2,
  }: { degrees?: number; duration?: number } = {},
): CSSProperties {
  return {
    transition: `rotate ${duration}s ease-out`,
    rotate: isOpen ? `${degrees}deg` : '0deg',
  };
}

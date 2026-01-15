import { useState } from 'react';

export default function useZoom(
  initialScale: number = 1,
  maxScale: number = 2,
  minScale: number = 0.5,
  step: number = 0.5,
) {
  const [scale, setScale] = useState(initialScale);

  const zoomIn = () => setScale((prev) => Math.min(prev + step, maxScale));
  const zoomOut = () => setScale((prev) => Math.max(prev - step, minScale));
  const resetZoom = () => setScale(initialScale);

  return {
    scale,
    zoomIn,
    zoomOut,
    resetZoom,
    setScale,
  };
}

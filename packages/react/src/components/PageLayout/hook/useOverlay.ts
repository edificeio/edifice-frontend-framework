import { useCallback } from 'react';

import { useOverlayStore } from '../store/overlayStore';

export const useOverlay = () => {
  const isOverlayOpen = useOverlayStore.use.overlayOpen();
  const updateOverlayOpen = useOverlayStore.use.updateOverlayOpen();

  const openOverlay = useCallback(() => {
    updateOverlayOpen(true);
  }, [updateOverlayOpen]);

  const closeOverlay = useCallback(() => {
    updateOverlayOpen(false);
  }, [updateOverlayOpen]);

  const toggleOverlay = useCallback(() => {
    updateOverlayOpen(!isOverlayOpen);
  }, [isOverlayOpen, updateOverlayOpen]);

  return {
    isOverlayOpen,
    openOverlay,
    closeOverlay,
    toggleOverlay,
  };
};

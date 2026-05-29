import { useCallback } from 'react';

import { useOverlayStore } from '../store/overlayStore';

export const useOverlay = () => {
  const overlayOpen = useOverlayStore.use.overlayOpen();
  const updateOverlayOpen = useOverlayStore.use.updateOverlayOpen();

  const openOverlay = useCallback(() => {
    updateOverlayOpen(true);
  }, [updateOverlayOpen]);

  const closeOverlay = useCallback(() => {
    updateOverlayOpen(false);
  }, [updateOverlayOpen]);

  const toggleOverlay = useCallback(() => {
    updateOverlayOpen(!overlayOpen);
  }, [overlayOpen, updateOverlayOpen]);

  return {
    overlayOpen,
    updateOverlayOpen,
    openOverlay,
    closeOverlay,
    toggleOverlay,
  };
};

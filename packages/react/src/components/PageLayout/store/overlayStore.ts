import { create } from 'zustand';
import { createSelectors } from '../../../utilities/create-selectors';

interface OverlayState {
  overlayOpen: boolean;
  updateOverlayOpen: (value: boolean) => void;
}

export const useOverlayStore = createSelectors(
  create<OverlayState>((set) => ({
    overlayOpen: false,
    updateOverlayOpen: (value) =>
      set((previousState) => ({
        ...previousState,
        overlayOpen: value,
      })),
  })),
);

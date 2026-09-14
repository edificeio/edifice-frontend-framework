import { UsefulLink, UsefulLinkPayload } from '@edifice.io/client';
import {
  useCreateUsefulLink,
  useDeleteUsefulLink,
  useUpdateUsefulLink,
  useUsefulLinks,
} from '../services/queries/usefulLinks';

/** Maximum number of useful links a user can save. */
export const MAX_USEFUL_LINKS = 10;

export interface UseUsefulLinksContainerReturn {
  links: UsefulLink[];
  isLoading: boolean;
  error: Error | null;
  /** Whether the user can still add a new link (fewer than MAX_USEFUL_LINKS). */
  canAddLink: boolean;
  createLink: (payload: UsefulLinkPayload) => Promise<UsefulLink>;
  isCreating: boolean;
  updateLink: (id: string, payload: UsefulLinkPayload) => Promise<UsefulLink>;
  isUpdating: boolean;
  deleteLink: (id: string) => void;
}

/**
 * Custom hook that provides useful links data and CRUD handlers.
 */
export const useUsefulLinksContainer = (): UseUsefulLinksContainerReturn => {
  const { data: links, isLoading, error } = useUsefulLinks();
  const createMutation = useCreateUsefulLink();
  const updateMutation = useUpdateUsefulLink();
  const deleteMutation = useDeleteUsefulLink();

  return {
    links: links ?? [],
    isLoading,
    error,
    canAddLink: (links?.length ?? 0) < MAX_USEFUL_LINKS,
    createLink: (payload) => createMutation.mutateAsync(payload),
    isCreating: createMutation.isPending,
    updateLink: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    isUpdating: updateMutation.isPending,
    deleteLink: (id) => deleteMutation.mutate(id),
  };
};

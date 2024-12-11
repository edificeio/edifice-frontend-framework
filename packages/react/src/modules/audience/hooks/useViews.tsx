import { odeServices } from '@edifice.io/client';
import { useRef } from 'react';

/**
 * This hook provides functions to easily call "audience" backend endpoints.
 * @param module application code, e.g. "blog"
 * @param resourceType type of resource, e.g. "post"
 * @returns functions to easily call "audience" backend endpoints.
 */
export default function useViews(module: string, resourceType: string) {
  const { views } = useRef(odeServices.audience(module, resourceType)).current;

  const getViewsCounter = (resourceIds: string[]) => {
    return views.getCounters(resourceIds);
  };

  const getViewsDetail = (resourceId: string) => {
    return views.getDetails(resourceId);
  };

  const triggerView = (resourceId: string) => {
    return views.trigger(resourceId);
  };

  return {
    getViewsCounter,
    getViewsDetail,
    triggerView,
  };
}

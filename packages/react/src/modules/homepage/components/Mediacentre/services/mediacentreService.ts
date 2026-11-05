import { odeServices } from '@edifice.io/client';
import { MediacentreResource } from '../types';

interface MediacentreSignetDTO {
  _id: string;
  title: string;
  image?: string;
  link?: string;
  url?: string;
  plain_text?: string;
}

interface MediacentreFavoritesDTO {
  event: string;
  state: string;
  status: string;
  data: MediacentreSignetDTO[] | Record<string, never>;
}

function toResource(signet: MediacentreSignetDTO): MediacentreResource {
  return {
    id: signet._id,
    title: signet.title,
    subtitle: signet.plain_text || undefined,
    href: signet.link || signet.url || '',
    imageUrl: signet.image || undefined,
  };
}

/**
 * Creates a service for the homepage "Médiacentre" widget, on top of the
 * `mediacentre` backend module.
 *
 * Backend contract:
 * - `GET /mediacentre/favorites` returns `{ status, data }`. A user who never
 *   selected a favorite gets `data: {}` (state "initialization"), which is an
 *   empty list and not an error.
 *
 * @param baseURL The base URL for the mediacentre service API.
 */
export const createMediacentreService = (baseURL: string) => ({
  /**
   * Get the current user's favorite resources.
   */
  async getFavorites(): Promise<MediacentreResource[]> {
    const http = odeServices.http();
    const body = await http.get<MediacentreFavoritesDTO>(
      `${baseURL}/mediacentre/favorites`,
    );
    if (http.isResponseError() || body?.status !== 'ok') {
      throw new Error('mediacentre.favorites.fetch.error');
    }
    return Array.isArray(body.data) ? body.data.map(toResource) : [];
  },
});

export const mediacentreService = createMediacentreService('');

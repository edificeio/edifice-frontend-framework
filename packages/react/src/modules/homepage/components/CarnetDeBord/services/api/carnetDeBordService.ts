import { odeServices } from '@edifice.io/client';
import { Structure } from '../../types';

/**
 * Creates the service of the homepage "Carnet de bord" (Pronote logbook)
 * widget.
 *
 * Backend contract: `GET /sso/pronote` returns one Pronote XML export per
 * structure of the user.
 *
 * @param baseURL The base URL for the Pronote SSO API.
 */
export const createCarnetDeBordService = (baseURL: string) => ({
  /**
   * Get the Pronote exports of the user's structures.
   */
  async getStructures(): Promise<Structure[]> {
    const body = await odeServices
      .http()
      .get<Structure[]>(`${baseURL}/sso/pronote`, {
        disableNotifications: true,
      });
    if (!Array.isArray(body)) throw new Error('carnet-de-bord.nodata');
    return body;
  },
});

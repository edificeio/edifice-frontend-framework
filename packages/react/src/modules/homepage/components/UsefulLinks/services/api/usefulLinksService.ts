import { odeServices, UsefulLink, UsefulLinkPayload } from '@edifice.io/client';

/**
 * Creates a useful links service with methods to manage the current user's
 * personal "useful links" (homepage "Liens utiles" widget).
 *
 * The `/directory/user/link` endpoint is provisional, tracked by IMPULS-6167
 * (backend CRUD for useful links), not yet implemented server-side.
 *
 * @param baseURL The base URL for the useful links service API.
 */
export const createUsefulLinksService = (baseURL: string) => ({
  /**
   * Get the current user's useful links.
   */
  getUsefulLinks(): Promise<UsefulLink[]> {
    return odeServices
      .http()
      .get<UsefulLink[]>(`${baseURL}/directory/user/link`);
  },

  /**
   * Create a new useful link.
   */
  createUsefulLink(payload: UsefulLinkPayload): Promise<UsefulLink> {
    return odeServices
      .http()
      .postJson<
        UsefulLinkPayload,
        UsefulLink
      >(`${baseURL}/directory/user/link`, payload);
  },

  /**
   * Update an existing useful link.
   */
  updateUsefulLink(
    id: string,
    payload: UsefulLinkPayload,
  ): Promise<UsefulLink> {
    return odeServices
      .http()
      .putJson<
        UsefulLinkPayload,
        UsefulLink
      >(`${baseURL}/directory/user/link/${id}`, payload);
  },

  /**
   * Delete a useful link.
   */
  deleteUsefulLink(id: string): Promise<void> {
    return odeServices.http().delete(`${baseURL}/directory/user/link/${id}`);
  },
});

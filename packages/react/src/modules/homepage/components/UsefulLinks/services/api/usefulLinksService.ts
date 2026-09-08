import { odeServices, UsefulLink, UsefulLinkPayload } from '@edifice.io/client';

/**
 * Creates a useful links service with methods to manage the current user's
 * personal "useful links" (homepage "Liens utiles" widget).
 *
 * Backend contract: `GET`/`POST`/`PUT`/`DELETE
 * /directory/user-links`. Known error codes: `directory.user.link.limit.reached`
 * (POST, 409), `directory.user.link.name.too.long` (POST/PUT, 400),
 * `directory.user.link.not.found` (PUT/DELETE, 400).
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
      .get<UsefulLink[]>(`${baseURL}/directory/user-links`);
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
      >(`${baseURL}/directory/user-links`, payload);
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
      >(`${baseURL}/directory/user-links/${id}`, payload);
  },

  /**
   * Delete a useful link.
   */
  deleteUsefulLink(id: string): Promise<void> {
    return odeServices.http().delete(`${baseURL}/directory/user-links/${id}`);
  },
});

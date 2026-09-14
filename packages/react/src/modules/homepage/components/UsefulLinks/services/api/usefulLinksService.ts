import { odeServices, UsefulLink, UsefulLinkPayload } from '@edifice.io/client';

interface BookmarkDTO {
  _id: string;
  name: string;
  url: string;
}

interface BookmarksResponse {
  _id: string;
  owner: { userId: string; displayName: string };
  bookmarks: BookmarkDTO[];
  created: { $date: string };
  modified: { $date: string };
}

const toUsefulLink = ({ _id, name, url }: BookmarkDTO): UsefulLink => ({
  id: _id,
  name,
  url,
});

/**
 * Creates a useful links service with methods to manage the current user's
 * personal "useful links" (homepage "Liens utiles" widget).
 *
 * Backend contract: `GET`/`POST`/`PUT`/`DELETE /bookmark/api/v2/bookmarks`.
 * `POST`/`PUT` only return the bookmark's `_id`, not the full resource.
 * Known error code: `bookmark.widget.bad.request.limit.reached` (POST, 400,
 * once the user already has 10 links). `PUT` returns 401 if the id doesn't
 * belong to the user, `DELETE` returns 404 if the id doesn't exist.
 *
 * @param baseURL The base URL for the useful links service API.
 */
export const createUsefulLinksService = (baseURL: string) => ({
  /**
   * Get the current user's useful links.
   */
  async getUsefulLinks(): Promise<UsefulLink[]> {
    const { bookmarks } = await odeServices
      .http()
      .get<BookmarksResponse>(`${baseURL}/bookmark/api/v2/bookmarks`);
    return bookmarks.map(toUsefulLink);
  },

  /**
   * Create a new useful link.
   */
  async createUsefulLink(payload: UsefulLinkPayload): Promise<UsefulLink> {
    const { _id } = await odeServices
      .http()
      .postJson<
        UsefulLinkPayload,
        { _id: string }
      >(`${baseURL}/bookmark/api/v2/bookmarks`, payload);
    return { id: _id, ...payload };
  },

  /**
   * Update an existing useful link.
   */
  async updateUsefulLink(
    id: string,
    payload: UsefulLinkPayload,
  ): Promise<UsefulLink> {
    await odeServices
      .http()
      .putJson<
        UsefulLinkPayload,
        { _id: string }
      >(`${baseURL}/bookmark/api/v2/bookmarks/${id}`, payload);
    return { id, ...payload };
  },

  /**
   * Delete a useful link.
   */
  async deleteUsefulLink(id: string): Promise<void> {
    await odeServices
      .http()
      .delete(`${baseURL}/bookmark/api/v2/bookmarks/${id}`);
  },
});

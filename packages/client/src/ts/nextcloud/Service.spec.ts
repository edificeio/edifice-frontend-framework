import { IOdeServices } from '../services/OdeServices';
import { NextcloudService } from './Service';

describe('NextcloudService', () => {
  const userId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  let httpMock: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
  };
  let service: NextcloudService;

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      put: vi.fn(),
    };
    const mockContext = {
      http: () => httpMock,
    } as unknown as IOdeServices;
    service = new NextcloudService(mockContext);
  });

  describe('listDocuments', () => {
    it('strips the webdav/userId prefix from nested paths', async () => {
      httpMock.get.mockResolvedValue({
        data: [
          {
            path: `/remote.php/dav/files/${userId}/Documents/Photos/`,
            displayname: 'Photos',
            isFolder: true,
          },
        ],
      });

      const result = await service.listDocuments(userId, '/Documents/');

      expect(result).toEqual([
        expect.objectContaining({
          path: '/Documents/Photos/',
          name: 'Photos',
        }),
      ]);
    });

    it('strips the prefix from the user root path', async () => {
      httpMock.get.mockResolvedValue({
        data: [
          {
            path: `/remote.php/dav/files/${userId}`,
            displayname: 'root',
            isFolder: true,
          },
        ],
      });

      const [result] = await service.listDocuments(userId);

      expect(result.path).toBe('/');
    });

    it('falls back to the raw path when the expected prefix is missing', async () => {
      httpMock.get.mockResolvedValue({
        data: [
          {
            path: '/unexpected/shape.txt',
            displayname: 'shape.txt',
            isFolder: false,
          },
        ],
      });

      const [result] = await service.listDocuments(userId);

      expect(result.path).toBe('/unexpected/shape.txt');
    });

    it('decodes percent-encoded segments in path and name', async () => {
      httpMock.get.mockResolvedValue({
        data: [
          {
            path: `/remote.php/dav/files/${userId}/My%20Folder/`,
            displayname: 'My%20Folder',
            isFolder: true,
          },
        ],
      });

      const [result] = await service.listDocuments(userId);

      expect(result.path).toBe('/My Folder/');
      expect(result.name).toBe('My Folder');
    });

    it('omits the query param when no path is given', async () => {
      httpMock.get.mockResolvedValue({ data: [] });

      await service.listDocuments(userId);

      expect(httpMock.get).toHaveBeenCalledWith(
        `/nextcloud/files/user/${userId}`,
        { queryParams: undefined },
      );
    });
  });

  describe('copyDocumentToWorkspace', () => {
    it('builds repeated bare `path=` query params instead of `path[]=`', async () => {
      httpMock.put.mockResolvedValue({ data: [] });

      await service.copyDocumentToWorkspace(userId, ['/a.txt', '/b c.txt']);

      expect(httpMock.put).toHaveBeenCalledWith(
        `/nextcloud/files/user/${userId}/copy/workspace?path=%2Fa.txt&path=%2Fb%20c.txt`,
        undefined,
        { queryParams: undefined },
      );
    });

    it('filters out null results and forwards parentId', async () => {
      httpMock.put.mockResolvedValue({
        data: [{ _id: '1' }, null, { _id: '2' }],
      });

      const result = await service.copyDocumentToWorkspace(
        userId,
        ['/a.txt'],
        'folder-id',
      );

      expect(result).toEqual([{ _id: '1' }, { _id: '2' }]);
      expect(httpMock.put).toHaveBeenCalledWith(expect.any(String), undefined, {
        queryParams: { parentId: 'folder-id' },
      });
    });
  });

  describe('getOauth2Status', () => {
    it('calls the status endpoint for the given user', async () => {
      httpMock.get.mockResolvedValue({ connected: true });

      const result = await service.getOauth2Status(userId);

      expect(result).toEqual({ connected: true });
      expect(httpMock.get).toHaveBeenCalledWith(
        `/nextcloud/user/${userId}/oauth2/status`,
      );
    });
  });

  describe('getFileUrl', () => {
    it('builds a download URL with encoded query params', () => {
      const url = service.getFileUrl(userId, {
        path: '/My Folder/file.txt',
        name: 'file.txt',
        contentType: 'text/plain',
        isFolder: false,
      });

      expect(url).toBe(
        `/nextcloud/files/user/${userId}/file/file.txt/download?path=%2FMy%20Folder%2Ffile.txt&contentType=text%2Fplain&isFolder=false`,
      );
    });
  });
});

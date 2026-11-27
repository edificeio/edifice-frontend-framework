import { IOdeServices } from '../services/OdeServices';
import { GoogleDriveCopyError, GoogleDriveService } from './Service';

describe('GoogleDriveService', () => {
  const userId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  let httpMock: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
  };
  let service: GoogleDriveService;

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      put: vi.fn(),
    };
    const mockContext = {
      http: () => httpMock,
    } as unknown as IOdeServices;
    service = new GoogleDriveService(mockContext);
  });

  describe('listDocuments', () => {
    it('maps the raw DTO onto a GoogleDriveDocument', async () => {
      httpMock.get.mockResolvedValue({
        data: [
          {
            id: 'doc-1',
            name: 'Rapport.pdf',
            mimeType: 'application/pdf',
            size: 1024,
            modifiedTime: '2026-01-15T10:30:00.000Z',
            shared: true,
            ownerDisplayName: 'Alex Martin',
          },
        ],
      });

      const [result] = await service.listDocuments(userId);

      expect(result).toEqual({
        id: 'doc-1',
        name: 'Rapport.pdf',
        contentType: 'application/pdf',
        size: 1024,
        isFolder: false,
        canCopyToWorkspace: true,
        lastModified: '2026-01-15T10:30:00.000Z',
        shared: true,
        ownerDisplayName: 'Alex Martin',
      });
    });

    it('flags folders from their Google mime type', async () => {
      httpMock.get.mockResolvedValue({
        data: [
          {
            id: 'folder-1',
            name: 'Photos',
            mimeType: 'application/vnd.google-apps.folder',
          },
          {
            id: 'doc-1',
            name: 'Notes',
            mimeType: 'application/vnd.google-apps.document',
          },
        ],
      });

      const [folder, nativeDoc] = await service.listDocuments(userId);

      expect(folder.isFolder).toBe(true);
      // A native Google document is not a folder, despite its google-apps type.
      expect(nativeDoc.isFolder).toBe(false);
    });

    it('flags the Google-native documents Drive cannot export to the workspace', async () => {
      const mimeTypes = {
        pdf: 'application/pdf',
        folder: 'application/vnd.google-apps.folder',
        doc: 'application/vnd.google-apps.document',
        sheet: 'application/vnd.google-apps.spreadsheet',
        slides: 'application/vnd.google-apps.presentation',
        form: 'application/vnd.google-apps.form',
        vid: 'application/vnd.google-apps.vid',
      };
      httpMock.get.mockResolvedValue({
        data: Object.entries(mimeTypes).map(([id, mimeType]) => ({
          id,
          name: id,
          mimeType,
        })),
      });

      const docs = await service.listDocuments(userId);

      expect(
        Object.fromEntries(docs.map((doc) => [doc.id, doc.canCopyToWorkspace])),
      ).toEqual({
        pdf: true,
        folder: true,
        doc: true,
        sheet: true,
        slides: true,
        form: false,
        vid: false,
      });
    });

    it('sends the parent folder id as the `path` query param', async () => {
      httpMock.get.mockResolvedValue({ data: [] });

      await service.listDocuments(userId, 'folder-1');

      expect(httpMock.get).toHaveBeenCalledWith(
        `/googledrive/files/user/${userId}`,
        { queryParams: { path: 'folder-1' } },
      );
    });

    it('omits the query params when listing the Drive root', async () => {
      httpMock.get.mockResolvedValue({ data: [] });

      await service.listDocuments(userId);

      expect(httpMock.get).toHaveBeenCalledWith(
        `/googledrive/files/user/${userId}`,
        { queryParams: undefined },
      );
    });
  });

  describe('listSharedDocuments', () => {
    it('lists the documents shared with the user, owned by their first owner', async () => {
      httpMock.get.mockResolvedValue({
        data: [
          {
            id: 'doc-1',
            name: 'Cours.pdf',
            mimeType: 'application/pdf',
            modifiedTime: '2026-01-15T10:30:00.000Z',
            role: 'writer',
            owners: [{ displayName: 'Alex Martin' }],
          },
        ],
      });

      const [result] = await service.listSharedDocuments(userId);

      expect(httpMock.get).toHaveBeenCalledWith(
        `/googledrive/files/user/${userId}/shared`,
      );
      expect(result).toEqual({
        id: 'doc-1',
        name: 'Cours.pdf',
        contentType: 'application/pdf',
        isFolder: false,
        canCopyToWorkspace: true,
        lastModified: '2026-01-15T10:30:00.000Z',
        ownerDisplayName: 'Alex Martin',
      });
    });

    it('only lets a document shared for editing be copied to the workspace', async () => {
      const shared = (id: string, role: string | null, mimeType: string) => ({
        id,
        name: id,
        mimeType,
        role,
      });
      httpMock.get.mockResolvedValue({
        data: [
          shared('writer', 'writer', 'application/pdf'),
          shared('commenter', 'commenter', 'application/pdf'),
          shared('reader', 'reader', 'application/pdf'),
          shared('unknown', null, 'application/pdf'),
          shared('folder', 'reader', 'application/vnd.google-apps.folder'),
          // Edit rights don't make a Google Form exportable.
          shared('form', 'writer', 'application/vnd.google-apps.form'),
        ],
      });

      const docs = await service.listSharedDocuments(userId);

      expect(
        Object.fromEntries(docs.map((doc) => [doc.id, doc.canCopyToWorkspace])),
      ).toEqual({
        writer: true,
        commenter: false,
        reader: false,
        unknown: false,
        folder: false,
        form: false,
      });
    });
  });

  describe('copyDocumentToWorkspace', () => {
    it('repeats the bare `id` key once per document', async () => {
      httpMock.put.mockResolvedValue({
        data: [
          { id: 'doc 1', status: 'ok', workspace: { _id: 'ws-1' } },
          { id: 'doc/2', status: 'ok', workspace: { _id: 'ws-2' } },
        ],
      });

      await service.copyDocumentToWorkspace(userId, ['doc 1', 'doc/2']);

      const [url] = httpMock.put.mock.calls[0];
      expect(url).toBe(
        `/googledrive/files/user/${userId}/copy/workspace?id=doc%201&id=doc%2F2`,
      );
    });

    it('unwraps the workspace element nested in each result', async () => {
      httpMock.put.mockResolvedValue({
        data: [
          { id: 'doc-1', status: 'ok', workspace: { _id: 'ws-1', name: 'a' } },
        ],
      });

      const result = await service.copyDocumentToWorkspace(userId, ['doc-1']);

      expect(result).toEqual([{ _id: 'ws-1', name: 'a' }]);
    });

    it('forwards parentId, application and the protected flag', async () => {
      httpMock.put.mockResolvedValue({
        data: [{ id: 'doc-1', status: 'ok', workspace: { _id: 'ws-1' } }],
      });

      await service.copyDocumentToWorkspace(userId, ['doc-1'], 'parent-1', {
        application: 'blog',
        visibility: 'protected',
      });

      expect(httpMock.put).toHaveBeenCalledWith(expect.any(String), undefined, {
        queryParams: {
          parentId: 'parent-1',
          application: 'blog',
          protected: true,
        },
      });
    });

    it('does not send the protected flag for a public visibility', async () => {
      httpMock.put.mockResolvedValue({
        data: [{ id: 'doc-1', status: 'ok', workspace: { _id: 'ws-1' } }],
      });

      await service.copyDocumentToWorkspace(userId, ['doc-1'], undefined, {
        visibility: 'public',
      });

      const [, , options] = httpMock.put.mock.calls[0];
      expect(options.queryParams).not.toHaveProperty('protected');
    });

    it('reports failed documents while keeping the copied ones', async () => {
      httpMock.put.mockResolvedValue({
        data: [
          { id: 'doc-1', status: 'ok', workspace: { _id: 'ws-1' } },
          { id: 'doc-2', status: 'error', message: 'Quota exceeded' },
        ],
      });

      const error = await service
        .copyDocumentToWorkspace(userId, ['doc-1', 'doc-2'])
        .catch((caught) => caught);

      expect(error).toBeInstanceOf(GoogleDriveCopyError);
      expect(error.copied).toEqual([{ _id: 'ws-1' }]);
      expect(error.failures).toEqual([
        { id: 'doc-2', message: 'Quota exceeded' },
      ]);
    });

    it('treats a document missing from the response as a failure', async () => {
      httpMock.put.mockResolvedValue({
        data: [{ id: 'doc-1', status: 'ok', workspace: { _id: 'ws-1' } }],
      });

      const error = await service
        .copyDocumentToWorkspace(userId, ['doc-1', 'doc-2'])
        .catch((caught) => caught);

      expect(error).toBeInstanceOf(GoogleDriveCopyError);
      expect(error.failures).toEqual([{ id: 'doc-2', message: undefined }]);
    });

    it('resolves without throwing when every document was copied', async () => {
      httpMock.put.mockResolvedValue({
        data: [{ id: 'doc-1', status: 'ok', workspace: { _id: 'ws-1' } }],
      });

      await expect(
        service.copyDocumentToWorkspace(userId, ['doc-1']),
      ).resolves.toEqual([{ _id: 'ws-1' }]);
    });
  });

  describe('getFileUrl', () => {
    it('encodes the document id and carries the folder flag', () => {
      const url = service.getFileUrl(userId, {
        id: 'doc/1',
        name: 'Rapport.pdf',
        isFolder: false,
        canCopyToWorkspace: true,
      });

      expect(url).toBe(
        `/googledrive/files/user/${userId}/file/doc%2F1/download?isFolder=false`,
      );
    });
  });
});

import {
  NextcloudDocument,
  Role,
  WorkspaceElement,
  odeServices,
} from '@edifice.io/client';

import { useUser } from '../../../../hooks/useUser';
import { Nextcloud as Component } from '../../Nextcloud';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export const Nextcloud = () => {
  const { type, setResultCounter, setResult, setPreSuccess, multiple } =
    useMediaLibraryContext();
  const { user } = useUser();

  function getDocumentRoleFilter(): Role | Role[] | null {
    switch (type) {
      case 'image':
        return 'img';
      case 'audio':
        return 'audio';
      case 'video':
        return 'video';
      default:
        return null; // = all document roles
    }
  }

  function handleSelect(result: NextcloudDocument[]) {
    setResultCounter(result.length);
    if (result.length) {
      // Placeholder to enable the Add button; the actual copy to workspace
      // happens in the preSuccess action below, whose result is used instead.
      setResult(result);
      setPreSuccess(
        () => (): Promise<WorkspaceElement[]> =>
          user?.userId
            ? odeServices.nextcloud().copyDocumentToWorkspace(
                user.userId,
                result.map((doc) => doc.path),
              )
            : Promise.resolve([]),
      );
    } else {
      setResult();
      setPreSuccess(undefined);
    }
  }

  return (
    <Component
      roles={getDocumentRoleFilter()}
      onSelect={handleSelect}
      multiple={multiple}
      className="border rounded overflow-y-auto"
    />
  );
};

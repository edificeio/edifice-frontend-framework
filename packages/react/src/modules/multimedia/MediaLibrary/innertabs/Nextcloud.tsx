import {
  NextcloudDocument,
  WorkspaceElement,
  odeServices,
} from '@edifice.io/client';

import { useUser } from '../../../../hooks';
import { Nextcloud as Component } from '../../Nextcloud';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export const Nextcloud = () => {
  const { setResultCounter, setResult, setPreSuccess, multiple } =
    useMediaLibraryContext();
  const { user } = useUser();

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
      onSelect={handleSelect}
      multiple={multiple}
      className="border rounded overflow-y-auto"
    />
  );
};

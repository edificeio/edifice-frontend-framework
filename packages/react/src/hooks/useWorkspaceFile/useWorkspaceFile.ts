import {
  WorkspaceElement,
  WorkspaceVisibility,
  odeServices,
} from '@edifice.io/client';

const useWorkspaceFile = () => {
  /**
   * This function create a file into workspace if the uri is not from workspace
   * If the uri is an URI from workspace it only updates it
   *
   * @param param0.alt the alternative text related to the file
   * @param param0.legend the legend text related to the file
   * @param param0.blob the file as Blob
   * @param param0.uri the previous URI of this file (or undefined if this is a new file)
   * @param param0.parentId the folder parentId
   * @param param0.application the application related to this file
   * @returns the new workspace URI
   */
  const createOrUpdate = async ({
    alt,
    uri,
    blob,
    legend,
    parentId,
    application,
    visibility,
  }: {
    blob: Blob;
    uri?: string;
    alt?: string;
    legend?: string;
    application?: string;
    parentId?: string;
    visibility?: WorkspaceVisibility;
  }) => {
    const regex = /\/workspace\/document\/([0-9a-fA-F-]+)/;
    const matches = (uri ?? '').match(regex);
    if (matches && matches.length === 2) {
      const uuid = matches[1];

      // Get previous documents
      const existingDocuments = await odeServices.workspace().searchDocuments({
        filter: 'all',
        id: uuid,
        limit: 1,
      });
      // Get name from current document
      const name = existingDocuments.length
        ? existingDocuments[0].name
        : undefined;

      // Update the file
      await odeServices
        .workspace()
        .updateFile(uuid, blob, { alt, legend, name });

      // Get updated file because `updateFile` method doesnt return information
      const updatedDocuments = await odeServices.workspace().searchDocuments({
        filter: 'all',
        id: uuid,
        limit: 1,
      });
      const updatedFile = updatedDocuments[0];

      /**
       * need the file: updatedFile to update correctly uploadedFiles
       */
      return {
        file: updatedFile,
        src: `/workspace/${updatedFile.public ? 'pub/' : ''}document/${uuid}`,
      };
    } else {
      const res = await odeServices
        .workspace()
        .saveFile(blob, { application, parentId, visibility });
      return `/workspace/${res.public ? 'pub/' : ''}document/${res._id}`;
    }
  };
  // const get = () => {}
  const create = async (
    file: File,
    params?: {
      visibility?: WorkspaceVisibility;
      application?: string | undefined;
    },
  ) => {
    return await odeServices.workspace().saveFile(file, params);
  };

  // const put = () => {}

  const remove = async (file: WorkspaceElement | WorkspaceElement[]) => {
    const noop = !file || (Array.isArray(file) && file.length === 0);
    return noop
      ? Promise.resolve()
      : await odeServices
          .workspace()
          .deleteFile(Array.isArray(file) ? file : [file]);
  };

  return {
    createOrUpdate,
    // get,
    create,
    // put,
    remove,
  };
};

export default useWorkspaceFile;

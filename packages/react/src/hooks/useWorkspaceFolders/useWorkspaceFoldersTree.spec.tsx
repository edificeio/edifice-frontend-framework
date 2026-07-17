import { ReactNode } from 'react';

import { IUserInfo, WorkspaceElement } from '@edifice.io/client';
import { act, renderHook } from '~/setup';
import { EdificeClientContext } from '../../providers/EdificeClientProvider/EdificeClientProvider.context';
import useWorkspaceFoldersTree, {
  WORKSPACE_SHARED_FOLDER_ID,
  WORKSPACE_USER_FOLDER_ID,
} from './useWorkspaceFoldersTree';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <EdificeClientContext.Provider
      value={{ user: { userId: 'user-1' } as IUserInfo } as any}
    >
      {children}
    </EdificeClientContext.Provider>
  );
}

const folders = [
  { _id: 'owner-1', name: 'Owner Folder', isShared: false },
  { _id: 'owner-2', name: 'Owner Child', isShared: false, eParent: 'owner-1' },
  { _id: 'shared-1', name: 'Shared Folder', isShared: true },
] as WorkspaceElement[];

describe('useWorkspaceFoldersTree', () => {
  it('builds a user root and a shared root, each with its own children', () => {
    const { result } = renderHook(() => useWorkspaceFoldersTree(folders), {
      wrapper,
    });

    const [userRoot, sharedRoot] = result.current.foldersTree;
    expect(userRoot.id).toBe(WORKSPACE_USER_FOLDER_ID);
    expect(sharedRoot.id).toBe(WORKSPACE_SHARED_FOLDER_ID);
    expect(userRoot.children).toHaveLength(1);
    expect(userRoot.children?.[0]).toEqual(
      expect.objectContaining({ id: 'owner-1', name: 'Owner Folder' }),
    );
    expect(sharedRoot.children).toEqual([
      expect.objectContaining({ id: 'shared-1', name: 'Shared Folder' }),
    ]);
  });

  it('nests a folder under its parent via eParent', () => {
    const { result } = renderHook(() => useWorkspaceFoldersTree(folders), {
      wrapper,
    });

    const [userRoot] = result.current.foldersTree;
    expect(userRoot.children?.[0].children).toEqual([
      expect.objectContaining({ id: 'owner-2', name: 'Owner Child' }),
    ]);
  });

  it('builds empty roots when no folders are given', () => {
    const { result } = renderHook(() => useWorkspaceFoldersTree(undefined), {
      wrapper,
    });

    const [userRoot, sharedRoot] = result.current.foldersTree;
    expect(userRoot.children).toEqual([]);
    expect(sharedRoot.children).toEqual([]);
  });

  it('filters the tree by name, keeping ancestors of matching descendants', () => {
    const { result, rerender } = renderHook(
      () => useWorkspaceFoldersTree(folders),
      { wrapper },
    );

    act(() => result.current.filterTree('child'));
    rerender();

    const [userRoot] = result.current.foldersTree;
    expect(userRoot.children).toHaveLength(1);
    expect(userRoot.children?.[0].id).toBe('owner-1');
    expect(userRoot.children?.[0].children).toEqual([
      expect.objectContaining({ id: 'owner-2' }),
    ]);
  });

  it('returns the full tree again once the search query is cleared', () => {
    const { result, rerender } = renderHook(
      () => useWorkspaceFoldersTree(folders),
      { wrapper },
    );

    act(() => result.current.filterTree('child'));
    rerender();
    act(() => result.current.filterTree(''));
    rerender();

    const [userRoot, sharedRoot] = result.current.foldersTree;
    expect(userRoot.children).toHaveLength(1);
    expect(sharedRoot.children).toHaveLength(1);
  });
});

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import {
  Role,
  WorkspaceElement,
  WorkspaceSearchFilter,
} from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  EmptyScreen,
  Grid,
  LoadingScreen,
  SearchBar,
  TreeView,
  TreeViewHandlers_V1,
} from '../../../components';
import { findTreeNode } from '../../../components/TreeView/utilities';
import { useWorkspaceSearch } from '../../../hooks';
import { FolderNode } from '../../../hooks/useWorkspaceSearch/useWorkspaceSearch';
import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconSortTime,
} from '../../icons/components';
import { FileCard } from '../FileCard';

import illuTrash from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-trash.svg';

/**
 * MediaLibrary component properties
 */
export interface WorkspaceProps {
  /**
   * Only display media elements having this role[s] (=generic file format).
   * Set to null to display all medias.
   */
  roles: Role | Role[] | null;
  /**
   * If defined, try to auto-select the folder dedicated to this filter.
   */
  defaultFolder?: WorkspaceSearchFilter;
  /**
   * Allow selecting public documents.
   */
  showPublicFolder?: boolean;
  /**
   * Notify parent when media elements are successfully selected.
   */
  onSelect: (result: WorkspaceElement[]) => void;
  /**
   * Boolean to know if we can select 1 or many files.
   */
  multiple?: boolean | undefined;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const Workspace = ({
  roles,
  onSelect,
  multiple = true,
  className,
  defaultFolder,
  showPublicFolder,
}: WorkspaceProps) => {
  const { t } = useTranslation();

  const { root: ownerRoot, loadContent: loadOwnerDocs } = useWorkspaceSearch(
    'root',
    t('workspace.tree.owner'),
    'owner',
    roles,
  );
  const { root: sharedRoot, loadContent: loadSharedDocs } = useWorkspaceSearch(
    'root',
    t('workspace.tree.shared'),
    'shared',
    roles,
  );
  const { root: protectRoot, loadContent: loadProtectedDocs } =
    useWorkspaceSearch(
      'root',
      t('workspace.tree.protected'),
      'protected',
      roles,
    );
  const { root: publicRoot, loadContent: loadPublicDocs } = useWorkspaceSearch(
    'root',
    t('workspace.tree.public'),
    'public',
    roles,
  );

  const ownerRef = useRef<TreeViewHandlers_V1>(null);
  const sharedRef = useRef<TreeViewHandlers_V1>(null);
  const protectRef = useRef<TreeViewHandlers_V1>(null);
  const publicRef = useRef<TreeViewHandlers_V1>(null);

  const [currentFilter, setCurrentFilter] = useState<WorkspaceSearchFilter>(
    () => {
      // Determine which root folder to load at first.
      if ('public' === defaultFolder) {
        return showPublicFolder ? defaultFolder : 'protected';
      }
      if ('protected' === defaultFolder || 'shared' === defaultFolder)
        return defaultFolder;
      return 'owner';
    },
  );

  const [currentNode, setCurrentNode] = useState<FolderNode>(() => {
    // Determine which root folder to load at first.
    if ('public' === defaultFolder) {
      return showPublicFolder ? publicRoot : protectRoot;
    }
    if ('protected' === defaultFolder) return protectRoot;
    if ('shared' === defaultFolder) return sharedRoot;
    return ownerRoot;
  });

  const [documents, setDocuments] = useState<WorkspaceElement[] | undefined>();

  const [searchTerm, setSearchTerm] = useState<string | undefined>(null!);

  const [sortOrder, setSortOrder] = useState<[string, string]>([
    'modified',
    'desc',
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<
    WorkspaceElement[]
  >([]);

  /**
   * Retrieve the stateful TreeNode matching a WorkspaceSearchFilter value
   */
  const rootNodeFor: (filter: WorkspaceSearchFilter) => {
    root: FolderNode;
    othersRef: React.RefObject<TreeViewHandlers_V1>[];
  } = useCallback(
    (filter: WorkspaceSearchFilter) => {
      switch (filter) {
        case 'owner':
          return {
            root: ownerRoot,
            othersRef: [sharedRef, protectRef, publicRef],
          };
        case 'shared':
          return {
            root: sharedRoot,
            othersRef: [ownerRef, protectRef, publicRef],
          };
        case 'protected':
          return {
            root: protectRoot,
            othersRef: [ownerRef, sharedRef, publicRef],
          };
        case 'public':
          return {
            root: publicRoot,
            othersRef: [ownerRef, sharedRef, protectRef],
          };
        default:
          throw 'no.root.node';
      }
    },
    [ownerRoot, sharedRoot, protectRoot, publicRoot],
  );

  /**
   * Load current node children (folders and files)
   */
  const loadContent = useCallback(() => {
    switch (currentFilter) {
      case 'owner':
        loadOwnerDocs(currentNode.id);
        break;
      case 'shared':
        loadSharedDocs(currentNode.id);
        break;
      case 'protected':
        loadProtectedDocs(currentNode.id);
        break;
      case 'public':
        loadPublicDocs(currentNode.id);
        break;
      default:
        throw 'no.way';
    }
  }, [
    currentFilter,
    currentNode.id,
    loadOwnerDocs,
    loadProtectedDocs,
    loadPublicDocs,
    loadSharedDocs,
  ]);

  function selectAndLoadContent(filter: WorkspaceSearchFilter, nodeId: string) {
    // Apply filters and nodeId, and send a command to the node's Tree
    setCurrentFilter(filter);
    const { root, othersRef } = rootNodeFor(filter);
    const targetNode = findTreeNode(root, (node) => node.id === nodeId);
    if (targetNode) {
      setCurrentNode(targetNode);
      // Reset others current selection, if any
      othersRef.forEach((otherRef) => otherRef.current?.unselectAll());
    }
  }

  /** Select a tree node */
  useEffect(() => {
    let ref;
    switch (currentFilter) {
      case 'owner':
        ref = ownerRef;
        break;
      case 'shared':
        ref = sharedRef;
        break;
      case 'protected':
        ref = protectRef;
        break;
      case 'public':
        ref = publicRef;
        break;
      default:
        return;
    }
    // Selecting a tree node here will trigger a selectAndLoadContent()
    ref?.current?.select('root');
  }, [currentFilter]);

  /** Load content when the callback is updated. */
  useEffect(loadContent, [loadContent]);

  /** Display documents when currentNode or searchTerm or sortOrder changes */
  useEffect(() => {
    if (currentNode.files) {
      let list = ([] as WorkspaceElement[]).concat(currentNode.files);
      // Apply search terms
      if (searchTerm) {
        list = list.filter((f) => f.name.indexOf(searchTerm) >= 0);
      }
      // Apply sort order
      const sortFunction: (a: any, b: any) => number =
        sortOrder[0] === 'name'
          ? sortOrder[1] === 'asc'
            ? (a, b) => compare(a.name, b.name)
            : (a, b) => compare(b.name, a.name)
          : (a, b) => compare(b.modified, a.modified);

      setDocuments(() => list.sort(sortFunction));
    } else {
      setDocuments(undefined);
    }
  }, [
    currentNode,
    ownerRoot,
    protectRoot,
    sharedRoot,
    publicRoot,
    searchTerm,
    sortOrder,
  ]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm],
  );

  function compare(a: string, b: string) {
    if (!a) return -1;
    if (!b) return 1;
    return a.localeCompare(b);
  }

  function getSortOrderLabel() {
    return sortOrder[0] === 'name'
      ? sortOrder[1] === 'asc'
        ? t('sort.order.alpha.asc')
        : t('sort.order.alpha.desc')
      : t('sort.order.modify.desc');
  }

  function handleSelectDoc(doc: WorkspaceElement) {
    let currentDocuments = [...selectedDocuments];
    if (!multiple) {
      currentDocuments = [doc];
    } else if (currentDocuments.includes(doc)) {
      currentDocuments = currentDocuments.filter(
        (selectedDocument) => selectedDocument._id !== doc._id,
      );
    } else {
      currentDocuments = [...currentDocuments, doc];
    }
    setSelectedDocuments(currentDocuments);
    onSelect(currentDocuments);
  }

  const workspace = clsx('workspace flex-grow-1 gap-0', className);

  return (
    <Grid className={workspace}>
      <Grid.Col
        sm="12"
        md="3"
        xl="4"
        className="workspace-folders p-12 pt-0 gap-12"
      >
        <div style={{ position: 'sticky', top: 0, paddingTop: '1.2rem' }}>
          <TreeView
            ref={ownerRef}
            data={ownerRoot}
            onTreeItemClick={(nodeId) => selectAndLoadContent('owner', nodeId)}
            onTreeItemUnfold={(nodeId) => selectAndLoadContent('owner', nodeId)}
          />
          <TreeView
            ref={sharedRef}
            data={sharedRoot}
            onTreeItemClick={(nodeId) => selectAndLoadContent('shared', nodeId)}
            onTreeItemUnfold={(nodeId) =>
              selectAndLoadContent('shared', nodeId)
            }
          />
          <TreeView
            ref={protectRef}
            data={protectRoot}
            onTreeItemClick={(nodeId) =>
              selectAndLoadContent('protected', nodeId)
            }
            onTreeItemUnfold={(nodeId) =>
              selectAndLoadContent('protected', nodeId)
            }
          />
          {showPublicFolder && (
            <TreeView
              ref={publicRef}
              data={publicRoot}
              onTreeItemClick={(nodeId) =>
                selectAndLoadContent('public', nodeId)
              }
              onTreeItemUnfold={(nodeId) =>
                selectAndLoadContent('public', nodeId)
              }
            />
          )}
        </div>
      </Grid.Col>
      <Grid.Col sm="12" md="5" xl="8">
        <Grid className="flex-grow-1 gap-0">
          <Grid.Col sm="4" md="8" xl="12">
            <div className="workspace-search px-16 py-8 ">
              <SearchBar
                isVariant={true}
                className="gap-16"
                onChange={handleSearchChange}
              />
            </div>
            <div className="d-flex align-items-center justify-content-end px-8 py-4">
              <small className="text-muted">
                {t('workspace.search.order')}
              </small>
              <Dropdown>
                <Dropdown.Trigger
                  size="sm"
                  label={getSortOrderLabel()}
                  variant="ghost"
                />
                <Dropdown.Menu>
                  <Dropdown.Item
                    icon={<IconSortTime />}
                    onClick={() => setSortOrder(['modified', 'desc'])}
                  >
                    {t('sort.order.modify.desc')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    icon={<IconSortAscendingLetters />}
                    onClick={() => setSortOrder(['name', 'asc'])}
                  >
                    {t('sort.order.alpha.asc')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    icon={<IconSortDescendingLetters />}
                    onClick={() => setSortOrder(['name', 'desc'])}
                  >
                    {t('sort.order.alpha.desc')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Grid.Col>
          <Grid.Col sm="4" md="8" xl="12" className="p-8 gap-8">
            {!documents ? (
              <LoadingScreen />
            ) : documents.length !== 0 ? (
              <div className="grid grid-workspace">
                {documents.map((doc) => {
                  const isSelected = selectedDocuments.includes(doc);
                  return (
                    <FileCard
                      key={doc._id}
                      doc={doc}
                      isSelected={isSelected}
                      onClick={() => handleSelectDoc(doc)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyScreen
                imageSrc={illuTrash}
                text={t('workspace.empty.docSpace')}
                title={t('explorer.emptyScreen.trash.title')}
              />
            )}
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};
export default Workspace;

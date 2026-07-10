import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { NextcloudDocument } from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Dropdown } from '../../../components/Dropdown';
import { EmptyScreen } from '../../../components/EmptyScreen';
import { Grid } from '../../../components/Grid';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { SearchBar } from '../../../components/SearchBar';
import { TreeView, TreeViewHandlers_V1 } from '../../../components/TreeView';
import { findTreeNode } from '../../../components/TreeView/utilities';
import { useNextcloudSearch, useUser } from '../../../hooks';
import { NextcloudFolderNode } from '../../../hooks/useNextcloudSearch/useNextcloudSearch';
import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconSortTime,
} from '../../icons/components';
import { NextcloudFileCard } from '../FileCard';

const ROOT_ID = 'root';

function compare(a?: string, b?: string) {
  if (!a) return -1;
  if (!b) return 1;
  return a.localeCompare(b);
}

/**
 * Nextcloud component properties
 */
export interface NextcloudProps {
  /**
   * Notify parent when media elements are successfully selected.
   */
  onSelect: (result: NextcloudDocument[]) => void;
  /**
   * Boolean to know if we can select 1 or many files.
   */
  multiple?: boolean | undefined;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const Nextcloud = ({
  onSelect,
  multiple = true,
  className,
}: NextcloudProps) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const { root, loadContent } = useNextcloudSearch(
    ROOT_ID,
    t('nextcloud.tree.root'),
    user?.userId,
  );

  const treeRef = useRef<TreeViewHandlers_V1>(null);

  const [currentNodeId, setCurrentNodeId] = useState<string>(ROOT_ID);

  const currentNode: NextcloudFolderNode =
    (findTreeNode(
      root,
      (node) => node.id === currentNodeId,
    ) as NextcloudFolderNode) ?? root;

  const [searchTerm, setSearchTerm] = useState<string | undefined>(null!);

  const [sortOrder, setSortOrder] = useState<[string, string]>([
    'modified',
    'desc',
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<
    NextcloudDocument[]
  >([]);

  const handleTreeItemChange = useCallback(
    (nodeId: string) => {
      setCurrentNodeId(nodeId);
      loadContent(nodeId);
    },
    [loadContent],
  );

  /** Load root content once and select it in the tree. */
  useEffect(() => {
    loadContent(ROOT_ID);
    treeRef.current?.select(ROOT_ID);
  }, [loadContent]);

  /** Derive documents from currentNode, searchTerm and sortOrder. */
  const documents = useMemo(() => {
    if (!currentNode.files) return undefined;
    let list = ([] as NextcloudDocument[]).concat(currentNode.files);
    if (searchTerm) {
      list = list.filter((f) => f.name.indexOf(searchTerm) >= 0);
    }
    const sortFunction: (a: NextcloudDocument, b: NextcloudDocument) => number =
      sortOrder[0] === 'name'
        ? sortOrder[1] === 'asc'
          ? (a, b) => compare(a.name, b.name)
          : (a, b) => compare(b.name, a.name)
        : (a, b) => compare(b.lastModified, a.lastModified);

    return list.sort(sortFunction);
    // `root` is required: nodes are mutated in place by the reducer, only the
    // root wrapper gets a new identity, so it must be a dep to react to loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, currentNode, searchTerm, sortOrder]);

  const selectedPaths = useMemo(
    () => new Set(selectedDocuments.map((d) => d.path)),
    [selectedDocuments],
  );

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm],
  );

  function getSortOrderLabel() {
    return sortOrder[0] === 'name'
      ? sortOrder[1] === 'asc'
        ? t('sort.order.alpha.asc')
        : t('sort.order.alpha.desc')
      : t('sort.order.modify.desc');
  }

  function handleSelectDoc(doc: NextcloudDocument) {
    let currentDocuments = [...selectedDocuments];
    if (!multiple) {
      currentDocuments = [doc];
    } else if (currentDocuments.includes(doc)) {
      currentDocuments = currentDocuments.filter(
        (selectedDocument) => selectedDocument.path !== doc.path,
      );
    } else {
      currentDocuments = [...currentDocuments, doc];
    }
    setSelectedDocuments(currentDocuments);
    onSelect(currentDocuments);
  }

  const nextcloud = clsx('workspace flex-grow-1 gap-0', className);

  return (
    <Grid className={nextcloud}>
      <Grid.Col
        sm="12"
        md="3"
        xl="4"
        className="workspace-folders p-12 pt-0 gap-12"
      >
        <div style={{ position: 'sticky', top: 0, paddingTop: '1.2rem' }}>
          <TreeView
            ref={treeRef}
            data={root}
            onTreeItemClick={handleTreeItemChange}
            onTreeItemUnfold={handleTreeItemChange}
          />
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
                  const isSelected = selectedPaths.has(doc.path);
                  return (
                    <NextcloudFileCard
                      key={doc.path}
                      doc={doc}
                      userId={user!.userId}
                      isSelected={isSelected}
                      onClick={() => handleSelectDoc(doc)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyScreen text={t('nextcloud.empty.docSpace')} />
            )}
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};
export default Nextcloud;

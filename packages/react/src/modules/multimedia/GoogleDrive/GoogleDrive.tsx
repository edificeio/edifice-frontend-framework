import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { DocumentHelper, GoogleDriveDocument, Role } from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Dropdown } from '../../../components/Dropdown';
import { EmptyScreen } from '../../../components/EmptyScreen';
import { Grid } from '../../../components/Grid';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { SearchBar } from '../../../components/SearchBar';
import { Tree } from '../../../components/Tree';
import { findNodeById } from '../../../components/Tree/utilities/tree';
import { useGoogleDriveSearch, useUser } from '../../../hooks';
import { GoogleDriveFolderNode } from '../../../hooks/useGoogleDriveSearch/useGoogleDriveSearch';
import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconSortTime,
} from '../../icons/components';
import { GoogleDriveFileCard } from '../FileCard';

import illuError from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-error.svg';
import illuTrash from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-trash.svg';
import { Button, Flex } from '../../../components';

const ROOT_ID = 'root';

function compare(a?: string, b?: string) {
  if (a === b) return 0;
  if (a === undefined) return -1;
  if (b === undefined) return 1;
  return a.localeCompare(b);
}

/**
 * GoogleDrive component properties
 */
export interface GoogleDriveProps {
  /**
   * Notify parent when media elements are successfully selected.
   */
  onSelect: (result: GoogleDriveDocument[]) => void;
  /**
   * Boolean to know if we can select 1 or many files.
   */
  multiple?: boolean | undefined;
  /**
   * Document roles to filter files by; null (default) shows all roles.
   */
  roles?: Role | Role[] | null;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const GoogleDrive = ({
  onSelect,
  multiple = true,
  roles,
  className,
}: GoogleDriveProps) => {
  const { t } = useTranslation();
  const { user } = useUser();

  /**
   * Google Drive needs no per-user login step today, so this renders no
   * connection screen. `useGoogleDriveSearch` still exposes `needsAuth`,
   * `isCheckingAuth` and `isAuthError` for the day an OAuth2 flow is added.
   */
  const { root, loadContent, loadError } = useGoogleDriveSearch(
    ROOT_ID,
    t('google-drive.mydrive'),
    user?.userId,
  );

  const [currentNodeId, setCurrentNodeId] = useState<string>(ROOT_ID);

  const currentNode: GoogleDriveFolderNode =
    (findNodeById(root, currentNodeId) as GoogleDriveFolderNode) ?? root;

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const [sortOrder, setSortOrder] = useState<[string, string]>([
    'modified',
    'desc',
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<
    GoogleDriveDocument[]
  >([]);

  const handleTreeItemChange = useCallback(
    (nodeId: string) => {
      setCurrentNodeId(nodeId);
      loadContent(nodeId);
    },
    [loadContent],
  );

  /** Load root content on mount; it's selected by default via `currentNodeId`. */
  useEffect(() => {
    loadContent(ROOT_ID);
  }, [loadContent]);

  /** Derive documents from currentNode, searchTerm and sortOrder. */
  const documents = useMemo(() => {
    if (!currentNode.files) return undefined;

    const matchesRole = (doc: GoogleDriveDocument) => {
      if (!roles) return true;
      const role = DocumentHelper.role(doc.contentType, false);
      return Array.isArray(roles)
        ? roles.includes(role as Role)
        : roles === role;
    };

    const normalizedSearchTerm = searchTerm?.toLowerCase();
    const list = currentNode.files.filter(
      (f) =>
        (!normalizedSearchTerm ||
          f.name.toLowerCase().includes(normalizedSearchTerm)) &&
        matchesRole(f),
    );

    let sortFunction: (
      a: GoogleDriveDocument,
      b: GoogleDriveDocument,
    ) => number;
    if (sortOrder[0] === 'name') {
      sortFunction =
        sortOrder[1] === 'asc'
          ? (a, b) => compare(a.name, b.name)
          : (a, b) => compare(b.name, a.name);
    } else {
      sortFunction = (a, b) => compare(b.lastModified, a.lastModified);
    }

    return list.sort(sortFunction);
  }, [currentNode, searchTerm, sortOrder, roles]);

  const selectedIds = useMemo(
    () => new Set(selectedDocuments.map((d) => d.id)),
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

  function handleSelectDoc(doc: GoogleDriveDocument) {
    let currentDocuments = [...selectedDocuments];
    if (!multiple) {
      currentDocuments = [doc];
    } else if (
      currentDocuments.some(
        (selectedDocument) => selectedDocument.id === doc.id,
      )
    ) {
      currentDocuments = currentDocuments.filter(
        (selectedDocument) => selectedDocument.id !== doc.id,
      );
    } else {
      currentDocuments = [...currentDocuments, doc];
    }
    setSelectedDocuments(currentDocuments);
    onSelect(currentDocuments);
  }

  const googleDrive = clsx('workspace flex-grow-1 gap-0', className);

  return (
    <Grid className={googleDrive}>
      <Grid.Col
        sm="12"
        md="3"
        xl="4"
        className="workspace-folders p-12 pt-0 gap-12"
      >
        <div style={{ position: 'sticky', top: 0, paddingTop: '1.2rem' }}>
          <Tree
            nodes={root}
            selectedNodeId={currentNodeId}
            showIcon
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
            <Flex className="px-8 py-4" align="center" justify="end">
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
            </Flex>
          </Grid.Col>
          <Grid.Col sm="4" md="8" xl="12" className="p-8 gap-8">
            {loadError ? (
              <Flex
                direction="column"
                gap="12"
                className="h-full w-100"
                justify="center"
                align="center"
              >
                <EmptyScreen
                  imageSrc={illuError}
                  title={t('google-drive.error.title')}
                  text={t('google-drive.error.description')}
                />
                <Button onClick={() => loadContent(currentNodeId)}>
                  {t('retry')}
                </Button>
              </Flex>
            ) : !documents ? (
              <LoadingScreen />
            ) : documents.length !== 0 ? (
              <div className="grid grid-workspace">
                {documents.map((doc) => {
                  const isSelected = selectedIds.has(doc.id);
                  return (
                    <GoogleDriveFileCard
                      key={doc.id}
                      doc={doc}
                      userId={user!.userId}
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
export default GoogleDrive;

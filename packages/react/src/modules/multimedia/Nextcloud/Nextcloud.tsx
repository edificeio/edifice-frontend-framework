import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { DocumentHelper, NextcloudDocument, Role } from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Dropdown } from '../../../components/Dropdown';
import { EmptyScreen } from '../../../components/EmptyScreen';
import { Grid } from '../../../components/Grid';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { SearchBar } from '../../../components/SearchBar';
import { Tree } from '../../../components/Tree';
import { findNodeById } from '../../../components/Tree/utilities/tree';
import { useNextcloudSearch, useUser } from '../../../hooks';
import { NextcloudFolderNode } from '../../../hooks/useNextcloudSearch/useNextcloudSearch';
import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconSortTime,
} from '../../icons/components';
import { NextcloudFileCard } from '../FileCard';

import illuNoContentInFolder from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-no-content-in-folder.svg';
import illuTrash from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-trash.svg';
import { Button, Flex } from '../../../components';

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
   * Document roles to filter files by; null (default) shows all roles.
   */
  roles?: Role | Role[] | null;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const Nextcloud = ({
  onSelect,
  multiple = true,
  roles,
  className,
}: NextcloudProps) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const { root, needsAuth, isCheckingAuth, refetchAuthStatus, loadContent } =
    useNextcloudSearch(ROOT_ID, t('nextcloud'), user?.userId);

  const popupRef = useRef<Window | null>(null);

  const [currentNodeId, setCurrentNodeId] = useState<string>(ROOT_ID);

  const currentNode: NextcloudFolderNode =
    (findNodeById(root, currentNodeId) as NextcloudFolderNode) ?? root;

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

  /** Load root content once authenticated; it's selected by default via `currentNodeId`. */
  useEffect(() => {
    if (!needsAuth) loadContent(ROOT_ID);
  }, [loadContent, needsAuth]);

  /** Derive documents from currentNode, searchTerm and sortOrder. */
  const documents = useMemo(() => {
    if (!currentNode.files) return undefined;

    const matchesRole = (doc: NextcloudDocument) => {
      if (!roles) return true;
      const role = DocumentHelper.role(doc.contentType, false);
      return Array.isArray(roles)
        ? roles.includes(role as Role)
        : roles === role;
    };

    const list = currentNode.files.filter(
      (f) => (!searchTerm || f.name.indexOf(searchTerm) >= 0) && matchesRole(f),
    );

    let sortFunction: (a: NextcloudDocument, b: NextcloudDocument) => number;
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

  const openLoginPopup = () => {
    popupRef.current = window.open(
      `${window.location.origin}/nextcloud/user/oauth2/init`,
      '',
      'popup, height=600, width=400',
    );
  };

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== 'nextcloud-connected'
      ) {
        return;
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      refetchAuthStatus();
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [refetchAuthStatus]);

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  if (needsAuth) {
    return (
      <Flex
        direction="column"
        gap="12"
        className="h-full w-100"
        justify="center"
        align="center"
      >
        <Flex direction="column" gap="8" justify="center" align="center">
          <EmptyScreen imageSrc={illuNoContentInFolder} />
          <h2 className="h2 text-secondary mb-8">
            Connectez vos Documents Synchronisés
          </h2>
          <div className="text">
            Connectez-vous pour parcourir vos Documents Synchronisés et les
            insérer ici.
          </div>
        </Flex>

        <Button onClick={openLoginPopup}>Se connecter</Button>
      </Flex>
    );
  }

  return (
    <Grid className={nextcloud}>
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
export default Nextcloud;

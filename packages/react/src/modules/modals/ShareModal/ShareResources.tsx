import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import {
  ID,
  PutShareResponse,
  RightStringified,
  ShareRight,
  ShareRightAction,
  ShareRightActionDisplayName,
  ShareUrls,
} from '@edifice.io/client';
import { UseMutationResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Button,
  Checkbox,
  Combobox,
  Heading,
  LoadingScreen,
  Tooltip,
  VisuallyHidden,
} from '../../../components';
import { useDirectory } from '../../../hooks';
import {
  IconBookmark,
  IconInfoCircle,
  IconRafterDown,
} from '../../icons/components';
import { ShareBookmark } from './ShareBookmark';
import { ShareBookmarkLine } from './ShareBookmarkLine';
import { useSearch } from './hooks/useSearch';
import useShare from './hooks/useShare';
import { useShareBookmark } from './hooks/useShareBookmark';

/**
 * Configuration options for sharing a resource
 *
 * @typedef {Object} ShareOptions
 * @property {ID} resourceId - Unique identifier of the resource to share
 * @property {RightStringified[]} resourceRights - Current rights assigned to the resource
 * @property {string} resourceCreatorId - User ID of the resource creator
 * @property {string} resourceCreatorDisplayName - (optional) Name of the resource creator to display
 * @property {ShareRightActionDisplayName[]} [filteredActions] - Optional list of allowed actions to display
 * @property {ShareUrls} [shareUrls] - Optional custom URLs for API endpoints related to sharing operations default endpoints are used if not provided
 * default: {
 *   getResourceRights: `/${app}/share/json/${resourceId}?search=`,
 *   saveResourceRights: `/${app}/share/resource/${resourceId}`,
 *   getShareMapping: `/${app}/rights/sharing`
 * }
 *
 * @example Example related to sharing thread resources:
 * ```ts
 * const shareOptions: ShareOptions = {
 *   resourceId: '12345',
 *   resourceRights: [],
 *   resourceCreatorId: 'user-67890',
 *   filteredActions: ['read', 'contrib'],
 *   defaultActions: [
 *     {
 *       id: 'read',
 *       displayName: 'read',
 *     },
 * ],
 *   shareUrls: {
 *     getResourceRights: '/api/V1/thread/shares', (get endpoint)
 *     saveResourceRights: '/api/V1/thread/shares', (put endpoint)
 *     getShareMapping: '/api/V1/rights/sharing'
 *   }
 * };
 * ```
 *
 * @example Example related to sharing info resources:
 * ```ts
 * const shareOptions: ShareOptions = {
 *   resourceId: '12345',
 *   resourceRights: [],
 *   resourceCreatorId: 'user-67890',
 *   resourceCreatorDisplayName: 'Jim',
 *   filteredActions: ['read', 'contrib'],
 *   defaultActions: [
 *     {
 *       id: 'read',
 *       displayName: 'read',
 *     },
 *   ],
 *   shareUrls: {
 *     getResourceRights: '/api/V1/info/shares', (get endpoint)
 *     saveResourceRights: '/api/V1/info/shares', (put endpoint)
 *     getShareMapping: '/api/V1/rights/sharing'
 *   }
 * };
 * ```
 */
export type ShareOptions = {
  resourceId: ID;
  resourceRights: RightStringified[];
  resourceCreatorId: string;
  resourceCreatorDisplayName?: string;
  filteredActions?: ShareRightActionDisplayName[];
  shareUrls?: ShareUrls;
  defaultActions?: ShareRightAction[];
};

/**
 * React Query mutation result for share operations
 *
 * @typedef {UseMutationResult<PutShareResponse, unknown, {resourceId: string; rights: ShareRight[]}, unknown>} ShareResourceMutation
 */
export type ShareResourceMutation = UseMutationResult<
  PutShareResponse,
  unknown,
  {
    resourceId: string;
    rights: ShareRight[];
  },
  unknown
>;

/**
 * Props for the ShareResources component
 *
 * @interface ShareResourceProps
 * @property {ShareOptions} shareOptions - Configuration for the resource being shared
 * @property {ShareResourceMutation} [shareResource] - Optional React Query mutation for optimistic UI updates
 * @property {() => void} [onSuccess] - Callback fired after successful share operation
 * @property {(shareRights: ShareRight[], isDirty: boolean) => void} [onChange] - Callback fired when share rights change
 * @property {(isSubmitting: boolean) => void} [onSubmit] - Callback fired when share operation is submitting
 * @property {string} [classNameSearchInput] - Optional CSS class for the search input wrapper (default: 'col-6')
 */
interface ShareResourceProps {
  /**
   * Expect resourceId,
   * new rights array (replace shared array),
   * creatorId
   * of a resource */
  shareOptions: ShareOptions;
  /**
   * Use the `shareResource` props when you need to do Optimistic UI
   * otherwise ShareModal handles everything
   * Must use React Query */
  shareResource?: ShareResourceMutation;
  /**
   * onSuccess callback when a resource is successfully shared
   */
  onSuccess?: () => void;
  /**
   * Callback when share rights change
   */
  onChange?: (shareRights: ShareRight[], isDirty: boolean) => void;
  /**
   * Callback when ShareResources component is submitting share rights or bookmark changes
   */
  onSubmit?: (isSubmitting: boolean) => void;
  /**
   * Optional className for the search input wrapper (default: 'col-6')
   */
  classNameSearchInput?: string;
}

/**
 * Ref interface exposed by ShareResources component
 *
 * @interface ShareResourcesRef
 * @property {() => void} handleShare - Method to trigger the share operation
 *
 * @example
 * ```tsx
 * const ref = useRef<ShareResourcesRef>(null);
 *
 * // Trigger share programmatically
 * ref.current?.handleShare();
 *
 * // Check sharing status
 * const sharing = ref.current?.isSharing();
 * ```
 */
export interface ShareResourcesRef {
  handleShare: (notify?: boolean) => void;
}

/**
 * ShareResources Component
 *
 * A component for managing resource sharing permissions with users and groups.
 * Provides search functionality, bookmark management, and granular rights control.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import ShareResources, { ShareResourcesRef, ShareOptions } from './ShareResources';
 *
 * function MyComponent() {
 *   const shareRef = useRef<ShareResourcesRef>(null);
 *
 *   const shareOptions: ShareOptions = {
 *     resourceId: '123',
 *     resourceRights: [],
 *     resourceCreatorId: 'user-456',
 *     filteredActions: ['read', 'contrib'],
 *     urls: {
 *       getResourceRights: '/api/share/rights',
 *       putResourceRights: '/api/share/update'
 *     }
 *   };
 *
 *   const handleSave = () => {
 *     if (shareRef.current) {
 *       shareRef.current.handleShare();
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <ShareResources
 *         ref={shareRef}
 *         shareOptions={shareOptions}
 *         onSuccess={() => console.log('Shared successfully')}
 *         onChange={(rights, isDirty) => console.log('Rights changed:', isDirty)}
 *         onSubmit={(isSubmitting) => console.log('Submitting share...', isSubmitting)}
 *       />
 *       <button onClick={handleSave}>Save Changes</button>
 *     </>
 *   );
 * }
 * ```
 *
 * @component
 * @forwardRef
 */
const ShareResources = forwardRef<ShareResourcesRef, ShareResourceProps>(
  (
    {
      shareOptions,
      shareResource,
      onSuccess = () => {},
      onChange = () => {},
      onSubmit = () => {},
      classNameSearchInput = 'col-6',
    }: ShareResourceProps,
    ref: Ref<ShareResourcesRef>,
  ) => {
    const {
      resourceId,
      resourceCreatorId,
      resourceCreatorDisplayName,
      resourceRights,
      filteredActions,
      shareUrls,
      defaultActions = [
        {
          id: 'read',
          displayName: 'read',
        },
        {
          id: 'comment',
          displayName: 'comment',
        },
      ],
    } = shareOptions;

    const [isLoading, setIsLoading] = useState(true);
    const [isSavingBookmark, setIsSavingBookmark] = useState<boolean>(false);

    const {
      state: { isSharing, shareRights, shareRightActions },
      dispatch: shareDispatch,
      myAvatar,
      currentIsAuthor,
      toggleRight,
      handleShare,
      handleDeleteRow,
      isDirty,
    } = useShare({
      resourceId,
      resourceCreatorId,
      resourceRights,
      shareResource,
      setIsLoading,
      onSuccess,
      filteredActions,
      shareUrls,
    });

    const {
      state: { searchResults, searchInputValue },
      showSearchAdmlHint,
      showSearchLoading,
      showSearchNoResults,
      getSearchMinLength,
      handleSearchInputChange,
      handleSearchResultsChange,
    } = useSearch({
      resourceId,
      resourceCreatorId,
      shareRights,
      shareDispatch,
      urlResourceRights: shareUrls?.getResourceRights,
      defaultActions,
    });

    const {
      refBookmark,
      showBookmark,
      handleBookmarkChange,
      toggleBookmark,
      bookmark,
      handleOnSave,
      showBookmarkInput,
      toggleBookmarkInput,
    } = useShareBookmark({ shareRights, shareDispatch });

    const handleOnSaveBookmark = () => {
      setIsSavingBookmark(true);
      return handleOnSave().then(() => {
        setIsSavingBookmark(false);
      });
    };
    const { getAvatarURL } = useDirectory();

    useImperativeHandle(
      ref,
      () => ({
        handleShare,
      }),
      [handleShare],
    );

    useEffect(() => {
      onChange(shareRights.rights, isDirty);
    }, [isDirty, shareRights.rights, onChange]);

    useEffect(() => {
      onSubmit(isSavingBookmark || isSharing);
    }, [isSavingBookmark, isSharing, onSubmit]);

    const { t } = useTranslation();

    const userIsAuthor = currentIsAuthor();

    const searchPlaceholder = showSearchAdmlHint()
      ? t('explorer.search.adml.hint')
      : t('explorer.modal.share.search.placeholder');

    return (
      <div>
        <Heading
          headingStyle="h4"
          level="h3"
          className="mb-16 d-flex align-items-center"
        >
          <div className="me-8">{t('explorer.modal.share.search')}</div>
          <Tooltip
            message={
              'Vos favoris de partage s’affichent en priorité dans votre liste lorsque vous recherchez un groupe ou une personne, vous pouvez les retrouver dans l’annuaire.'
            }
            placement="top"
          >
            <IconInfoCircle className="c-pointer" height="18" />
          </Tooltip>
        </Heading>
        <div className="row mb-16">
          <div className={classNameSearchInput}>
            <Combobox
              value={searchInputValue}
              placeholder={searchPlaceholder}
              isLoading={showSearchLoading()}
              noResult={showSearchNoResults()}
              options={searchResults}
              searchMinLength={getSearchMinLength()}
              onSearchInputChange={handleSearchInputChange}
              onSearchResultsChange={handleSearchResultsChange}
            />
          </div>
        </div>
        <div className="table-responsive">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <table className="table border align-middle mb-0 rounded-3">
              <thead className="bg-blue-200">
                <tr>
                  <th scope="col" className="w-32">
                    <VisuallyHidden>
                      {t('explorer.modal.share.avatar.shared.alt')}
                    </VisuallyHidden>
                  </th>
                  <th scope="col">
                    <VisuallyHidden>
                      {t('explorer.modal.share.search.placeholder')}
                    </VisuallyHidden>
                  </th>
                  {shareRightActions.map((shareRightAction) => (
                    <th
                      key={shareRightAction.displayName}
                      scope="col"
                      className="text-center text-gray-800"
                    >
                      {t(shareRightAction.displayName)}
                    </th>
                  ))}
                  <th scope="col">
                    <VisuallyHidden>{t('close')}</VisuallyHidden>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Add a disabled line about the resource owner. */}
                <tr>
                  <th scope="row">
                    <Avatar
                      alt={t('explorer.modal.share.avatar.me.alt')}
                      size="xs"
                      src={
                        userIsAuthor
                          ? myAvatar
                          : getAvatarURL(resourceCreatorId, 'user')
                      }
                      variant="circle"
                    />
                  </th>
                  <td>
                    {userIsAuthor
                      ? t('share.me')
                      : (resourceCreatorDisplayName ?? t('share.author'))}
                  </td>
                  {shareRightActions.map((shareRightAction) => (
                    <td
                      key={shareRightAction.displayName}
                      style={{ width: '80px' }}
                      className="text-center text-white"
                    >
                      <Checkbox checked={true} disabled />
                    </td>
                  ))}
                  <td></td>
                </tr>
                <ShareBookmarkLine
                  showBookmark={showBookmark}
                  shareRightActions={shareRightActions}
                  shareRights={shareRights}
                  onDeleteRow={handleDeleteRow}
                  toggleRight={toggleRight}
                  toggleBookmark={toggleBookmark}
                />
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-16">
          <Button
            data-testid="share-bookmark-show-button"
            color="tertiary"
            leftIcon={<IconBookmark />}
            rightIcon={
              <IconRafterDown
                title={t('show')}
                className="w-16 min-w-0"
                style={{
                  transition: 'rotate 0.2s ease-out',
                  rotate: showBookmarkInput ? '-180deg' : '0deg',
                }}
              />
            }
            type="button"
            variant="ghost"
            className="fw-normal"
            onClick={() => toggleBookmarkInput(!showBookmarkInput)}
          >
            {t('share.save.sharebookmark')}
          </Button>
          {showBookmarkInput && (
            <ShareBookmark
              refBookmark={refBookmark}
              bookmark={bookmark}
              onBookmarkChange={handleBookmarkChange}
              onSave={handleOnSaveBookmark}
            />
          )}
        </div>
      </div>
    );
  },
);

ShareResources.displayName = 'ShareResources';
export default ShareResources;

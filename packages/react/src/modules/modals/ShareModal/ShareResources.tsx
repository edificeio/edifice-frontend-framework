import { forwardRef, Ref, useImperativeHandle, useState } from 'react';

import {
  ID,
  PutShareResponse,
  RightStringified,
  ShareRight,
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

export type ShareOptions = {
  resourceId: ID;
  resourceRights: RightStringified[];
  resourceCreatorId: string;
  filteredActions?: ShareRightActionDisplayName[];
  urls?: ShareUrls;
};

export type ShareResourceMutation = UseMutationResult<
  PutShareResponse,
  unknown,
  {
    resourceId: string;
    rights: ShareRight[];
  },
  unknown
>;

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
  onSuccess: () => void;
  /**
   * Optional className for the search input
   */
  classNameSearchInput?: string;
}

export interface ShareResourcesRef {
  handleShare: () => void;
  isSharing: boolean;
  shareRights: ShareRight[];
}

const ShareResources = forwardRef<ShareResourcesRef, ShareResourceProps>(
  (
    {
      shareOptions,
      shareResource,
      onSuccess,
      classNameSearchInput = 'col-6',
    }: ShareResourceProps,
    ref: Ref<ShareResourcesRef>,
  ) => {
    const {
      resourceId,
      resourceCreatorId,
      resourceRights,
      filteredActions,
      urls,
    } = shareOptions;

    const [isLoading, setIsLoading] = useState(true);

    const {
      state: { isSharing, shareRights, shareRightActions },
      dispatch: shareDispatch,
      myAvatar,
      currentIsAuthor,
      toggleRight,
      handleShare,
      handleDeleteRow,
    } = useShare({
      resourceId,
      resourceCreatorId,
      resourceRights,
      shareResource,
      setIsLoading,
      onSuccess,
      filteredActions,
      urls,
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
      urlResourceRights: urls?.getResourceRights,
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

    useImperativeHandle(ref, () => ({
      handleShare,
      isSharing,
      shareRights: shareRights.rights,
    }));

    const { t } = useTranslation();

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
            <table className="table border align-middle mb-0">
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
                {currentIsAuthor() && (
                  <tr>
                    <th scope="row">
                      <Avatar
                        alt={t('explorer.modal.share.avatar.me.alt')}
                        size="xs"
                        src={myAvatar}
                        variant="circle"
                      />
                    </th>
                    <td>{t('share.me')}</td>
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
                )}
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
              onSave={handleOnSave}
            />
          )}
        </div>
      </div>
    );
  },
);

ShareResources.displayName = 'ShareResources';
export default ShareResources;

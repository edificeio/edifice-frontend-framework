import { useEffect, useReducer } from 'react';

import {
  odeServices,
  PutShareResponse,
  type ShareRight,
  type ShareRightAction,
  type ShareRightActionDisplayName,
  type ShareRightWithVisibles,
  type ShareUrls,
} from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import { useToast, useUser } from '../../../../hooks';
import { useEdificeClient } from '../../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { ShareOptions, ShareResourceMutation } from '../ShareResources';

interface UseShareResourceModalProps {
  /**
   * Resource ID (assetId)
   */
  resourceId: ShareOptions['resourceId'];
  /**
   * Resource Rights (based on the new rights array)
   */
  resourceRights: ShareOptions['resourceRights'];
  /**
   * Resource Creator Id: Id of the user who created the resource
   */
  resourceCreatorId: ShareOptions['resourceCreatorId'];
  shareResource?: ShareResourceMutation;
  onSuccess: () => void;
  setIsLoading?: (value: boolean) => void;
  resourceShareRights?: ShareRightWithVisibles;
  resourceShareRightActions?: ShareRightAction[];
  filteredActions?: ShareRightActionDisplayName[];
  shareUrls?: ShareUrls;
}

type State = {
  isSharing: boolean;
  isDirty?: boolean;
  shareRights: ShareRightWithVisibles;
  shareRightActions: ShareRightAction[];
};

export type ShareAction =
  | { type: 'init'; payload: Partial<State> }
  | { type: 'updateShareRights'; payload: ShareRightWithVisibles }
  | { type: 'toggleRight'; payload: ShareRightWithVisibles }
  | { type: 'deleteRow'; payload: ShareRightWithVisibles }
  | { type: 'isSharing'; payload: boolean };

const initialState: State = {
  isSharing: false,
  isDirty: false,
  shareRights: {
    rights: [],
    visibleBookmarks: [],
    visibleGroups: [],
    visibleUsers: [],
  },
  shareRightActions: [],
};

function reducer(state: State, action: ShareAction) {
  switch (action.type) {
    case 'init':
      return { ...state, ...action.payload };
    case 'deleteRow':
      return { ...state, shareRights: action.payload, isDirty: true };
    case 'updateShareRights':
      return { ...state, shareRights: action.payload, isDirty: true };
    case 'toggleRight':
      return { ...state, shareRights: action.payload, isDirty: true };
    case 'isSharing':
      return { ...state, isSharing: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
}

export default function useShare({
  resourceId,
  resourceRights,
  resourceCreatorId,
  shareResource,
  setIsLoading,
  onSuccess,
  filteredActions,
  shareUrls,
}: UseShareResourceModalProps) {
  const { appCode } = useEdificeClient();
  const { user, avatar } = useUser();

  const toast = useToast();
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!resourceId) return;

    (async () => {
      try {
        const [shareRightActions, shareRights] = await Promise.all([
          odeServices
            .share()
            .getActionsForApp(appCode, shareUrls?.getShareMapping),
          odeServices
            .share()
            .getRightsForResource(appCode, resourceId, shareUrls),
        ]);

        // filter actions if needed
        const filteredShareRightActions = filteredActions
          ? shareRightActions.filter((action) =>
              filteredActions.includes(action.id),
            )
          : shareRightActions;

        dispatch({
          type: 'init',
          payload: {
            shareRightActions: filteredShareRightActions,
            shareRights,
          },
        });
      } catch (error) {
        console.error(error);
      }
      {
        setIsLoading?.(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceId]);

  const toggleRight = (
    shareRight: ShareRight,
    actionName: ShareRightActionDisplayName,
  ) => {
    const { rights, ...props } = state.shareRights;

    const newShareRights: ShareRight[] = [...rights];
    const index: number = newShareRights.findIndex(
      (x) => x.id === shareRight.id,
    );
    const actionObject = state.shareRightActions.filter(
      (shareRightAction) => shareRightAction.id === actionName,
    )[0];

    const isActionRemoving: boolean =
      newShareRights[index].actions.findIndex(
        (action) => action.id === actionName,
      ) > -1;

    if (isActionRemoving) {
      // remove selected action and actions that requires the selected action
      let updatedActions = newShareRights[index].actions.filter(
        (action) => action.id !== actionName,
      );
      const requiredActions = state.shareRightActions.filter(
        (shareRightAction) => shareRightAction.requires?.includes(actionName),
      );
      updatedActions = updatedActions.filter(
        (action) =>
          !requiredActions.find(
            (requiredAction) => requiredAction.id === action.id,
          ),
      );

      newShareRights[index] = {
        ...newShareRights[index],
        actions: updatedActions,
      };
    } else {
      // add required actions
      const requiredActions = state.shareRightActions.filter(
        (shareRightAction) =>
          actionObject.requires?.includes(shareRightAction.id) &&
          !newShareRights[index].actions.find(
            (action) => action.id === shareRightAction.id,
          ),
      );
      newShareRights[index] = {
        ...newShareRights[index],
        actions: [
          ...newShareRights[index].actions,
          actionObject,
          ...requiredActions,
        ],
      };
    }

    // if bookmark then apply right to users and groups
    if (shareRight.type === 'sharebookmark') {
      newShareRights[index].users?.forEach((user: { id: any }) => {
        const userIndex = newShareRights.findIndex(
          (item) => item.id === user.id,
        );
        newShareRights[userIndex] = {
          ...newShareRights[userIndex],
          actions: newShareRights[index].actions,
        };
      });

      newShareRights[index].groups?.forEach((user: { id: any }) => {
        const userIndex = newShareRights.findIndex(
          (item) => item.id === user.id,
        );
        newShareRights[userIndex] = {
          ...newShareRights[userIndex],
          actions: newShareRights[index].actions,
        };
      });
    }

    dispatch({
      type: 'toggleRight',
      payload: {
        rights: newShareRights,
        ...props,
      },
    });
  };

  const notifySuccess = (value: PutShareResponse) => {
    if (Object.keys(value)[0] === 'error') {
      toast.error(t('explorer.shared.status.error'));
      console.error('Failed to save share', value);
    } else {
      toast.success(t('explorer.shared.status.saved'));
    }
  };

  const handleShare = async (notify = true) => {
    dispatch({
      type: 'isSharing',
      payload: true,
    });

    try {
      //TODO move this logic into services
      // add my rights if needed (because visible api does not return my rights)
      const myRights = resourceRights
        .filter((right) => user && right.includes(`user:${user.userId}`))
        .map((right) => right.split(':')[2])
        .filter((right) => !!right);

      const shares = [...state.shareRights.rights];

      if (myRights.length > 0) {
        const actions: ShareRightAction[] = myRights.map((right) => {
          return {
            displayName: right,
            id: right,
          } as ShareRightAction;
        });
        shares.push({
          actions,
          avatarUrl: '',
          directoryUrl: '',
          displayName: user!.username,
          id: user!.userId,
          type: 'user',
        });
      }

      // shared
      if (shareResource) {
        const result = await shareResource.mutateAsync({
          resourceId: resourceId,
          rights: shares,
        });
        if (notify) {
          notifySuccess(result);
        }
      } else {
        const result = await odeServices
          .share()
          .saveRights(appCode, resourceId, shares, shareUrls);
        if (notify) {
          notifySuccess(result);
        }
      }
      if (shareUrls?.getResourceRights) {
        odeServices.cache().clearCache(shareUrls.getResourceRights);
      }
      onSuccess();
    } catch (error) {
      if (typeof error === 'string')
        toast.error(t('explorer.shared.status.error'));
      if (typeof error === 'object')
        toast.error(
          t(
            (error as { error?: string })?.error ||
              'explorer.shared.status.error',
          ),
        );
      console.error('Failed to save share', error);
    } finally {
      dispatch({
        type: 'isSharing',
        payload: false,
      });
    }
  };

  const handleDeleteRow = (shareRight: ShareRight) => {
    dispatch({
      type: 'deleteRow',
      payload: {
        ...state.shareRights,
        rights: state.shareRights.rights.filter(
          (right: { id: any }) =>
            right.id !== shareRight.id &&
            !shareRight.users?.find(
              (user: { id: any }) => user.id === right.id,
            ) &&
            !shareRight.groups?.find(
              (group: { id: any }) => group.id === right.id,
            ),
        ),
      },
    });
  };
  const currentIsAuthor = () =>
    resourceCreatorId === user?.userId ? true : false;

  return {
    state,
    dispatch,
    currentIsAuthor,
    myAvatar: avatar,
    handleDeleteRow,
    handleShare,
    toggleRight,
    isDirty: !!state.isDirty,
  };
}

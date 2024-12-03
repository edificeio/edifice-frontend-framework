import {
  ReactionDetailsData,
  ReactionType,
  ReactionTypes,
} from "@edifice.io/ts-client";
import { StringUtils } from "@edifice.io/utilities";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Button, Modal, Tabs, TabsItemProps } from "../../components";
import { default as useReactionIcons } from "./hooks/useReactionIcons";
import { ReactionModalCard } from "./ReactionModal.Card";

export interface ReactionModalProps {
  /** Id of resource. */
  resourceId: string;

  /** Number of results per page, defaults to 30. */
  pageSize?: number;

  /** Display modal ? */
  isOpen: boolean;

  /** Close button handler. */
  onModalClose(): void;

  /** Function for loading reactions to the resource. */
  reactionDetailsLoader: (
    resourceId: string,
    page: number,
    size: number,
  ) => Promise<ReactionDetailsData | undefined>;
}

const ALL_TAB_ID = "all";
type TabId = ReactionType | typeof ALL_TAB_ID;

const ReactionModal = ({
  resourceId,
  pageSize = 30,
  reactionDetailsLoader: loadReactionDetails,
  onModalClose,
  ...restProps
}: ReactionModalProps) => {
  // Reaction counters details.
  const [counters, setCounters] = useState({
    countByType: {} as {
      [type in ReactionType]?: number;
    },
    allReactionsCounter: 0,
  });
  // Reactions details.
  const [reactions, setReactions] = useState<
    ReactionDetailsData["userReactions"]
  >([]);
  // Currently displayed tab ID.
  const [currentTabId, setCurrentTabId] = useState<TabId>(ALL_TAB_ID);

  const id = useId();
  const { t } = useTranslation();
  const { getReactionIcon } = useReactionIcons();

  const [latestPage, setLatestPage] = useState(0);

  const loadNextPage = useCallback(async () => {
    const nextPage = latestPage + 1;
    setLatestPage(nextPage);

    const data = await loadReactionDetails(resourceId, nextPage, pageSize);
    if (data) {
      const { reactionCounters, userReactions } = data;
      if (nextPage === 1) setCounters(reactionCounters);
      setReactions((old) => [
        ...old,
        ...userReactions.filter(
          (reaction) =>
            !old.some((oldReaction) => oldReaction.userId === reaction.userId),
        ),
      ]);
    }
  }, [latestPage, loadReactionDetails, pageSize, resourceId]);

  // Displayed panel.
  const panel = useMemo(() => {
    return (
      <div className="d-flex flex-column w-100 gap-8 mt-32">
        {reactions
          .filter(
            (reaction) =>
              currentTabId === ALL_TAB_ID ||
              reaction.reactionType === currentTabId,
          )
          .map((reaction) => {
            return (
              <ReactionModal.Card key={reaction.userId} reaction={reaction} />
            );
          })}
      </div>
    );
  }, [currentTabId, reactions]);

  // Displayed tabs list.
  const tabs = useMemo(() => {
    const items: TabsItemProps[] = ReactionTypes.filter(
      (type) => typeof counters.countByType?.[type] === "number",
    ).map((type) => ({
      id: type,
      icon: getReactionIcon(type),
      label: StringUtils.toCounter(counters.countByType[type] as number),
      content: panel,
    }));

    return [
      {
        id: ALL_TAB_ID,
        icon: null,
        label: t("audience.reaction.tab.all"),
        content: panel,
      },
      ...items,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counters.countByType, panel]);

  // Load first page, once
  useEffect(() => {
    loadNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (tab: TabsItemProps) => {
    setCurrentTabId(tab.id as TabId);
  };

  const hasMore = reactions.length < counters.allReactionsCounter;

  return createPortal(
    <Modal
      id={id}
      {...restProps}
      onModalClose={onModalClose}
      size="md"
      scrollable
    >
      <Modal.Header onModalClose={onModalClose}>
        {t("audience.reaction.modal.header")}
      </Modal.Header>

      <Modal.Body>
        <Tabs items={tabs} defaultId={ALL_TAB_ID} onChange={handleTabChange} />
      </Modal.Body>

      <Modal.Footer>
        {hasMore && (
          <Button color="tertiary" onClick={loadNextPage}>
            {t("audience.reaction.modal.more")}
          </Button>
        )}
        <Button
          color="primary"
          onClick={onModalClose}
          type="button"
          variant="filled"
        >
          {t("close")}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
};

ReactionModal.displayName = "ReactionModal";
ReactionModal.Card = ReactionModalCard;

export default ReactionModal;

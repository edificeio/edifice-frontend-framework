import { ReactionSummaryData, ReactionType } from "@edifice.io/ts-client";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Dropdown, IconButton, Tooltip } from "../../components";
import { default as useReactionIcons } from "./hooks/useReactionIcons";

export interface ReactionChoiceProps {
  availableReactions: ReactionType[];
  summary?: ReactionSummaryData;
  onChange?: (chosenReaction?: ReactionType) => void;
}

const ReactionChoice = ({
  availableReactions,
  summary = { totalReactionsCounter: 0, userReaction: null },
  onChange,
}: ReactionChoiceProps) => {
  const { t } = useTranslation();
  const { getReactionIcon, getReactionLabel } = useReactionIcons();

  const { userReaction } = summary;
  const classes = clsx({
    "fw-bold": !!userReaction,
  });

  return (
    <div className="reaction-choice">
      <Dropdown placement="top-start">
        <Dropdown.Trigger
          className={classes}
          color="tertiary"
          variant="ghost"
          size="sm"
          icon={getReactionIcon(userReaction)}
          hideCarret
          label={t(getReactionLabel(userReaction))}
        ></Dropdown.Trigger>
        <Dropdown.Menu
          unstyled
          className="bg-white shadow rounded-8 overflow-visible"
        >
          <div className="d-flex align-items-center justify-content-between">
            {availableReactions?.map((reactionType) => (
              <Dropdown.Item className="p-0" key={reactionType}>
                <Tooltip
                  message={t(getReactionLabel(reactionType))}
                  placement="top"
                >
                  <IconButton
                    className="reaction-available m-4"
                    variant="ghost"
                    size="sm"
                    icon={getReactionIcon(reactionType)}
                    onClick={() => onChange?.(reactionType)}
                  />
                </Tooltip>
              </Dropdown.Item>
            ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

ReactionChoice.displayName = "ReactionChoice";

export default ReactionChoice;

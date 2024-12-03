import {
  ShareRight,
  ShareRightAction,
  ShareRightActionDisplayName,
  ShareRightWithVisibles,
} from "@edifice.io/ts-client";
import { useTranslation } from "react-i18next";

import { Avatar, Button, Checkbox, IconButton } from "../../../components";
import {
  IconBookmark,
  IconClose,
  IconRafterDown,
  IconUsers,
} from "../../icons/components";
import { hasRight } from "./utils/hasRight";
import { showShareRightLine } from "./utils/showShareRightLine";

export const ShareBookmarkLine = ({
  shareRights,
  showBookmark,
  toggleBookmark,
  shareRightActions,
  toggleRight,
  onDeleteRow,
}: {
  shareRights: ShareRightWithVisibles;
  shareRightActions: ShareRightAction[];
  showBookmark: boolean;
  toggleRight: (
    shareRight: ShareRight,
    actionName: ShareRightActionDisplayName,
  ) => void;
  toggleBookmark: () => void;
  onDeleteRow: (shareRight: ShareRight) => void;
}) => {
  const { t } = useTranslation();

  return shareRights?.rights.map((shareRight: ShareRight) => {
    const avatarMapping = {
      user: (
        <Avatar
          alt={t("explorer.modal.share.avatar.shared.alt")}
          size="xs"
          src={shareRight.avatarUrl}
          variant="circle"
        />
      ),
      group: (
        <div className="avatar-xs bg-primary-200 justify-content-center d-flex rounded-circle">
          <IconUsers width={16} />
        </div>
      ),
      sharebookmark: <IconBookmark />,
    };

    const selectedAvatar = avatarMapping[shareRight.type] || null;

    const isTypeBookmark = shareRight.type === "sharebookmark";
    const isTypeUser = shareRight.type === "user";

    return (
      showShareRightLine(shareRight, showBookmark) && (
        <tr
          key={shareRight.id}
          className={shareRight.isBookmarkMember ? "bg-light" : ""}
        >
          <td>{selectedAvatar}</td>
          <td>
            <div className="d-flex">
              {isTypeBookmark && (
                <Button
                  color="tertiary"
                  rightIcon={
                    <IconRafterDown
                      title={t("show")}
                      className="w-16 min-w-0"
                      style={{
                        transition: "rotate 0.2s ease-out",
                        rotate: showBookmark ? "-180deg" : "0deg",
                      }}
                    />
                  }
                  type="button"
                  variant="ghost"
                  className="fw-normal ps-0"
                  onClick={toggleBookmark}
                >
                  {shareRight.displayName}
                </Button>
              )}
              {!isTypeBookmark && shareRight.displayName}
              {isTypeUser && ` (${t(shareRight.profile || "")})`}
            </div>
          </td>
          {shareRightActions.map((shareRightAction) => (
            <td
              key={shareRightAction.displayName}
              style={{ width: "80px" }}
              className="text-center text-white"
            >
              <Checkbox
                checked={hasRight(shareRight, shareRightAction)}
                onChange={() => toggleRight(shareRight, shareRightAction.id)}
              />
            </td>
          ))}
          <td>
            {!shareRight.isBookmarkMember && (
              <IconButton
                aria-label={t("close")}
                color="tertiary"
                icon={<IconClose />}
                type="button"
                variant="ghost"
                title={t("close")}
                onClick={() => onDeleteRow(shareRight)}
              />
            )}
          </td>
        </tr>
      )
    );
  });
};

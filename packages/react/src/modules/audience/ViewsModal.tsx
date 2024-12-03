import { ViewsDetails } from "edifice-ts-client";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../components";
import { StringUtils } from "../../utilities";
import { IconSee, IconUsers } from "../icons/components";
import ViewsByProfileCard from "./ViewsByProfileCard";

export interface ViewsModalProps {
  viewsDetails: ViewsDetails;
  isOpen: boolean;
  onModalClose: () => void;
}

const ViewsModal = ({
  viewsDetails,
  isOpen,
  onModalClose,
}: ViewsModalProps) => {
  const { t } = useTranslation();

  const hasUniqueViews = viewsDetails.uniqueViewsCounter !== undefined;

  return createPortal(
    <Modal id="ViewsModal" isOpen={isOpen} onModalClose={onModalClose}>
      <Modal.Header onModalClose={onModalClose}>
        {t("audience.views.title")}
      </Modal.Header>
      <Modal.Body>
        <div className="views-detail-line p-8 mb-12">
          <div className="views-detail-icon rounded p-8">
            <IconSee />
          </div>
          <div className="h3">
            {StringUtils.toCounter(viewsDetails.viewsCounter)}
          </div>
          <div>{t("audience.views.detail.viewsCounter")}</div>
        </div>
        <div className="views-detail-line p-8 mb-12">
          <div className="views-detail-icon rounded p-8">
            <IconUsers />
          </div>
          {hasUniqueViews ? (
            <>
              <div className="h3">
                {StringUtils.toCounter(viewsDetails.uniqueViewsCounter)}
              </div>
              <div>{t("audience.views.detail.uniqueViewsCounter")}</div>
            </>
          ) : (
            <div>{t("audience.views.detail.noUniqueViews")}</div>
          )}
        </div>
        {hasUniqueViews
          ? viewsDetails.uniqueViewsPerProfile?.map((viewsByProfile) => (
              <ViewsByProfileCard
                viewsByProfile={viewsByProfile}
                key={viewsByProfile.profile}
              />
            ))
          : null}
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="primary"
          onClick={onModalClose}
          type="button"
          variant="filled"
        >
          {t("audience.views.cancel")}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
};

ViewsModal.displayName = "ViewsModal";

export default ViewsModal;

import { ViewsDetails } from '@edifice.io/client';
import { StringUtils } from '@edifice.io/utilities';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../components';
import { IconSee, IconUsers } from '../icons/components';
import ViewsByProfileCard from './ViewsByProfileCard';

/**
 * Props for the ViewsModal component.
 */
export interface ViewsModalProps {
  /**
   * Details of the views to be displayed in the modal.
   */
  viewsDetails: ViewsDetails;

  /**
   * Boolean flag indicating whether the modal is open.
   */
  isOpen: boolean;

  /**
   * Callback function to be called when the modal is closed.
   */
  onModalClose: () => void;
}

const ViewsModal = ({
  viewsDetails,
  isOpen,
  onModalClose,
}: ViewsModalProps) => {
  const { t } = useTranslation();

  const hasUniqueViews = viewsDetails.uniqueViewsCounter !== undefined;

  return (
    // Using a fragment to ensure Storybook correctly interprets JSDoc comments: https://github.com/storybookjs/storybook/issues/27169
    <>
      {createPortal(
        <Modal id="ViewsModal" isOpen={isOpen} onModalClose={onModalClose}>
          <Modal.Header onModalClose={onModalClose}>
            {t('audience.views.title')}
          </Modal.Header>
          <Modal.Body>
            <div className="views-detail-line p-8 mb-12">
              <div className="views-detail-icon rounded p-8">
                <IconSee />
              </div>
              <div className="h3">
                {StringUtils.toCounter(viewsDetails.viewsCounter)}
              </div>
              <div>{t('audience.views.detail.viewsCounter')}</div>
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
                  <div>{t('audience.views.detail.uniqueViewsCounter')}</div>
                </>
              ) : (
                <div>{t('audience.views.detail.noUniqueViews')}</div>
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
              {t('audience.views.cancel')}
            </Button>
          </Modal.Footer>
        </Modal>,
        document.getElementById('portal') as HTMLElement,
      )}
    </>
  );
};

ViewsModal.displayName = 'ViewsModal';

export default ViewsModal;

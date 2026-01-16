import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button, Image, Modal } from '../../../components';
import { useOnboardingModal } from './useOnboardingModal';
interface ModalItemsProps {
  /**
   * /onboarding/*.svg
   */
  src: string;
  /**
   * Image Companion text
   */
  alt: string;
  /**
   * Text below image
   */
  text: string;
  /**
   * Title of the item
   */
  title?: string;
}

interface ModalOptionsProps {
  /**
   * Modal title
   */
  title?: string;
  /**
   * Prev button text
   */
  prevText?: string;
  /**
   * Next button text
   */
  nextText?: string;
  /**
   * Close button text
   */
  closeText?: string;
}

export interface OnboardingModalRef {
  setIsOpen: (isOpen: boolean) => void;
  handleSavePreference: () => void;
}

interface OnboardingProps {
  id: string;
  items: ModalItemsProps[];
  modalOptions?: ModalOptionsProps;
  isOnboardingChange?: (isOnboarding: boolean) => void;
}

const OnboardingModal = forwardRef<OnboardingModalRef, OnboardingProps>(
  (
    { id, items, modalOptions = {}, isOnboardingChange }: OnboardingProps,
    ref,
  ) => {
    const [swiperInstance, setSwiperInstance] = useState<any>();
    const [swiperProgress, setSwiperprogress] = useState<number>(0);

    const { isOpen, isOnboarding, setIsOpen, handleSavePreference } =
      useOnboardingModal(id);

    useImperativeHandle(ref, () => ({
      setIsOpen,
      handleSavePreference,
    }));

    // Effect to notify child component about onboarding state change
    useEffect(() => {
      if (isOnboardingChange) {
        isOnboardingChange(isOnboarding);
      }
    }, [isOnboarding, isOnboardingChange]);

    useEffect(() => {
      const link = document.createElement('link');
      link.href =
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
      link.rel = 'stylesheet';
      link.type = 'text/css';

      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }, []);

    const { t } = useTranslation();

    const { title, prevText, closeText, nextText } = modalOptions;
    const currentTitle =
      swiperInstance?.activeIndex != undefined &&
      items[swiperInstance?.activeIndex]?.title
        ? items[swiperInstance.activeIndex].title
        : title;

    const handleCloseWithPreference = () => {
      handleSavePreference();
      setSwiperprogress(0);
    };

    const handleCloseWithoutPreference = () => {
      setIsOpen(false);
      setSwiperprogress(0);
    };

    return createPortal(
      <Modal
        id="onboarding-modal"
        data-testid="modal-onboarding"
        size="md"
        isOpen={isOpen}
        focusId="nextButtonId"
        onModalClose={handleCloseWithoutPreference}
      >
        <Modal.Header onModalClose={handleCloseWithoutPreference} centered>
          {t(currentTitle || 'explorer.modal.onboarding.trash.title')}
        </Modal.Header>
        <Modal.Body>
          <Swiper
            modules={[Pagination]}
            onSwiper={(swiper) => {
              setSwiperInstance(swiper);
            }}
            onSlideChange={(swiper) => {
              setSwiperprogress(swiper.progress);
            }}
            pagination={{
              clickable: true,
            }}
          >
            {items.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <Image
                    width="270"
                    height="140"
                    className="mx-auto my-12"
                    loading="lazy"
                    src={item.src}
                    alt={t(item.alt)}
                  />
                  <p
                    className="text-center"
                    dangerouslySetInnerHTML={{ __html: t(item.text) }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Modal.Body>
        <Modal.Footer>
          <Button
            data-testid="modal-onboarding-later"
            type="button"
            color="tertiary"
            variant="ghost"
            onClick={handleCloseWithoutPreference}
          >
            {t('explorer.modal.onboarding.trash.later')}
          </Button>

          {swiperProgress > 0 && (
            <Button
              data-testid="modal-onboarding-previous"
              type="button"
              color="primary"
              variant="outline"
              onClick={() => swiperInstance.slidePrev()}
            >
              {t(prevText || 'explorer.modal.onboarding.trash.prev')}
            </Button>
          )}
          {swiperProgress < 1 && (
            <Button
              id="nextButtonId"
              data-testid="modal-onboarding-next"
              type="button"
              color="primary"
              variant="filled"
              onClick={() => swiperInstance.slideNext()}
            >
              {t(nextText || 'explorer.modal.onboarding.trash.next')}
            </Button>
          )}
          {swiperProgress === 1 && (
            <Button
              data-testid="modal-onboarding-close"
              type="button"
              color="primary"
              variant="filled"
              onClick={() => {
                if (isOnboarding) {
                  handleCloseWithPreference();
                } else {
                  handleCloseWithoutPreference();
                }
              }}
            >
              {t(closeText || 'explorer.modal.onboarding.trash.close')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>,
      (document.getElementById('portal') as HTMLElement) || document.body,
    );
  },
);

OnboardingModal.displayName = 'OnboardingModal';

export default OnboardingModal;

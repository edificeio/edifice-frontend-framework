import { ReactNode } from 'react';

import { animated, useTransition } from '@react-spring/web';
import clsx from 'clsx';

import { Flex } from '../Flex';
import { ModalProps } from '../Modal';
import ButtonSkeleton from './ButtonSkeleton';
import TextSkeleton from './TextSkeleton';

export type ModalSkeletonProps = Pick<ModalProps, 'size' | 'viewport'> & {
  children?: ReactNode;
  footer?: ReactNode;
};

/**
 * ModalSkeleton Component
 */
const Root = ({
  size = 'md',
  viewport = false,
  children = (
    <Flex gap="4" direction="column">
      <TextSkeleton size="lg" />
      <TextSkeleton size="lg" />
      <TextSkeleton size="lg" />
    </Flex>
  ),
  footer = (
    <>
      <ButtonSkeleton color="tertiary" />
      <ButtonSkeleton color="primary" />
    </>
  ),
}: ModalSkeletonProps) => {
  const modalClasses = clsx('modal fade show d-block', {
    viewport: viewport,
    [`modal-${size}`]: size,
  });

  const dialogClasses = clsx('modal-dialog');

  const transition = useTransition(true, {
    from: {
      x: -50,
      opacity: 0,
    },
    enter: {
      x: 0,
      opacity: 1,
    },
    leave: {
      x: 50,
      opacity: 0,
    },
  });

  return transition((style) => (
    <>
      <animated.div
        role="dialog"
        aria-modal="true"
        className={modalClasses}
        style={style}
        tabIndex={-1}
      >
        <div className={dialogClasses}>
          <div className="modal-content placeholder">
            <div className="modal-header">
              <h2 className="modal-title" aria-hidden>
                &nbsp;
              </h2>
              <ButtonSkeleton className="btn-close" color="tertiary" />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">{footer}</div>
          </div>
        </div>
      </animated.div>
      <animated.div
        className="modal-backdrop fade show"
        style={{ opacity: 0.65 }}
      ></animated.div>
    </>
  ));
};

Root.displayName = 'ModalSkeleton';

export default Root;

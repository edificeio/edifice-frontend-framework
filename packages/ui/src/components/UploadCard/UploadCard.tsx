import { useTranslation } from 'react-i18next';
import { Close, Reset, SuccessOutline, Wand } from '../../../../icons/dist';

import { Tooltip } from '..';
import { usePaths } from '../../core';
import { Status } from '../../types';
import { Button, IconButton } from '../Button';
import { Card, CardProps } from '../Card';
import { Image } from '../Image';
import { Loading } from '../Loading';

export interface UploadItemProps {
  /**
   * File's image
   * */
  src: string;
  /**
   * File's name
   * */
  name: string;
  /**
   * File's info
   * */
  info?: { type: string; weight: string };
}

export interface UploadCardProps extends CardProps {
  /**
   * UploadItemProps
   * */
  item: UploadItemProps;
  /**
   * idle, loading, success, warning, error
   * */
  status?: Status;
  /**
   * Delete callback
   * */
  onDelete?: () => void;
  /**
   * Edit callback
   * */
  onEdit?: () => void;
  /**
   * Retry callback
   * */
  onRetry?: () => void;
}

export const UploadCard = ({
  item,
  status = 'idle',
  isClickable = false,
  isSelectable = false,
  onDelete,
  onEdit,
  onRetry,
}: UploadCardProps) => {
  const [imagePath] = usePaths();

  const { t } = useTranslation();

  const { src, name, info } = item;

  const isIdle = status === 'idle';
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  const isTypeImage = info?.type.startsWith('image');

  /**
   * WB-3053: add mapping object to store information
   * <Image/> component is not used for placeholder because of re-render intempestive image download
   */
  const imgPlaceholder = `${imagePath}/common/image-placeholder.png`;
  const defaultMapping = {
    text: '',
    context: null,
    image: <img src={imgPlaceholder} alt="" width="48" height="48" />,
  };

  const mapping = {
    error: {
      text: (
        <strong>
          <small className="text-danger caption">
            {t('tiptap.upload.error')}
          </small>
        </strong>
      ),
      context: (
        <Button
          leftIcon={<Reset />}
          variant="ghost"
          color="tertiary"
          onClick={onRetry}
        >
          {t('tiptap.upload.retry')}
        </Button>
      ),
      image: (
        <Image
          alt=""
          src={`${imagePath}/common/image-status-error.svg`}
          objectFit="cover"
        />
      ),
    },
    idle: defaultMapping,
    loading: {
      text: '',
      context: (
        <Tooltip message={t('tiptap.tooltip.upload.loading')} placement="top">
          <Loading
            isLoading
            loadingPosition="left"
            className="text-secondary"
          />
        </Tooltip>
      ),
      image: defaultMapping.image,
    },
    warning: defaultMapping,
    success: {
      text: (
        <em>
          {info?.type} {info?.weight && `- ${info.weight}`}
        </em>
      ),
      context: (
        <Tooltip message={t('tiptap.tooltip.upload.loaded')} placement="top">
          <SuccessOutline className="text-success" />
        </Tooltip>
      ),
      image: (
        <Image
          alt=""
          src={src ?? ''}
          width="48"
          objectFit="cover"
          className="rounded"
          style={{ aspectRatio: 1 / 1 }}
        />
      ),
    },
    unknown: defaultMapping,
  };

  const canEditItem = () =>
    isTypeImage && (
      <Tooltip message={t('tiptap.tooltip.upload.edit')} placement="top">
        <IconButton
          icon={<Wand />}
          variant="ghost"
          aria-label={t('tiptap.tooltip.upload.loading')}
          disabled={isLoading || !isSuccess}
          onClick={onEdit}
          color="secondary"
        />
      </Tooltip>
    );

  return (
    <Card
      isClickable={isClickable}
      isSelectable={isSelectable}
      className="card-upload"
    >
      <Card.Body>
        <div className="card-image">{mapping[status].image}</div>
        <div className="text-truncate">
          <Card.Text>{name}</Card.Text>
          <Card.Text className="caption">{mapping[status].text}</Card.Text>
        </div>
        {!isIdle && (
          <div className="ms-auto">
            <div className="d-flex align-items-center gap-12">
              {mapping[status].context}
              {!isIdle && <div className="vr"></div>}
              {canEditItem()}
              <Tooltip
                message={t('tiptap.tooltip.upload.delete')}
                placement="top"
              >
                <IconButton
                  icon={<Close />}
                  variant="ghost"
                  aria-label={t('tiptap.tooltip.upload.delete')}
                  color="tertiary"
                  onClick={onDelete}
                />
              </Tooltip>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

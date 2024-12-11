import { useEffect, useId, useState } from 'react';

import { Embedder, odeServices } from '@edifice.io/client';
import { useDebounce } from '@uidotdev/usehooks';
import { useTranslation } from 'react-i18next';
import {
  Button,
  EmptyScreen,
  FormControl,
  Image,
  Input,
} from '../../../components';
import { IconArrowRight, IconGlobe } from '../../icons/components';

import illuError from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-error.svg';

export interface VideoEmbedProps {
  switchType?: (type: 'embedder') => void;
  onSuccess: (resource?: string) => void;
}

const VideoEmbed = ({ switchType, onSuccess }: VideoEmbedProps) => {
  const { t } = useTranslation();

  const [url, setUrl] = useState<string>();
  const [embedVideo, setEmbedVideo] = useState<string>();
  const [embedder, setEmbedder] = useState<Embedder | undefined>(undefined);
  const [whiteListProvider, setWhiteListProvider] = useState<Embedder[]>();
  const debounceChangeUrl = useDebounce<string>(url || '', 300);
  const formControlId = useId();

  useEffect(() => {
    initWhiteListProvider();
  }, []);

  useEffect(() => {
    if (whiteListProvider && debounceChangeUrl) {
      const embedderFound = odeServices
        .embedder()
        .getProviderFromUrl(whiteListProvider, debounceChangeUrl);
      if (embedderFound) {
        setEmbedder(embedderFound);
        const embedVideo = odeServices
          .embedder()
          .getEmbedCodeForProvider(embedderFound, debounceChangeUrl);
        setEmbedVideo(embedVideo);
        onSuccess(embedVideo);
      } else {
        setEmbedder(undefined);
        onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceChangeUrl, whiteListProvider]);

  const initWhiteListProvider = async () => {
    const whiteListProviderResponse = await Promise.all([
      odeServices.embedder().getDefault(),
      odeServices.embedder().getCustom(),
    ]).then((results) => results.flat());
    setWhiteListProvider(whiteListProviderResponse);
  };

  function handleUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    const url: string = event.currentTarget.value;
    setUrl(url);
    onSuccess(url?.length ? url : undefined);
  }

  function handleSwitchToEmbedderClick() {
    switchType?.('embedder');
  }

  const renderContent = () => {
    if (debounceChangeUrl) {
      if (embedder) {
        return (
          <div className="mx-auto mt-16">
            <div className="video-embed-provider d-flex align-items-center">
              <Image
                src={embedder.logo}
                alt={'Logo ' + embedder.displayName}
                className="video-embed-provider-logo"
              ></Image>
              {embedder.displayName}
            </div>
            {embedVideo && (
              <div
                className="video-embed-preview mt-12"
                dangerouslySetInnerHTML={{
                  __html: embedVideo,
                }}
              ></div>
            )}
          </div>
        );
      } else {
        return (
          <div className="d-flex flex-column align-items-center m-16">
            <EmptyScreen
              imageSrc={illuError}
              title={t('bbm.video.previewError.title')}
              text={t('bbm.video.previewError.text')}
            />
            {switchType && (
              <Button
                variant="ghost"
                color="primary"
                onClick={handleSwitchToEmbedderClick}
                className="align-items-start mt-16"
              >
                {t('bbm.video.useEmbedCode')} <IconArrowRight />
              </Button>
            )}
          </div>
        );
      }
    } else {
      return (
        switchType && (
          <div className="d-flex my-16 align-items-start">
            <Button
              variant="ghost"
              color="primary"
              onClick={handleSwitchToEmbedderClick}
              className="align-items-start"
            >
              {t('bbm.video.useEmbedCode')} <IconArrowRight />
            </Button>
          </div>
        )
      );
    }
  };

  return (
    <div className="d-flex flex-column flex-fill video-embed">
      <div className="mb-8 d-flex">
        <IconGlobe className="me-8" />
        {t('bbm.video.url.title')}
      </div>
      <FormControl id={formControlId}>
        <Input
          size="md"
          type="text"
          placeholder={t('bbm.video.url.placeholder')}
          onChange={handleUrlChange}
        />
      </FormControl>
      <>{renderContent()}</>
    </div>
  );
};

export default VideoEmbed;

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { FormControl, TextArea } from '../../../components';
import { IconCode } from '../../icons/components';

export interface EmbedProps {
  onSuccess: (resource?: string) => void;
}

const Embed = ({ onSuccess }: EmbedProps) => {
  const { t } = useTranslation();

  const [htmlContent, setHTMLContent] = useState<string>();

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const HTMLContent = event.target.value;

    setHTMLContent(HTMLContent);

    if (HTMLContent?.length) {
      onSuccess(HTMLContent);
    } else {
      onSuccess();
    }
  }

  return (
    <div className="d-flex flex-column flex-fill">
      <div className="mb-32">{t('bbm.embed.description')}</div>
      <div className="mb-8 d-flex">
        <IconCode className="me-8" />
        {t('bbm.embed.title')}
      </div>
      <FormControl id="iframeContent">
        <TextArea
          size="md"
          height="sm"
          placeholder={t('bbm.embed.placeholder')}
          onChange={handleContentChange}
        />
      </FormControl>
      {!!htmlContent?.length && (
        <div
          className="embed-preview mt-12"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      )}
      {!htmlContent?.length && (
        <div className="embed-preview mt-12 d-flex align-items-center justify-content-center bg-gray-300 text-black-50 rounded-3">
          <strong>{t('bbm.embed.preview')}</strong>
        </div>
      )}
    </div>
  );
};

export default Embed;

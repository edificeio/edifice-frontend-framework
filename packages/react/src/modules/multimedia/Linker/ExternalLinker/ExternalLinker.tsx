import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { StringUtils } from '@edifice.io/utilities';
import { Checkbox, FormControl, Input, Label } from '../../../../components';
import { useToggle } from '../../../../hooks';

/**
 * Properties for the ExternalLink.
 */
export interface IExternalLink {
  /** Link Url */
  url: string;
  /** Link text for the llink display */
  text?: string;
  /** Link target (default: _blank) */
  target?: '_blank';
}

/**
 * Properties for the ExternalLinker react component.
 */
export type ExternalLinkerProps = {
  /** Default link to update. */
  link?: Partial<IExternalLink>;
  /**
   * Set true if the user select multiple nodes. (note simple text selection)
   */
  multiNodeSelected?: boolean;
  /** Target */
  target?: '_blank';
  /** Notify when the user change any link information */
  onChange?: (link?: IExternalLink) => void;
};

export const ExternalLinker = ({
  link,
  onChange,
  multiNodeSelected = false,
}: ExternalLinkerProps) => {
  const { t } = useTranslation();

  const [linkText, setLinkText] = useState<string>(link?.text || '');
  const [linkURL, setLinkURL] = useState<string>(link?.url || '');
  const [isBlankTarget, toggleBlankTarget] = useToggle(
    link ? link.target === '_blank' : true,
  );

  useEffect(() => {
    if (multiNodeSelected && link?.text) {
      setLinkText(link.text.slice(0, 20) + '...');
    }
  }, [multiNodeSelected, link]);

  useEffect(() => {
    if (!linkURL.length) {
      onChange?.();
      return;
    }

    const newLink: IExternalLink = {
      url: linkURL,
      text: !multiNodeSelected ? linkText || linkURL : link?.text,
      target: isBlankTarget ? '_blank' : undefined,
    };
    if (
      !StringUtils.isLocalURL(linkURL) &&
      !StringUtils.startWithHttp(linkURL)
    ) {
      newLink.url = 'http://' + linkURL;
    }
    onChange?.(newLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkText, linkURL, isBlankTarget]);

  return (
    <>
      <div className="d-flex flex-column flex-fill gap-24">
        <FormControl id="linkText" isOptional>
          <Label>{t('bbm.linker.ext.text')}</Label>
          <Input
            type="text"
            placeholder={t('bbm.linker.ext.text.placeholder')}
            size="md"
            disabled={multiNodeSelected}
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </FormControl>
        <FormControl id="linkUrl" isRequired>
          <Label>{t('bbm.linker.ext.url')}</Label>
          <Input
            type="text"
            placeholder={t('bbm.linker.ext.url.placeholder')}
            size="md"
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
          />
        </FormControl>
        <Checkbox
          label={t('bbm.linker.open.tab')}
          onChange={() => toggleBlankTarget()}
          checked={isBlankTarget}
        />
      </div>
    </>
  );
};

export default ExternalLinker;

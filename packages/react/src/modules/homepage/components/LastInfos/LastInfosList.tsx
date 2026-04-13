import { useTranslation } from 'react-i18next';
import { Button, EmptyScreen, Flex } from '../../../../components';
import { IconArrowRight } from '../../../icons/components';
import LastInfos, { LastInfosProps } from './LastInfos';

import illuLastInfosEmptyScreen from '@edifice.io/bootstrap/dist/images/homepage/illu-last-infos-beta.svg';

export interface LastInfosListProps {
  /** List of Info to display. */
  infos: Array<LastInfosProps>;

  /** Handle a click on an info. If undefined, Actualites will be opened to read the info details. */
  onInfoClick?: (threadId: number | string, id: number | string) => void;

  /** Handle a click on the "See more" button. If undefined, Actualites will be opened. */
  onSeeMoreClick?: () => void;
}

export function LastInfosList({
  infos,
  onInfoClick: handleInfoClick = (
    threadId: number | string,
    id: number | string,
  ) => {
    window.open(`/actualites/threads/${threadId}?info=${id}`, '_self');
  },
  onSeeMoreClick: handleSeeMoreClick = () => {
    window.open('/actualites', '_self');
  },
}: LastInfosListProps) {
  const { t } = useTranslation();

  return (
    <Flex gap="4" direction="column" className="last-infos-list">
      <Flex justify="between" align="center" className="last-infos-list-header">
        <h4 className="fw-bold">
          {t('homepage.widget.last-infos-list.title')}
        </h4>
        <Button
          color="tertiary"
          variant="ghost"
          className="rounded-pill fw-bold"
          rightIcon={<IconArrowRight />}
          onClick={handleSeeMoreClick}
        >
          {t('homepage.widget.last-infos-list.see.more')}
        </Button>
      </Flex>

      <Flex gap="16" direction="column" className="last-infos-list-body">
        {infos.length === 0 ? (
          <EmptyScreen
            imageSrc={illuLastInfosEmptyScreen}
            size={64}
            text={t('homepage.widget.last-infos-list.empty')}
          />
        ) : (
          infos.map((infosProps) => (
            <LastInfos
              key={infosProps.id}
              onClick={handleInfoClick}
              {...infosProps}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
}

LastInfosList.displayName = 'LastInfosList';

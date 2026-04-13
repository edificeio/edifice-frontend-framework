import { useTranslation } from 'react-i18next';
import { Button, EmptyScreen, Flex } from '../../../../components';
import { IconArrowRight } from '../../../icons/components';
import LastInfos, { LastInfosProps } from './LastInfos';

import illuLastInfosEmptyScreen from '@edifice.io/bootstrap/dist/images/homepage/illu-last-infos-beta.svg';

export interface LastInfosListProps {
  infos: Array<LastInfosProps>;
}

export function LastInfosList({ infos }: LastInfosListProps) {
  const { t } = useTranslation();

  const handleSeeMoreClick = () => {
    window.open('/actualites', '_self');
  };

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
            <LastInfos key={infosProps.id} {...infosProps} />
          ))
        )}
      </Flex>
    </Flex>
  );
}

LastInfosList.displayName = 'LastInfosList';

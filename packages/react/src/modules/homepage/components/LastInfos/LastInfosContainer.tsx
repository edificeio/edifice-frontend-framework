import { useTranslation } from 'react-i18next';
import { TextSkeleton, Flex } from '../../../../components';
import LastInfos from './LastInfos';
import './LastInfosContainer.css';
import { useLastInfos } from './useLastInfos';

export function LastInfosContainer() {
  const { t } = useTranslation();
  const { infos, isLoading, error } = useLastInfos();

  return (
    <div className="last-infos-container">
      <Flex gap={4} justify:"space-between" className="last-infos-header">
        {t('last-infos-widget.widget.title')}
        <a href="/actualites" title={t('last-infos-widget.widget.see.all')}>
          {t('last-infos-widget.widget.see.more')}
        </a>
      </div>

      <div className="last-infos-body">
        {isLoading ? (
          <>
            <TextSkeleton size="lg" />
            <TextSkeleton size="lg" />
            <TextSkeleton size="lg" />
          </>
        ) : infos ? (
          infos.map(({ thread, ...otherProps }) => (
            <LastInfos
              icon={thread.icon}
              thread={thread.title}
              {...otherProps}
            />
          ))
        ) : (
          error?.message
        )}
      </div>
    </div>
  );
}

LastInfosContainer.displayName = 'LastInfosContainer';

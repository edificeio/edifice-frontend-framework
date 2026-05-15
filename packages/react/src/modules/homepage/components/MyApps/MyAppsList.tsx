import { useTranslation } from 'react-i18next';
import { EmptyScreen, Grid } from '../../../../components';

import illuMyAppsEmptyScreen from '@edifice.io/bootstrap/dist/images/homepage/illu-favorites-beta.svg';
import { IWebApp } from '@edifice.io/client';
import FavoriteApp from './FavoriteApp';

export interface MyAppsListProps {
  /** List of favorite apps. */
  apps: Array<IWebApp>;

  /** Handle a click on an application. If undefined, My Apps will be opened instead. */
  onAppClick?: (app: IWebApp) => void;

  /** Handle a click on the "See all" button. */
  onSeeAllClick?: () => void;
}

export function MyAppsList({
  apps,
  onAppClick: handleAppClick = (app: IWebApp) => {
    window.open(`${app.prefix}`, '_self');
  },
}: MyAppsListProps) {
  const { t } = useTranslation();

  return (
    <Grid className="my-apps-list">
      {apps.length === 0 ? (
        <EmptyScreen
          imageSrc={illuMyAppsEmptyScreen}
          size={50}
          text={t('homepage.widget.my-apps-list.empty')}
        />
      ) : (
        apps.map((app) => (
          <Grid.Col sm="1">
            <FavoriteApp key={app.name} app={app} onClick={handleAppClick} />
          </Grid.Col>
        ))
      )}
    </Grid>
  );
}

MyAppsList.displayName = 'MyAppsList';

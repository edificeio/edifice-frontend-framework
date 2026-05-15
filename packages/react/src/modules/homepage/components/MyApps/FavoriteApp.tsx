import { IWebApp } from '@edifice.io/client';
import { AppIcon, ButtonBeta } from '../../../../components';

export interface FavoriteAppProps {
  app: IWebApp;
  onClick?: (app: IWebApp) => void;
}

const FavoriteApp = ({ app, onClick: handleClick }: FavoriteAppProps) => {
  return (
    <ButtonBeta
      leftIcon={<AppIcon app={app} />}
      onClick={() => handleClick?.(app)}
    ></ButtonBeta>
  );
};

FavoriteApp.displayName = 'FavoriteApp';

export default FavoriteApp;

import { type ReactNode } from 'react';

import { type IWebApp } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '../..';

export const WidgetAppsFooter = () => {
  const { t } = useTranslation();
  return (
    <div className="widget-footer">
      <div className="widget-footer-action">
        <a href="/welcome" className="link">
          {t('plus')}
        </a>
      </div>
    </div>
  );
};

const appToOpenOnBlank = ['Administration'];

export const WidgetAppsBody = ({
  bookmarkedApps,
}: {
  bookmarkedApps: IWebApp[];
}) => {
  const { t } = useTranslation();

  //FI : this helper exists also on entcore/portal
  const getAppName = (data: IWebApp): string => {
    return data.prefix && data.prefix.length > 1
      ? t(data.prefix.substring(1))
      : t(data.displayName) || '';
  };

  return (
    <div className="widget-body d-flex flex-wrap">
      {!bookmarkedApps.length && (
        <div className="text-dark">{t('navbar.myapps.more')}</div>
      )}
      {bookmarkedApps.slice(0, 6).map((app, index) => {
        return (
          <a
            key={index}
            href={app.address}
            title={getAppName(app)}
            className="bookmarked-app"
            target={
              appToOpenOnBlank.includes(app.name) ||
              app.isExternal ||
              app.category === 'connector'
                ? '_blank'
                : undefined
            }
            rel={
              appToOpenOnBlank.includes(app.name) ||
              app.isExternal ||
              app.category === 'connector'
                ? 'noopener noreferrer'
                : undefined
            }
          >
            <AppIcon app={app} size="32" />
          </a>
        );
      })}
    </div>
  );
};

export default function WidgetApps({ children }: { children: ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-applications">{children}</div>
    </div>
  );
}

import { forwardRef, Ref } from 'react';

import { IWebApp } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import { IconRafterRight } from '../../modules/icons/components';
import { AppIcon } from '../AppIcon';
import Heading from '../Heading/Heading';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbList from './BreadcrumbList';
import BreadcrumbNav from './BreadcrumbNav';

export interface BreadcrumbProps {
  /**
   * Pass all data about current application
   */
  app: IWebApp;
  /**
   * Show name of the current resource
   */
  name?: string;
}

const Breadcrumb = forwardRef(
  ({ app, name }: BreadcrumbProps, ref: Ref<HTMLElement>) => {
    const { t } = useTranslation();

    return (
      <BreadcrumbNav app={app} ref={ref} className="mw-100">
        <BreadcrumbList className="gap-12 mw-100">
          {name ? (
            <>
              <BreadcrumbItem>
                <a
                  href={app?.address}
                  className="d-flex"
                  aria-label={t(app?.displayName)}
                >
                  <AppIcon app={app} size="40" />
                </a>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <IconRafterRight
                  color="var(--edifice-gray-600)"
                  width={20}
                  height={20}
                />
              </BreadcrumbItem>
              <BreadcrumbItem className="text-truncate">
                <Heading level="h1" headingStyle="h3" className="text-truncate">
                  {name}
                </Heading>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem className="gap-12 d-flex align-items-center">
              <a
                href={app?.address}
                className="d-flex"
                aria-label={t(app?.displayName)}
              >
                <AppIcon app={app} size="40" />
              </a>
              <Heading
                level="h1"
                headingStyle="h3"
                className="d-none d-md-flex"
              >
                {t(app?.displayName)}
              </Heading>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </BreadcrumbNav>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;

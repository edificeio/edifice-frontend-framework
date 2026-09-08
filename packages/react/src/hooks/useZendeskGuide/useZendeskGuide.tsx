import { useEffect, useState } from 'react';

import { UserProfile, odeServices } from '@edifice.io/client';

import { useIsAdml, useUser } from '..';
import EdificeAssistanceButton from '../../components/EdificeAssistanceButton/EdificeAssistanceButton';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useEdificeTheme } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';
import { useHasWorkflow } from '../useHasWorkflow';

type DataModel =
  | {
      labels: Record<string, string>;
      default: string;
      profile: string[];
    }
  | undefined;

/** Add Zendesk Guide  */
export default function useZendeskGuide() {
  const { currentLanguage } = useEdificeClient();
  const { userDescription } = useUser();
  const { isAdml } = useIsAdml();

  const { theme } = useEdificeTheme();

  const isMobileView = window.innerWidth <= 768;

  const hasSupportWorkflow = useHasWorkflow(
    'net.atos.entng.support.controllers.DisplayController|view',
  );

  const [locationPathname, setLocationPathname] = useState('');
  const [dataModule, setDataModule] = useState<DataModel>(undefined);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const setZendeskGuideLabels = () => {
    // Split the location pathname to get the module label
    const modulePathnameSplit = locationPathname.split('/');
    let moduleLabel = '';

    let labels = '';

    // Get the data module from the data and check if the module has labels if not take the default value if exists
    if (
      dataModule?.labels &&
      Object.keys(dataModule?.labels).length > 0 &&
      modulePathnameSplit.length > 1
    ) {
      // Reformat the pathname with removing the id if exists
      for (let i = 1; i < modulePathnameSplit.length; i++) {
        if (
          modulePathnameSplit[i].length > 0 &&
          modulePathnameSplit[i].match(/\d/) == null
        ) {
          if (moduleLabel.length === 0) {
            moduleLabel = modulePathnameSplit[i];
          } else {
            moduleLabel = moduleLabel + '/' + modulePathnameSplit[i];
          }
        }
      }

      // Check if the module has label in dataModule if not take the default value
      if (
        dataModule?.labels &&
        Object.prototype.hasOwnProperty.call(dataModule?.labels, moduleLabel)
      ) {
        labels =
          dataModule?.labels[moduleLabel as keyof typeof dataModule.labels];
      } else if (dataModule?.default && String(dataModule.default).length > 0) {
        labels = dataModule?.default;
      }
    } else if (dataModule?.default && String(dataModule?.default).length > 0) {
      labels = dataModule?.default;
    }

    // Exception for the collaborative wall
    const isCollaborativeWallMobile =
      modulePathnameSplit.includes('collaborativewall') &&
      modulePathnameSplit.includes('id') &&
      isMobileView;

    if (isCollaborativeWallMobile) {
      (window as any).zE('webWidget', 'hide');
    }
    setIsHidden(isCollaborativeWallMobile);

    // Check if label has tag ${adml} and replace it with the user role
    if (labels.includes('${adml}')) {
      if (isAdml) {
        labels = labels.replace('${adml}', 'adml');
      } else {
        labels = labels.replace('/${adml}', '');
      }
    }

    // Check if the label has a ${profile} tag and replace it with the user profile
    if (labels.includes('${profile}')) {
      const userProfile = userDescription?.profiles as UserProfile;
      labels = labels.replace(
        '${profile}',
        (userProfile[0] as string).toLowerCase(),
      );
    }

    // Check if the user has a ${theme} tag and replace it with the theme
    if (labels.includes('${theme')) {
      if (theme?.is1d) {
        labels = labels.replace('${theme}', '1D');
      } else {
        labels = labels.replace('${theme}', '2D');
      }
    }

    // Check if the label is not empty and set the labels to the Zendesk Guide Widget
    (window as any).zE('webWidget', 'helpCenter:setSuggestions', {
      labels: [labels],
    });
  };

  useEffect(() => {
    if (window.location.pathname !== locationPathname) {
      setLocationPathname(window.location.pathname);
    }

    if (dataModule === undefined || Object.keys(dataModule).length === 0) {
      return;
    }

    setZendeskGuideLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname, dataModule]);

  useEffect(() => {
    if (
      document.getElementById('ze-snippet') ||
      hasSupportWorkflow === undefined
    ) {
      return;
    }

    (async () => {
      const zendeskGuideConfig = await odeServices
        .http()
        .get('/zendeskGuide/config');

      if (
        zendeskGuideConfig &&
        zendeskGuideConfig.key &&
        zendeskGuideConfig.key !== ''
      ) {
        const scriptZendesk = document.createElement('script');
        scriptZendesk.id = 'ze-snippet';
        scriptZendesk.src = `https://static.zdassets.com/ekr/snippet.js?key=${zendeskGuideConfig.key}`;

        document.body.appendChild(scriptZendesk).onload = () => {
          if (currentLanguage === 'es') {
            (window as any).zE(function () {
              (window as any).zE.setLocale('es-419');
            });
          } else {
            (window as any).zE(function () {
              (window as any).zE.setLocale('fr');
            });
          }

          if (Object.keys(zendeskGuideConfig.module).length > 0) {
            setDataModule(zendeskGuideConfig.module);
          }

          (window as any).zE('webWidget', 'show');

          (window as any).zE('webWidget', 'updateSettings', {
            webWidget: {
              // Always blue/700, matching EdificeAssistanceButton's background.
              color: { theme: '#3030d1', header: '#738efc' },
              zIndex: 3,
              contactForm: {
                suppress: !hasSupportWorkflow,
              },
              helpCenter: {
                messageButton: {
                  '*': 'Assistance ENT',
                  'es-419': 'Asistencia ENT',
                },
                originalArticleButton:
                  zendeskGuideConfig.articleRedirectButton ?? true,
              },
            },
          });

          // The native Zendesk launcher is hidden (see _edifice-assistance-button.scss):
          // EdificeAssistanceButton is rendered instead and drives the widget via 'toggle'.
          setIsWidgetReady(true);

          (window as any).zE('webWidget:on', 'open', function () {
            if (hasSupportWorkflow) {
              (window as any).zE('webWidget', 'updateSettings', {
                webWidget: {
                  contactForm: {
                    suppress: false,
                  },
                },
              });
            }
          });

          (window as any).zE(
            'webWidget:on',
            'userEvent',
            function (ref: { category: any; action: any; properties: any }) {
              const category = ref.category;
              const action = ref.action;
              const properties = ref.properties;
              if (
                action === 'Contact Form Shown' &&
                category === 'Zendesk Web Widget' &&
                properties &&
                properties.name === 'contact-form' &&
                hasSupportWorkflow
              ) {
                (window as any).zE('webWidget', 'updateSettings', {
                  webWidget: {
                    contactForm: {
                      suppress: true,
                    },
                  },
                });
                (window as any).zE('webWidget', 'close');
                window.open('/support/tickets/new', '_blank');
              }
            },
          );
        };
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSupportWorkflow]);

  useEffect(() => {
    if (!isWidgetReady) {
      return;
    }

    // Some layouts (eg. PageLayout's "columns" scroll mode) scroll an inner
    // container instead of the window. Scroll events don't bubble, but a
    // capture-phase listener on window still sees them from any descendant,
    // so read the scrollTop off whichever element actually scrolled.
    const getScrollTop = (target: EventTarget | null) =>
      target instanceof HTMLElement ? target.scrollTop : window.scrollY;

    const handleScroll = (event: Event) =>
      setIsCollapsed(getScrollTop(event.target) > 5);

    setIsCollapsed(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isWidgetReady]);

  if (!isWidgetReady || isHidden) {
    return null;
  }

  return (
    <EdificeAssistanceButton
      collapsed={isCollapsed}
      onClick={() => (window as any).zE('webWidget', 'toggle')}
    />
  );
}

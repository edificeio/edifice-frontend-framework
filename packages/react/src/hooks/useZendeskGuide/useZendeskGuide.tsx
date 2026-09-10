import { useEffect, useState } from 'react';

import { UserProfile, odeServices } from '@edifice.io/client';

import { useIsAdml, useUser } from '..';
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

export interface UseZendeskGuideAPI {
  /** True once the widget script is loaded and configured. */
  isReady: boolean;
  /** True while the widget panel is open. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/** Add Zendesk Guide  */
export default function useZendeskGuide(): UseZendeskGuideAPI {
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
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    (window as any).zE?.('webWidget', 'open');
  };

  const close = () => {
    (window as any).zE?.('webWidget', 'close');
  };

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
    if (
      modulePathnameSplit.includes('collaborativewall') &&
      modulePathnameSplit.includes('id') &&
      isMobileView
    ) {
      (window as any).zE('webWidget', 'hide');
    }

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
    // Zendesk only allows a single handler per event, so whichever instance
    // of this hook is currently mounted must (re-)register its own closures
    // — otherwise a later mount reusing an already-bootstrapped widget (e.g.
    // PageLayout remounting on a route change) would never see isOpen change,
    // since only the first-ever mount's setIsOpen would still be wired up.
    const registerWidgetHandlers = () => {
      (window as any).zE('webWidget:on', 'open', function () {
        setIsOpen(true);

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

      (window as any).zE('webWidget:on', 'close', function () {
        setIsOpen(false);
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

    if (document.getElementById('ze-snippet')) {
      // The widget script was already bootstrapped by another instance of
      // this hook — still re-register this instance's own handlers.
      if ((window as any).zE) {
        registerWidgetHandlers();
        setIsReady(true);
      }
      return;
    }

    if (hasSupportWorkflow === undefined) {
      return;
    }

    (async () => {
      let zendeskGuideConfig;

      try {
        zendeskGuideConfig = await odeServices
          .http()
          .get('/zendeskGuide/config');
      } catch (error) {
        // Left uncaught, a failure here (e.g. `/zendeskGuide` not proxied by
        // a consuming app's local dev server) silently keeps `isReady` at
        // `false` forever, with nothing to explain why HelpZone never shows up.
        console.warn(
          '[useZendeskGuide] Failed to fetch the support widget config from ' +
            "`/zendeskGuide/config` — the widget (and HelpZone's button) " +
            "won't show up. If you're running a local dev server, check " +
            "that `/zendeskGuide` is proxied to your backend in your app's " +
            'Vite dev proxy config.',
          error,
        );
        return;
      }

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
              color: { theme: zendeskGuideConfig.color || '#ffc400' },
              zIndex: 3,
              launcher: {
                mobile: {
                  labelVisible: true,
                },
              },
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

          window.addEventListener('scroll', () => {
            (window as any).zE('webWidget', 'updateSettings', {
              webWidget: {
                launcher: {
                  mobile: {
                    labelVisible: window.scrollY <= 5,
                  },
                },
              },
            });
          });

          registerWidgetHandlers();

          setIsReady(true);
        };
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSupportWorkflow]);

  return { isReady, isOpen, open, close };
}

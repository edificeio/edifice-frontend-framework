import { IWebApp, type IWidget, WidgetName } from '@edifice.io/client';

export default function useEdificeIcons() {
  /**
   * Map between widget name and its icon name
   */
  const iconOfWidget: { [name in WidgetName]: string } = {
    'last-infos-widget': 'ic-widget-actualites',
    'birthday': 'ic-star',
    'calendar-widget': 'ic-widget-calendar',
    'carnet-de-bord': 'ic-widget-carnet-de-bord',
    'record-me': 'ic-widget-microphone',
    'mood': 'ic-star',
    'my-apps': 'ic-widget-apps',
    'notes': 'ic-widget-notes',
    'rss-widget': 'ic-widget-rss',
    'bookmark-widget': 'ic-widget-signets',
    'qwant': 'ic-widget-qwant',
    'qwant-junior': 'ic-widget-qwant',
    'agenda-widget': 'ic-widget-agenda',
    'cursus-widget': 'ic-widget-aide-devoirs',
    'maxicours-widget': 'ic-widget-maxicours',
    'school-widget': 'ic-widget-schoolbook',
    'universalis-widget': 'ic-widget-universalis',
    'briefme-widget': 'ic-widget-briefme',
  };
  /**
   * Map between apps and their CSS code.
   * @param app an IWebApp, or an app prefix
   */
  function getIconCode(app: IWebApp | string | undefined): string {
    let appCode: string = '';

    if (typeof app === 'string') {
      appCode = app;
    } else {
      appCode =
        app?.icon !== undefined
          ? app?.icon.trim().toLowerCase()
          : 'placeholder';
    }

    if (appCode && appCode.length > 0) {
      if (appCode.endsWith('-large')) appCode = appCode.replace('-large', '');
    } else if (typeof app === 'object') {
      // fallback value, probably won't ever happen
      appCode =
        app?.displayName !== undefined
          ? app?.displayName.trim().toLowerCase()
          : '';
    }
    // appCode = configurationFramework.Platform.idiom.removeAccents(appCode);
    // @see distinct values for app's displayName is in query /auth/oauth2/userinfo

    switch (appCode) {
      case 'admin.title':
        appCode = 'admin';
        break;
      case 'banques des savoirs':
        appCode = 'banquesavoir';
        break;
      case 'collaborativewall':
        appCode = 'collaborative-wall';
        break;
      case 'communautés':
        appCode = 'community';
        break;
        break;
      case 'directory.user':
        appCode = 'userbook';
        break;
      case 'emploi du temps':
        appCode = 'edt';
        break;
      case 'formulaire':
        appCode = 'forms';
        break;
      case 'messagerie':
        appCode = 'conversation';
        break;
      case 'news':
        appCode = 'actualites';
        break;
      case 'homeworks':
      case 'cahier de texte':
        appCode = 'cahier-de-texte';
        break;
      case 'diary':
      case 'cahier de texte 2d':
        appCode = 'cahier-textes';
        break;
      case 'scrap-book':
        appCode = 'scrapbook';
        break;
      default:
        break;
    }
    return appCode;
  }

  function isIconUrl(icon: string): string | boolean {
    return (
      icon &&
      (icon.startsWith('/') ||
        icon.startsWith('http://') ||
        icon.startsWith('https://'))
    );
  }

  /**
   *
   * @param app an IWebApp, or an app prefix
   * @return the CSS class used to style icons
   */
  function getIconClass(app: IWebApp | string): string {
    const appCode = getIconCode(app);
    if (appCode) return `color-app-${appCode}`;
    return `color-app-placeholder`;
  }
  /**
   *
   * @param app an IWebApp, or an app prefix
   * @return the CSS class used to style icons
   */
  function getBackgroundIconClass(app: IWebApp | string): string {
    const appCode = getIconCode(app);
    if (appCode) return `bg-app-${appCode}`;
    return `bg-app-placeholder`;
  }

  /**
   *
   * @param app an IWebApp, or an app prefix
   * @return the CSS class used to style icons
   */
  function getBackgroundLightIconClass(app: IWebApp | string): string {
    const appCode = getIconCode(app);
    if (appCode) return `bg-light-${appCode}`;
    return `bg-light-placeholder`;
  }

  /**
   *
   * @param app an IWebApp, or an app prefix
   * @return the CSS class used to style icons
   */
  function getBorderIconClass(app: IWebApp | string): string {
    const appCode = getIconCode(app);
    if (appCode) return `border-app-${appCode}`;
    return `border-app-placeholder`;
  }

  /**
   *
   * @param widget
   * @return the CSS class of a widget
   */
  function getWidgetIconClass(widget: IWidget): string {
    return iconOfWidget[widget.platformConf.name];
  }

  return {
    getIconClass,
    getBackgroundIconClass,
    getBackgroundLightIconClass,
    getBorderIconClass,
    getIconCode,
    getWidgetIconClass,
    isIconUrl,
  };
}

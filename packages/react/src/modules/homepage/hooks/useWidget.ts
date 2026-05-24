import {
  WIDGET_POSITION,
  WidgetName,
  WidgetPosition,
  WidgetUserPref,
} from '@edifice.io/client';
import { useCallback, useEffect, useState } from 'react';
import { useWidgetPreferences } from './useWidgetPreferences';

// Default index and position values for widgets.
const DEFAULT_VALUES = new Map<
  WidgetName,
  { index: number; position: WidgetPosition }
>()
  .set('school-widget', { index: 0, position: WIDGET_POSITION.LEFT })
  .set('my-apps', { index: 10, position: WIDGET_POSITION.RIGHT })
  .set('record-me', { index: 15, position: WIDGET_POSITION.RIGHT })
  .set('last-infos-widget', { index: 20, position: WIDGET_POSITION.LEFT }) // Actualités
  .set('qwant', { index: 30, position: WIDGET_POSITION.RIGHT })
  .set('qwant-junior', { index: 30, position: WIDGET_POSITION.LEFT })
  .set('universalis-widget', { index: 35, position: WIDGET_POSITION.RIGHT })
  .set('agenda-widget', { index: 40, position: WIDGET_POSITION.LEFT }) // Agenda
  .set('bookmark-widget', { index: 50, position: WIDGET_POSITION.RIGHT })
  .set('carnet-de-bord', { index: 60, position: WIDGET_POSITION.LEFT })
  .set('maxicours-widget', { index: 70, position: WIDGET_POSITION.RIGHT })
  .set('cursus-widget', { index: 80, position: WIDGET_POSITION.LEFT }) // Dictaphone
  .set('briefme-widget', { index: 90, position: WIDGET_POSITION.LEFT })
  .set('rss-widget', { index: 100, position: WIDGET_POSITION.LEFT })
  .set('mood', { index: 110, position: WIDGET_POSITION.LEFT })
  .set('birthday', { index: 120, position: WIDGET_POSITION.LEFT })
  .set('calendar-widget', { index: 130, position: WIDGET_POSITION.RIGHT }) // Calendrier
  .set('notes', { index: 140, position: WIDGET_POSITION.RIGHT });

export default function useWidget(widgetName: WidgetName) {
  const { widgets, preferences, savePreferences } = useWidgetPreferences();

  const [widget] = useState(() => widgets?.find((w) => w.name === widgetName));
  const [preference, setPreference] = useState<WidgetUserPref>();

  const savePreference = useCallback(
    (pref: WidgetUserPref) => {
      if (preferences) {
        preferences[widgetName] = pref;
        return savePreferences(preferences);
      }
    },
    [preferences, savePreferences],
  );

  // useEffect( () => {
  //   if( !widget ) {
  //     setWidget( widgets?.find((w) => w.name === widgetName) );
  //   }
  // }, [widgets])

  useEffect(() => {
    const defaultValue = DEFAULT_VALUES.get(widgetName);
    const pref = preferences?.[widgetName] ?? {
      index: defaultValue?.index ?? 999,
      show: true,
      position: defaultValue?.position,
    };
    if (widget?.mandatory) {
      pref.show = true;
      pref.index = defaultValue?.index ?? 0;
    }
    setPreference(pref);
  }, [preferences]);

  return {
    widget,
    preference,
    savePreference,
  };
}

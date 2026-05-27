import { IOdeServices } from '../services/OdeServices';
import { WidgetUserPref } from './interfaces';

export interface IWidgetPreferences {
  [widgetName: string]: WidgetUserPref;
}

export class WidgetService {
  constructor(private context: IOdeServices) {}

  private get session() {
    return this.context.session();
  }

  public async getSystemWidgets() {
    try {
      const user = await this.session.getUser();
      return user?.widgets;
    } catch (e) {
      console.error('[WidgetService] getSystemWidgets failed', e);
      throw e;
    }
  }

  public async getPreferences() {
    const prefs = await this.context
      .conf()
      .getPreference<IWidgetPreferences>('widgets');
    return prefs;
  }

  public async setPreferences(prefs: IWidgetPreferences) {
    await this.context.conf().savePreference('widgets', prefs);
  }
}

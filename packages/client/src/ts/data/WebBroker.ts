import {
  IDataTrackEvent,
  ISubscription,
  LAYER_NAME,
} from '../notify/interfaces';
import { IOdeServices } from '../services/OdeServices';
import { DataServiceProps, IEventBroker, SEND_ALL } from './interface';

export class WebBroker implements IEventBroker {
  private subscription?: ISubscription;

  constructor(private odeServices: IOdeServices) {}

  private get http() {
    return this.odeServices.http();
  }
  private get events() {
    return this.odeServices.notify().events<IDataTrackEvent>();
  }

  private dispatchEvent(
    message: IDataTrackEvent,
    filter: Array<string | typeof SEND_ALL>,
  ) {
    const isAllowed =
      filter.findIndex(
        (value) => SEND_ALL === value || message.data['event-type'] === value,
      ) >= 0;

    if (isAllowed) {
      // 2024-04-18 : every data is now sent to /infra/event/web/store
      this.http.post('/infra/event/web/store', message.data, {
        disableNotifications: true,
      });
    }
  }

  public initialize(props: DataServiceProps['web'] | undefined) {
    // Broke all events by default, or those authorized in props.
    if (
      props === undefined ||
      props.send === undefined ||
      props.send.length > 0
    ) {
      const filter = props?.send ?? [SEND_ALL];

      this.subscription = this.events.subscribe(
        LAYER_NAME.WEB_DATA,
        (message) => this.dispatchEvent(message, filter),
      );
    }
    return this;
  }

  public destroy(): void {
    if (this.subscription) {
      this.subscription.revoke();
      delete this.subscription;
    }
  }
}

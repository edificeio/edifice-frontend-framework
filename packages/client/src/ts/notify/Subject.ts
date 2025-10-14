import {
  ISubject,
  ISubjectMessage,
  ISubscription,
  LayerName,
} from './interfaces';
import { SimpleChannel } from './SimpleChannel';

type RevokationFunction = () => void;

class Subscription<T extends ISubjectMessage> implements ISubscription {
  public revoke: RevokationFunction;

  constructor(
    private _channel?: SimpleChannel<T>,
    handler?: (message: T) => void,
  ) {
    this.revoke = this.setReceiver((message: T) => handler?.(message));
  }

  private setReceiver(receiver: (message: T) => void): RevokationFunction {
    if (!this._channel) return () => {};
    const unsubscribe = this._channel.listen(receiver);
    return () => {
      unsubscribe();
      // do not close the shared channel on single unsubscribe (keeps it reusable)
      this._channel = undefined;
    };
  }
}

//-------------------------------------
// Event system
//-------------------------------------
export class Subject<T extends ISubjectMessage> implements ISubject<T> {
  /* We maintain channels for sending messages.
   * Receiving channels are instantiated per subscription.
   */
  private publishChannels: Map<string, SimpleChannel<T>> = new Map<
    string,
    SimpleChannel<T>
  >();

  private getChannelName(layer: string): string {
    return 'Subject:' + layer;
  }

  private getPublishChannel(layer: string): SimpleChannel<T> {
    const name = this.getChannelName(layer);
    let channel = this.publishChannels.get(name);
    if (!channel) {
      channel = this.newChannel(layer);
      this.publishChannels.set(name, channel);
    }
    return channel;
  }

  public newChannel(layer: string): SimpleChannel<any> {
    const name = this.getChannelName(layer);
    return SimpleChannel.getChannel(name);
  }

  publish(layer: LayerName, message: T): void {
    if (typeof layer === 'string') {
      this.getPublishChannel(layer).publish(message);
    }
  }

  subscribe<T extends ISubjectMessage>(
    layer: LayerName,
    handler: (message: T) => void,
  ): ISubscription {
    if (typeof layer === 'string') {
      const receiveChannel = this.newChannel(layer) as SimpleChannel<T>;
      return new Subscription(receiveChannel, handler);
    } else {
      return new Subscription();
    }
  }
}

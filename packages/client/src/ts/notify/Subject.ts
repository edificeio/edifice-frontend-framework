import {
  IHttpErrorEvent,
  ISubject,
  ISubjectMessage,
  ISubscription,
  LayerName,
} from "./interfaces";

type RevokationFunction = () => void;

class Subscription<T extends ISubjectMessage> implements ISubscription {
  public revoke: RevokationFunction;

  constructor(
    private _channel?: BroadcastChannel,
    handler?: (message: T) => void,
  ) {
    this.revoke = this.setReceiver(
      (message: MessageEvent<T>) => handler?.(message.data),
    );
  }

  private setReceiver(
    receiver: (message: MessageEvent<T>) => void,
  ): RevokationFunction {
    this._channel?.addEventListener("message", receiver);
    return () => {
      if (this._channel) {
        this._channel.removeEventListener("message", receiver);
        // Close channel, then delete it since it is unusable.
        this._channel.close();
        delete this._channel;
      }
    };
  }
}

//-------------------------------------
// Event system
//-------------------------------------
export class Subject implements ISubject {
  /* A single BroadcastChannel cannot send AND receive messages, afaik.
   * => We maintain here channels for *sending* messages.
   * *Receiving* channels will be instantiated while subscribing.
   */
  private publishChannels: Map<string, BroadcastChannel> = new Map<
    string,
    BroadcastChannel
  >();

  private getChannelName(layer: string): string {
    return "Subject:" + layer;
  }

  private getPublishChannel(layer: string): BroadcastChannel {
    const name = this.getChannelName(layer);
    let channel = this.publishChannels.get(name);
    if (!channel) {
      channel = this.newChannel(layer);
      this.publishChannels.set(name, channel);
    }
    return channel;
  }

  public newChannel(layer: string): BroadcastChannel {
    const name = this.getChannelName(layer);
    const channel = new BroadcastChannel(name);
    channel.addEventListener("messageerror", (ev) => console.log(ev.data));
    return channel;
  }

  publish(layer: LayerName, message: ISubjectMessage | IHttpErrorEvent): void {
    typeof layer === "string" &&
      this.getPublishChannel(layer).postMessage(message);
  }

  subscribe<T extends ISubjectMessage>(
    layer: LayerName,
    handler: (message: T) => void,
  ): ISubscription {
    if (typeof layer === "string") {
      // Create a *receiving* channel for every subscription.
      const receiveChannel = this.newChannel(layer);
      return new Subscription(receiveChannel, handler);
    } else {
      return new Subscription();
    }
  }
}

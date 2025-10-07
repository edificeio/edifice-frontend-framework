import { ISubscription } from './interfaces';

type MessageHandler<T> = (message: T) => void;

export class Observable<T> {
  private listeners: Array<MessageHandler<T>> = [];

  private revokeHandler(handler: MessageHandler<T>) {
    this.listeners = this.listeners.filter((fn) => fn !== handler);
  }

  public addEventListener(handler: MessageHandler<T>): ISubscription {
    this.listeners.push(handler);
    return {
      revoke: () => {
        this.revokeHandler(handler);
      },
    };
  }

  public postMessage(message: T) {
    this.listeners.forEach((fn) => fn(message));
  }

  public get subscriberCount() {
    return this.listeners.length;
  }
}

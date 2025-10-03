import {
  ISubject,
  ISubjectMessage,
  ISubscription,
  LayerName,
} from './interfaces';
import { Observable } from './Observable';

//-------------------------------------
// Event system
//-------------------------------------
export class Subject<T extends ISubjectMessage> implements ISubject<T> {
  private observables = new Map<string, Observable<T>>();

  private getSubjectName(layer: string): string {
    return 'Subject:' + layer;
  }

  private getObservable(layer: string): Observable<T> {
    const name = this.getSubjectName(layer);
    let observable = this.observables.get(name);
    if (!observable) {
      observable = new Observable();
      this.observables.set(name, observable);
    }
    return observable;
  }

  publish(layer: LayerName, message: T): void {
    typeof layer === 'string' && this.getObservable(layer).postMessage(message);
  }

  subscribe(layer: LayerName, handler: (message: T) => void): ISubscription {
    if (typeof layer === 'string') {
      const observable = this.getObservable(layer);
      return observable.addEventListener(handler);
    } else {
      return { revoke: () => {} } as ISubscription;
    }
  }

  public getSubscriberCountFor(layer: LayerName) {
    const observable = this.getObservable(layer);
    return observable.subscriberCount;
  }
}

import { EVENT_NAME, IHttpErrorEvent, LAYER_NAME } from './interfaces';
import { Subject } from './Subject';

describe('Subject', () => {
  const subject: Subject<IHttpErrorEvent> = new Subject();

  const mockedHttpError: IHttpErrorEvent = {
    name: EVENT_NAME.ERROR_OCCURED,
    data: { response: { status: 404, statusText: 'Not found' } },
  };

  it('should revoke subscriptions correctly', () => {
    const subscription = subject.subscribe(LAYER_NAME.TRANSPORT, () => {});
    expect(subject.getSubscriberCountFor(LAYER_NAME.TRANSPORT)).toStrictEqual(
      1,
    );
    subscription.revoke();
    expect(subject.getSubscriberCountFor(LAYER_NAME.TRANSPORT)).toStrictEqual(
      0,
    );
  });

  it('should observe HTTP error events correctly', () => {
    let observedHttpError: IHttpErrorEvent | undefined = undefined;

    const subscription = subject.subscribe(LAYER_NAME.TRANSPORT, (message) => {
      observedHttpError = message;
    });
    subject.publish(LAYER_NAME.TRANSPORT, mockedHttpError);

    expect(observedHttpError).toStrictEqual(mockedHttpError);

    subscription.revoke();
  });
});

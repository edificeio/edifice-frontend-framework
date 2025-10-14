/**
 * Simple in-memory channel implementation.
 * This is intentionally synchronous (listeners are invoked in insertion order).
 */
export class SimpleChannel<T = any> {
  private static channels = new Map<string, SimpleChannel<any>>();

  /**
   * Get a channel by name (create it if it doesn't exist).
   * @param name of the channel
   * @returns the channel instance
   */
  public static getChannel<T = any>(name: string): SimpleChannel<T> {
    let c = SimpleChannel.channels.get(name) as SimpleChannel<T> | undefined;
    if (!c) {
      c = new SimpleChannel<T>(name);
      SimpleChannel.channels.set(name, c);
    }
    return c;
  }

  private readonly name: string;
  private listeners = new Set<(msg: T) => void>();

  private constructor(name: string) {
    this.name = name;
  }

  /**
   * Add a listener and return a revocation function to remove it.
   */
  listen(handler: (msg: T) => void): () => void {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }

  /**
   * Publish a message to all listeners.
   */
  publish(message: T): void {
    for (const h of Array.from(this.listeners)) {
      try {
        h(message);
      } catch (e) {
        console.error('[SimpleChannel] publish failed', e);
      }
    }
  }

  /**
   * Close this channel: remove listeners and unregister from global map.
   */
  close(): void {
    this.listeners.clear();
    SimpleChannel.channels.delete(this.name);
  }
}

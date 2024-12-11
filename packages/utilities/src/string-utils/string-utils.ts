export class StringUtils {
  static isLocalURL(str: string): boolean {
    return str.length > 0 && str.charAt(0) === '/';
  }
  static startWithHttp(str: string): boolean {
    const startWithHttpExpression = /^https?:\/\//gi;
    return startWithHttpExpression.test(str);
  }
  static toCounter(counter: number): string {
    return counter > 999
      ? `${Number(counter / 1000).toFixed(1)} k`
      : '' + counter;
  }
  static generateVirtualId(): string {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, () => {
      const r = Math.floor(Math.random() * 16);
      return r.toString(16);
    });
  }
}

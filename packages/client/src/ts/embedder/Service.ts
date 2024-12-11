import { IOdeServices } from '../services/OdeServices';
import { Embedder } from './interface';

export class EmbedderService {
  constructor(private context: IOdeServices) {}

  private get http() {
    return this.context.http();
  }

  /**
   * Returns the default list of video embedder
   * @returns the default list of video embedder
   */
  public async getDefault(): Promise<Embedder[]> {
    return this.http.get<Embedder[]>('/infra/embed/default');
  }

  /**
   * Returns the custom list of video embedder
   * @returns the custom list of video embedder
   */
  public async getCustom(): Promise<Embedder[]> {
    return this.http.get<Embedder[]>('/infra/embed/custom');
  }

  /**
   * The provider matching with the URL
   * @param {Embedder[]} embedderList - The list of video providers to test with
   * @param {String} url - The URL for the video
   * @returns The provider matching with the URL or undefined
   */
  public getProviderFromUrl(
    embedderList: Embedder[],
    url: string,
  ): Embedder | undefined {
    for (const embedder of embedderList) {
      if (this.isUrlFromProvider(url, embedder)) {
        return embedder;
      }
    }
    return;
  }

  private urlIsFromPattern(url: string, pattern: string): boolean {
    const splitURLRegex = new RegExp('[^{}]+(?=(?:[^{}]*{[^}]*})*[^}]*$)', 'g');
    const splitVariableRegex = new RegExp('{[^}]*}', 'g');
    let isFromPattern = true;
    const urlParts = pattern.match(splitURLRegex) || [];
    const urlPartsFiltered: string[] = [];
    const variableParts = pattern.match(splitVariableRegex) || [];

    // Filter urlParts we want to check with the URL given
    variableParts.forEach((variablePart, index) => {
      if (variablePart.includes('ignore')) {
        // If the variable is an ignore, we don't need to check the rest of the URL
        return;
      }
      urlPartsFiltered.push(urlParts[index]);
    });

    urlPartsFiltered.forEach((urlPart) => {
      if (!url.includes(urlPart)) {
        isFromPattern = false;
        return;
      }
    });

    return isFromPattern;
  }

  /**
   * Check if a given URL correspond to one of the URL pattern of the provider
   * @param {String} url - The URL for the video
   * @param {Embedder} embedder - The video provider to test with
   * @returns boolean depending if a given URL correspond to one of the URL pattern of the provider
   */
  private isUrlFromProvider(url: string, embedder: Embedder): boolean {
    // Regex to remove the variable from the URL pattern (remove everything inside {...})
    if (typeof embedder.url === 'string') {
      embedder.url = [embedder.url];
    }

    for (const pattern of embedder.url) {
      if (this.urlIsFromPattern(url, pattern)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get embed code to display the video for an URL and a provider
   * @param {Embedder} embedder - The video provider for the URL
   * @param {String} url - The URL for the video
   * @returns embed code to display the video for an URL and a provider
   */
  public getEmbedCodeForProvider(embedder: Embedder, url: string): string {
    for (const pattern of embedder.url) {
      if (this.urlIsFromPattern(url, pattern)) {
        const matchParams = new RegExp('{[a-zA-Z0-9_.]+}', 'g');
        const params = pattern.match(matchParams) || [];
        let computedEmbed = embedder.embed;

        for (const param of params) {
          let paramBefore = pattern.split(param)[0];
          const additionnalSplit = paramBefore.split('}');
          if (additionnalSplit.length > 1) {
            paramBefore = additionnalSplit[additionnalSplit.length - 1];
          }
          let paramValue = url.split(paramBefore)[1];
          if (!paramValue) {
            continue;
          }
          const paramAfter = pattern.split(param)[1].split('{')[0];
          if (paramAfter) {
            paramValue = paramValue.split(paramAfter)[0];
          }

          const replace = new RegExp('\\' + param.replace(/}/, '\\}'), 'g');
          computedEmbed = computedEmbed.replace(replace, paramValue);
        }
        return computedEmbed;
      }
    }
    return '';
  }
}

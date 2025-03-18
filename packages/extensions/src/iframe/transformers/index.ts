import { IframeTransformer } from './interface';
import { PadIframeTransformer } from './pad-transformer';
/**
 * Default iframe transformer
 * This transformer is used to call all the transformers
 */
class DefaultIframeTransformer implements IframeTransformer {
  #transformers = [new PadIframeTransformer()];
  onRenderHTML({ HTMLAttributes }) {
    for (const transformer of this.#transformers) {
      transformer.onRenderHTML({ HTMLAttributes });
    }
  }
}

export const iframeTransformer: IframeTransformer =
  new DefaultIframeTransformer();

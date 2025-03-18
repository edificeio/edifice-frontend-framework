/**
 * Interface for the iframe transformer.
 * Iframe transformers are used to transform the iframe attributes before rendering it.
 */
export interface IframeTransformer {
  onRenderHTML({ HTMLAttributes }): void;
}

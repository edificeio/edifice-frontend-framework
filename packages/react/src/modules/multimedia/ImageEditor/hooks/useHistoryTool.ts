import { useEffect, useState } from 'react';

import * as PIXI from 'pixi.js';

import { ImageSettings, toBlob } from '../effects/misc';

// Define how much backup are stored in history
const DEFAULT_MAX_HISTORY = 20;

/**
 * Defined the structure of the backup in history
 */
export interface HistoryState extends ImageSettings {
  backup: Promise<Blob>;
}

export interface UseHistoryToolsProps {
  maxSize?: number;
  application?: PIXI.Application;
  spriteName: string;
  onRestore: (img: Blob, state: HistoryState) => void;
}
/**
 * This hook expose all the functions needed for historizing actions:
 * - historize: Create a backup
 * - restore: Restore a backup
 * - historyCount: How much states stored in history
 *
 * @param param.maxSize the maximum size of the history
 * @param param.application the PIXI.Application context
 * @param param.spriteName the sprite name of the edited image
 * @param param.onRestore a callback called when a backup is restored
 * @returns all functions needed for managing history
 */
const useHistoryTool = ({
  maxSize = DEFAULT_MAX_HISTORY,
  application,
  spriteName,
  onRestore,
}: UseHistoryToolsProps) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  useEffect(() => {
    setHistory([]);
  }, [application]);
  const restore = async () => {
    const imgData = history.pop();
    if (imgData) {
      onRestore(await imgData.backup, imgData);
      setHistory(history.filter((current) => current !== imgData));
    }
  };
  const listSize = (arr: HistoryState[]) => {
    if (arr.length > maxSize) {
      arr.splice(0, arr.length - maxSize);
    }
    return arr;
  };
  const historize = async <T extends (...args: any[]) => any>(callback: T) => {
    {
      if (!application) {
        return;
      }
      const sprite = application.stage.getChildByName(spriteName, true) as
        | PIXI.Sprite
        | null
        | undefined;
      if (sprite === undefined || sprite === null) {
        return;
      }
      const promise = toBlob(application);
      const state: HistoryState = {
        backup: promise,
        sprite: {
          rotation: sprite.rotation,
          size: { width: sprite.width, height: sprite.height },
          position: { x: sprite.position.x, y: sprite.position.y },
          scale: { x: sprite.scale.x, y: sprite.scale.y },
          anchor: { x: sprite.anchor.x, y: sprite.anchor.y },
        },
        stage: {
          size: {
            width: application.stage.width,
            height: application.stage.height,
          },
          scale: { x: application.stage.scale.x, y: application.stage.scale.y },
        },
      };
      setHistory([...listSize(history), state]);
      await promise;
      return callback.call(callback);
    }
  };

  return {
    historyCount: history.length,
    restore,
    historize,
  };
};

export default useHistoryTool;

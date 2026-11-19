import { useState } from 'react';

import { WorkspaceElement } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import iconExcel from '@edifice.io/bootstrap/dist/images/homepage/tools/excel.svg';
import iconPowerpoint from '@edifice.io/bootstrap/dist/images/homepage/tools/powerpoint.svg';
import iconStudioAudio from '@edifice.io/bootstrap/dist/images/homepage/tools/studio-audio.svg';
import iconStudioVideo from '@edifice.io/bootstrap/dist/images/homepage/tools/studio-video.svg';
import iconWord from '@edifice.io/bootstrap/dist/images/homepage/tools/word.svg';
import {
  Flex,
  Skeleton,
  Tooltip,
  VisuallyHidden,
} from '../../../../components';
import { CaptationAudio } from '../Captation/CaptationAudio/CaptationAudio';
import { CaptationVideo } from '../Captation/CaptationVideo/CaptationVideo';
import HomeCard from '../HomeCard/HomeCard';

export type OfficeToolType = 'word' | 'powerpoint' | 'excel';
export type CaptationToolType = 'video' | 'audio';
export type ToolType = OfficeToolType | CaptationToolType;

const TOOL_ICONS: Record<ToolType, string> = {
  word: iconWord,
  powerpoint: iconPowerpoint,
  excel: iconExcel,
  video: iconStudioVideo,
  audio: iconStudioAudio,
};

export const DEFAULT_TOOLS: ToolType[] = [
  'word',
  'powerpoint',
  'excel',
  'video',
  'audio',
];

const isCaptationTool = (tool: ToolType): tool is CaptationToolType =>
  tool === 'video' || tool === 'audio';

export interface ToolsProps {
  /** Tools to display, in order. Defaults to every available tool. */
  tools?: ToolType[];
  /**
   * Callback invoked when an office tool (word, powerpoint, excel) is clicked.
   * Captation tools (video, audio) open their own recording modal instead.
   */
  onOfficeToolClick?: (tool: OfficeToolType) => void;
  /** Callback invoked once a video or audio record has been saved. */
  onCaptationSaveSuccess?: (
    tool: CaptationToolType,
    resource: WorkspaceElement,
  ) => void;
  isLoading?: boolean;
}

export function Tools({
  tools = DEFAULT_TOOLS,
  onOfficeToolClick,
  onCaptationSaveSuccess,
  isLoading = false,
}: ToolsProps) {
  const { t } = useTranslation();
  const [openedCaptation, setOpenedCaptation] =
    useState<CaptationToolType | null>(null);

  const handleToolClick = (tool: ToolType) => {
    if (isCaptationTool(tool)) {
      setOpenedCaptation(tool);
    } else {
      onOfficeToolClick?.(tool);
    }
  };

  const handleCaptationClose = () => setOpenedCaptation(null);

  if (tools.length === 0) return null;

  if (isLoading) {
    return (
      <HomeCard variant="secondary" role="status" aria-busy="true">
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="home-card-header tools__header-skeleton">
          <div className="home-card-header-title">
            <Skeleton className="tools__title-skeleton" />
          </div>
        </div>
        <HomeCard.Content>
          <div className="tools-content">
            <div className="tools__items-skeleton">
              {/* Each tool sits in the Tooltip's wrapper, whose line box adds
                  room under the icon: an inline block in a plain div takes the
                  same height. */}
              {tools.map((tool) => (
                <div key={tool}>
                  <Skeleton variant="circle" className="tools__item-skeleton" />
                </div>
              ))}
            </div>
          </div>
        </HomeCard.Content>
      </HomeCard>
    );
  }

  return (
    <>
      <HomeCard variant="secondary">
        <HomeCard.Header title={t('homepage.tools.title')} />
        <HomeCard.Content>
          <div className="tools-content">
            <Flex wrap="wrap" gap="12">
              {tools.map((tool) => {
                const label = t(`homepage.tools.${tool}`);
                return (
                  <Tooltip
                    key={tool}
                    message={t(`homepage.tools.tooltip.${tool}`)}
                    placement="top"
                  >
                    <button
                      type="button"
                      className="tools-item"
                      aria-label={label}
                      onClick={() => handleToolClick(tool)}
                      data-testid={`homepage-tools-${tool}-button`}
                    >
                      <img
                        src={TOOL_ICONS[tool]}
                        alt=""
                        width={40}
                        height={40}
                      />
                    </button>
                  </Tooltip>
                );
              })}
            </Flex>
          </div>
        </HomeCard.Content>
      </HomeCard>
      {openedCaptation === 'video' && (
        <CaptationVideo
          isOpen
          onClose={handleCaptationClose}
          onSaveSuccess={(resource) =>
            onCaptationSaveSuccess?.('video', resource)
          }
        />
      )}
      {openedCaptation === 'audio' && (
        <CaptationAudio
          isOpen
          onClose={handleCaptationClose}
          onSaveSuccess={(resource) =>
            onCaptationSaveSuccess?.('audio', resource)
          }
        />
      )}
    </>
  );
}

import { useState } from 'react';

import { useHasWorkflow } from 'src/hooks';
import { CreateDocumentModal } from './CreateDocumentModal';
import {
  CaptationToolType,
  DEFAULT_TOOLS,
  OfficeToolType,
  Tools,
  ToolsProps,
  ToolType,
} from './Tools';
import { buildLoolCreateUrl } from './utils';

export const LOOL_CREATE_DOCUMENT_WORKFLOW =
  'fr.openent.lool.controller.LoolController|createDocumentFromTemplate';

export const VIDEO_CAPTURE_WORKFLOW =
  'com.opendigitaleducation.video.controllers.VideoController|capture';

export const WORKSPACE_ADD_DOCUMENT_WORKFLOW =
  'org.entcore.workspace.controllers.WorkspaceController|addDocument';

const TOOL_WORKFLOWS = [
  LOOL_CREATE_DOCUMENT_WORKFLOW,
  VIDEO_CAPTURE_WORKFLOW,
  WORKSPACE_ADD_DOCUMENT_WORKFLOW,
];

const CAPTATION_TOOL_WORKFLOWS: Record<CaptationToolType, string> = {
  video: VIDEO_CAPTURE_WORKFLOW,
  audio: WORKSPACE_ADD_DOCUMENT_WORKFLOW,
};

const isOfficeTool = (tool: ToolType): tool is OfficeToolType =>
  tool === 'word' || tool === 'powerpoint' || tool === 'excel';

export interface ToolsContainerProps {
  /**
   * Tools to display, in order. Each tool is hidden without its right:
   * LOOL document creation for office tools, video capture for video,
   * workspace add document for audio.
   */
  tools?: ToolType[];
  /** Callback invoked once a video or audio record has been saved. */
  onCaptationSaveSuccess?: ToolsProps['onCaptationSaveSuccess'];
}

export function ToolsContainer({
  tools = DEFAULT_TOOLS,
  onCaptationSaveSuccess,
}: ToolsContainerProps) {
  const rights = useHasWorkflow(TOOL_WORKFLOWS) as
    | Record<string, boolean>
    | undefined;
  const [modalType, setModalType] = useState<OfficeToolType | null>(null);

  const visibleTools = tools.filter(
    (tool) =>
      !!rights?.[
        isOfficeTool(tool)
          ? LOOL_CREATE_DOCUMENT_WORKFLOW
          : CAPTATION_TOOL_WORKFLOWS[tool]
      ],
  );

  if (visibleTools.length === 0) return null;

  const handleCreate = (type: OfficeToolType, name: string) => {
    window.open(buildLoolCreateUrl(type, name), '_blank');
    setModalType(null);
  };

  return (
    <>
      <Tools
        tools={visibleTools}
        onOfficeToolClick={setModalType}
        onCaptationSaveSuccess={onCaptationSaveSuccess}
      />
      {modalType && (
        <CreateDocumentModal
          defaultType={modalType}
          onClose={() => setModalType(null)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}

ToolsContainer.displayName = 'ToolsContainer';

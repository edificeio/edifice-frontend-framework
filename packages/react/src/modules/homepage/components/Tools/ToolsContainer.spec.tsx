import { fireEvent, render, screen } from '~/setup';
import { useHasWorkflow } from 'src/hooks';
import {
  LOOL_CREATE_DOCUMENT_WORKFLOW,
  ToolsContainer,
  VIDEO_CAPTURE_WORKFLOW,
  WORKSPACE_ADD_DOCUMENT_WORKFLOW,
} from './ToolsContainer';
import { buildLoolCreateUrl } from './utils';

vi.mock('src/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('src/hooks')>()),
  useHasWorkflow: vi.fn(),
}));

const mockRights = ({ office = true, video = true, audio = true }) =>
  vi.mocked(useHasWorkflow).mockReturnValue({
    [LOOL_CREATE_DOCUMENT_WORKFLOW]: office,
    [VIDEO_CAPTURE_WORKFLOW]: video,
    [WORKSPACE_ADD_DOCUMENT_WORKFLOW]: audio,
  });

describe('buildLoolCreateUrl', () => {
  it('builds the LOOL creation URL with the file extension', () => {
    expect(buildLoolCreateUrl('excel', ' My sheet ')).toBe(
      '/lool/document?type=xlsx&name=My+sheet&protected=false',
    );
  });

  it('removes characters forbidden in document names', () => {
    expect(buildLoolCreateUrl('word', 'a/b\\c<d>e|f')).toBe(
      '/lool/document?type=docx&name=abcdef&protected=false',
    );
  });
});

describe('ToolsContainer', () => {
  const testIds = () =>
    screen
      .queryAllByRole('button')
      .map((button) => button.getAttribute('data-testid'));

  it('shows every tool with all rights', () => {
    mockRights({});
    render(<ToolsContainer />);

    expect(testIds()).toHaveLength(5);
  });

  it('hides office tools without the LOOL creation right', () => {
    mockRights({ office: false });
    render(<ToolsContainer />);

    expect(testIds()).toEqual([
      'homepage-tools-video-button',
      'homepage-tools-audio-button',
    ]);
  });

  it('hides each captation tool without its right', () => {
    mockRights({ office: false, video: false });
    render(<ToolsContainer />);

    expect(testIds()).toEqual(['homepage-tools-audio-button']);
  });

  it('renders nothing while the rights are loading', () => {
    vi.mocked(useHasWorkflow).mockReturnValue(undefined);
    render(<ToolsContainer />);

    expect(testIds()).toEqual([]);
  });

  it('renders nothing without any right', () => {
    mockRights({ office: false, video: false, audio: false });
    render(<ToolsContainer />);

    expect(testIds()).toEqual([]);
  });

  it('opens the creation modal then the document in a new tab', () => {
    mockRights({});
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<ToolsContainer />);

    fireEvent.click(screen.getByTestId('homepage-tools-powerpoint-button'));
    const createButton = screen.getByTestId(
      'homepage-tools-create-document-create-button',
    );
    expect(createButton).toBeDisabled();

    fireEvent.change(
      screen.getByTestId('homepage-tools-create-document-name-input'),
      { target: { value: 'Slides' } },
    );
    fireEvent.click(createButton);

    expect(openSpy).toHaveBeenCalledWith(
      buildLoolCreateUrl('powerpoint', 'Slides'),
      '_blank',
    );
    expect(
      screen.queryByTestId('homepage-tools-create-document-create-button'),
    ).toBeNull();
    openSpy.mockRestore();
  });
});

import { fireEvent, render, screen } from '~/setup';
import { Tools } from './Tools';

// Captation modals need real media devices: replace them by simple stubs.
vi.mock('../Captation/CaptationAudio/CaptationAudio', () => ({
  CaptationAudio: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="captation-audio-stub">
      <button type="button" onClick={onClose}>
        close
      </button>
    </div>
  ),
}));
vi.mock('../Captation/CaptationVideo/CaptationVideo', () => ({
  CaptationVideo: () => <div data-testid="captation-video-stub" />,
}));

describe('Tools', () => {
  it('renders a button for every tool by default', () => {
    render(<Tools />);

    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('only renders the given tools, in order', () => {
    render(<Tools tools={['excel', 'audio']} />);

    const testIds = screen
      .getAllByRole('button')
      .map((button) => button.getAttribute('data-testid'));
    expect(testIds).toEqual([
      'homepage-tools-excel-button',
      'homepage-tools-audio-button',
    ]);
  });

  it('renders nothing without any tool', () => {
    const { container } = render(<Tools tools={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows a dedicated tooltip on hover', () => {
    render(<Tools tools={['word']} />);

    const button = screen.getByTestId('homepage-tools-word-button');
    expect(document.querySelector('.tooltip')).toBeNull();

    fireEvent.mouseEnter(button.parentElement!);
    expect(document.querySelector('.tooltip')).toHaveTextContent(
      'Créer un fichier texte (Word)',
    );

    fireEvent.mouseLeave(button.parentElement!);
    expect(document.querySelector('.tooltip')).toBeNull();
  });

  it('calls onOfficeToolClick with the clicked office tool', () => {
    const onOfficeToolClick = vi.fn();
    render(<Tools onOfficeToolClick={onOfficeToolClick} />);

    fireEvent.click(screen.getByTestId('homepage-tools-powerpoint-button'));

    expect(onOfficeToolClick).toHaveBeenCalledWith('powerpoint');
  });

  it('opens the video captation modal on video click', () => {
    const onOfficeToolClick = vi.fn();
    render(<Tools onOfficeToolClick={onOfficeToolClick} />);

    expect(screen.queryByTestId('captation-video-stub')).toBeNull();
    fireEvent.click(screen.getByTestId('homepage-tools-video-button'));

    expect(screen.getByTestId('captation-video-stub')).toBeInTheDocument();
    expect(onOfficeToolClick).not.toHaveBeenCalled();
  });

  it('opens then closes the audio captation modal', () => {
    render(<Tools />);

    fireEvent.click(screen.getByTestId('homepage-tools-audio-button'));
    expect(screen.getByTestId('captation-audio-stub')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByTestId('captation-audio-stub')).toBeNull();
  });
});

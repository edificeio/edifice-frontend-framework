import { render, screen } from '~/setup';

import {
  VideoRecorderToolbar,
  VideoRecorderToolbarProps,
} from './VideoRecorderToolbar';

const handlers = () => ({
  handleRecord: vi.fn(),
  handleStop: vi.fn(),
  handlePlayPause: vi.fn(),
  handleReset: vi.fn(),
  handleSave: vi.fn(),
});

function setup(state: Partial<VideoRecorderToolbarProps> = {}) {
  const spies = handlers();
  const view = render(
    <VideoRecorderToolbar
      playing={false}
      recording={false}
      recorded={false}
      saving={false}
      saved={false}
      hideSaveAction={false}
      {...spies}
      {...state}
    />,
  );
  return { ...view, ...spies };
}

// Icon items keep the aria-label given by the caller — unlike button items,
// whose label <Toolbar> overwrites with the item name.
const recordButton = () =>
  screen.getByRole('button', { name: 'Start recording' });
const stopButton = () => screen.getByRole('button', { name: 'Stop recording' });
const playButton = () => screen.getByRole('button', { name: 'Play' });
const pauseButton = () =>
  screen.getByRole('button', { name: 'bbm.video.play.pause' });
const resetButton = () => screen.getByRole('button', { name: 'Reset' });
const saveButton = () => screen.queryByRole('button', { name: 'Save' });

describe('VideoRecorderToolbar', () => {
  beforeAll(() => {
    // <Toolbar> calls useBreakpoint, which needs window.matchMedia.
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  describe('idle', () => {
    it('only offers to start recording', () => {
      setup();

      expect(recordButton()).toBeEnabled();
      expect(stopButton()).toBeDisabled();
      expect(playButton()).toBeDisabled();
      expect(resetButton()).toBeDisabled();
      expect(saveButton()).toBeDisabled();
    });

    it('starts the recording', async () => {
      const { user, handleRecord } = setup();

      await user.click(recordButton());

      expect(handleRecord).toHaveBeenCalledTimes(1);
    });
  });

  describe('recording', () => {
    it('swaps the record button for the stop button', () => {
      setup({ recording: true });

      expect(recordButton()).toBeDisabled();
      expect(stopButton()).toBeEnabled();
    });

    it('stops the recording', async () => {
      const { user, handleStop } = setup({ recording: true });

      await user.click(stopButton());

      expect(handleStop).toHaveBeenCalledTimes(1);
    });

    it('offers neither playback nor reset yet', () => {
      setup({ recording: true });

      expect(playButton()).toBeDisabled();
      expect(resetButton()).toBeDisabled();
    });
  });

  describe('recorded', () => {
    it('opens playback, reset and save', () => {
      setup({ recorded: true });

      expect(playButton()).toBeEnabled();
      expect(resetButton()).toBeEnabled();
      expect(saveButton()).toBeEnabled();
    });

    it('closes recording and stopping', () => {
      setup({ recorded: true });

      expect(recordButton()).toBeDisabled();
      expect(stopButton()).toBeDisabled();
    });

    it('plays the recording', async () => {
      const { user, handlePlayPause } = setup({ recorded: true });

      await user.click(playButton());

      expect(handlePlayPause).toHaveBeenCalledTimes(1);
    });

    it('discards the recording', async () => {
      const { user, handleReset } = setup({ recorded: true });

      await user.click(resetButton());

      expect(handleReset).toHaveBeenCalledTimes(1);
    });

    it('uploads the recording', async () => {
      const { user, handleSave } = setup({ recorded: true });

      await user.click(saveButton()!);

      expect(handleSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('playing', () => {
    it('shows a pause button instead of the play button', () => {
      setup({ recorded: true, playing: true });

      expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
      expect(pauseButton()).toBeEnabled();
    });

    it('pauses through the same handler', async () => {
      const { user, handlePlayPause } = setup({
        recorded: true,
        playing: true,
      });

      await user.click(pauseButton());

      expect(handlePlayPause).toHaveBeenCalledTimes(1);
    });
  });

  describe('saving', () => {
    it('freezes every action while the upload runs', () => {
      setup({ recorded: true, saving: true });

      expect(recordButton()).toBeDisabled();
      expect(stopButton()).toBeDisabled();
      expect(playButton()).toBeDisabled();
      expect(resetButton()).toBeDisabled();
      expect(saveButton()).toBeDisabled();
    });

    it('keeps the reset available once saved, but not the save', () => {
      setup({ recorded: true, saved: true });

      expect(saveButton()).toBeDisabled();
      expect(resetButton()).toBeEnabled();
    });
  });

  it('hides the save action when the parent handles it', () => {
    setup({ recorded: true, hideSaveAction: true });

    expect(saveButton()).toBeNull();
  });
});

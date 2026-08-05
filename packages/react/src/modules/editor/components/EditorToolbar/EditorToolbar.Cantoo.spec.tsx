import { render, screen, within } from '~/setup';
import { Dropdown } from '../../../../components';
import { CantooEditor } from '../../hooks';
import { EditorToolbarCantoo } from './EditorToolbar.Cantoo';

// The i18n test setup (apps/docs/i18n.ts) has no `tiptap.toolbar.cantoo.*`
// keys, so `t()` falls back to returning the key itself. These constants
// match that fallback and double as query strings for labels/names.
const TRIGGER_LABEL = 'tiptap.toolbar.cantoo.choice';
const FORMAT_TEXT_LABEL = 'tiptap.toolbar.cantoo.formatText';
const FORMAT_TEXT_RIGHT_LABEL =
  'tiptap.toolbar.cantoo.formatText.show.on.right';
const FORMAT_TEXT_BOTTOM_LABEL =
  'tiptap.toolbar.cantoo.formatText.show.on.bottom';
const SPEECH2TEXT_LABEL = 'tiptap.toolbar.cantoo.speech2text';
const TEXT2SPEECH_LABEL = 'tiptap.toolbar.cantoo.text2speech';
const SETTINGS_LABEL = 'tiptap.toolbar.cantoo.settings';

// Builds a plain `CantooEditor` object matching the interface exposed by
// `useCantooEditor`, with every action mocked, so the component under test
// can be exercised without any real tiptap editor or Cantoo global.
function buildCantooEditor(
  overrides: Partial<CantooEditor> = {},
): CantooEditor {
  return {
    cantooParam: 'default',
    isAvailable: true,
    speech2textIsAvailable: false,
    speech2textIsActive: false,
    text2speechIsActive: false,
    toggleSpeech2Text: vi.fn(),
    toggleText2Speech: vi.fn(),
    toogleSettings: vi.fn(),
    openPositionAdaptText: { right: false, bottom: false },
    handleCantooAdaptTextPosition: vi.fn(),
    ...overrides,
  };
}

// Renders the component inside a real `Dropdown`, passing along the real
// `triggerProps` the Dropdown computes so that clicking the rendered
// IconButton actually opens/closes the menu, exactly as it does in
// production (same pattern as EditorToolbar.DropdownMenu.spec.tsx).
function renderCantoo(cantooEditor: CantooEditor) {
  return render(
    <Dropdown>
      {(triggerProps: any) => (
        <EditorToolbarCantoo
          triggerProps={triggerProps}
          cantooEditor={cantooEditor}
        />
      )}
    </Dropdown>,
  );
}

function getTrigger() {
  return screen.getByRole('button', { name: TRIGGER_LABEL });
}

describe('EditorToolbarCantoo', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('trigger "is-selected" class', () => {
    it('has no is-selected class when nothing is active', () => {
      renderCantoo(buildCantooEditor());

      expect(getTrigger()).not.toHaveClass('is-selected');
    });

    it('adds is-selected when speech2textIsActive is true', () => {
      renderCantoo(buildCantooEditor({ speech2textIsActive: true }));

      expect(getTrigger()).toHaveClass('is-selected');
    });

    it('adds is-selected when openPositionAdaptText.right is true', () => {
      renderCantoo(
        buildCantooEditor({
          openPositionAdaptText: { right: true, bottom: false },
        }),
      );

      expect(getTrigger()).toHaveClass('is-selected');
    });

    it('adds is-selected when text2speechIsActive and openPositionAdaptText.bottom are both true', () => {
      renderCantoo(
        buildCantooEditor({
          text2speechIsActive: true,
          openPositionAdaptText: { right: false, bottom: true },
        }),
      );

      expect(getTrigger()).toHaveClass('is-selected');
    });
  });

  describe('trigger isLoading state', () => {
    it('shows the loading state when window.Cantoo is not available', () => {
      renderCantoo(buildCantooEditor());

      expect(within(getTrigger()).getByRole('status')).toBeInTheDocument();
    });

    it('does not show the loading state when window.Cantoo is available', () => {
      vi.stubGlobal('Cantoo', {});
      renderCantoo(buildCantooEditor());

      expect(
        within(getTrigger()).queryByRole('status'),
      ).not.toBeInTheDocument();
    });
  });

  describe('format text position group (cantooParam !== "simplify")', () => {
    it('shows the group with right/bottom options and a separator', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({ cantooParam: 'default' }),
      );
      await user.click(getTrigger());

      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByText(FORMAT_TEXT_LABEL)).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_RIGHT_LABEL }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_BOTTOM_LABEL }),
      ).toBeInTheDocument();
      // `Dropdown.Separator` wraps a semantic `<hr>` in a `role="separator"`
      // div, so a single separator entry yields two matching elements.
      expect(screen.getAllByRole('separator')).toHaveLength(2);
    });

    it('calls handleCantooAdaptTextPosition("right") when clicking the right option', async () => {
      const cantooEditor = buildCantooEditor({ cantooParam: 'default' });
      const { user } = renderCantoo(cantooEditor);
      await user.click(getTrigger());

      await user.click(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_RIGHT_LABEL }),
      );

      expect(cantooEditor.handleCantooAdaptTextPosition).toHaveBeenCalledWith(
        'right',
      );
    });

    it('calls handleCantooAdaptTextPosition("bottom") when clicking the bottom option', async () => {
      const cantooEditor = buildCantooEditor({ cantooParam: 'default' });
      const { user } = renderCantoo(cantooEditor);
      await user.click(getTrigger());

      await user.click(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_BOTTOM_LABEL }),
      );

      expect(cantooEditor.handleCantooAdaptTextPosition).toHaveBeenCalledWith(
        'bottom',
      );
    });

    it('marks only the right option bold when openPositionAdaptText.right is true', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({
          cantooParam: 'default',
          openPositionAdaptText: { right: true, bottom: false },
        }),
      );
      await user.click(getTrigger());

      expect(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_RIGHT_LABEL }),
      ).toHaveClass('fw-bold');
      expect(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_BOTTOM_LABEL }),
      ).not.toHaveClass('fw-bold');
    });

    it('marks only the bottom option bold when openPositionAdaptText.bottom is true', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({
          cantooParam: 'default',
          openPositionAdaptText: { right: false, bottom: true },
        }),
      );
      await user.click(getTrigger());

      expect(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_BOTTOM_LABEL }),
      ).toHaveClass('fw-bold');
      expect(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_RIGHT_LABEL }),
      ).not.toHaveClass('fw-bold');
    });
  });

  describe('cantooParam === "simplify"', () => {
    it('hides the format text group and separator, and shows a formatText option instead', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({ cantooParam: 'simplify' }),
      );
      await user.click(getTrigger());

      expect(screen.queryByRole('group')).not.toBeInTheDocument();
      expect(screen.queryByRole('separator')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('menuitem', { name: FORMAT_TEXT_RIGHT_LABEL }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_LABEL }),
      ).toBeInTheDocument();
    });

    it('calls handleCantooAdaptTextPosition("bottom") when clicking the formatText option', async () => {
      const cantooEditor = buildCantooEditor({ cantooParam: 'simplify' });
      const { user } = renderCantoo(cantooEditor);
      await user.click(getTrigger());

      await user.click(
        screen.getByRole('menuitem', { name: FORMAT_TEXT_LABEL }),
      );

      expect(cantooEditor.handleCantooAdaptTextPosition).toHaveBeenCalledWith(
        'bottom',
      );
    });

    it('marks the formatText option bold only when openPositionAdaptText.bottom is true', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({
          cantooParam: 'simplify',
          openPositionAdaptText: { right: false, bottom: true },
        }),
      );
      await user.click(getTrigger());

      // The className for `cantooOptions` entries lives on the inner
      // `<span>` wrapping the label, not on the `Dropdown.Item` itself.
      expect(screen.getByText(FORMAT_TEXT_LABEL)).toHaveClass('fw-bold');
    });

    it('places the formatText option first in the options list', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({
          cantooParam: 'simplify',
          speech2textIsAvailable: true,
        }),
      );
      await user.click(getTrigger());

      const items = screen.getAllByRole('menuitem');
      expect(items[0]).toHaveAccessibleName(FORMAT_TEXT_LABEL);
    });

    it('does not show the settings option', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({ cantooParam: 'simplify' }),
      );
      await user.click(getTrigger());

      expect(
        screen.queryByRole('menuitem', { name: SETTINGS_LABEL }),
      ).not.toBeInTheDocument();
    });
  });

  describe('speech2text option', () => {
    it('is absent when speech2textIsAvailable is false', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({ speech2textIsAvailable: false }),
      );
      await user.click(getTrigger());

      expect(
        screen.queryByRole('menuitem', { name: SPEECH2TEXT_LABEL }),
      ).not.toBeInTheDocument();
    });

    it('appears and calls toggleSpeech2Text when clicked, not bold when inactive', async () => {
      const cantooEditor = buildCantooEditor({
        speech2textIsAvailable: true,
        speech2textIsActive: false,
      });
      const { user } = renderCantoo(cantooEditor);
      await user.click(getTrigger());

      const item = screen.getByRole('menuitem', { name: SPEECH2TEXT_LABEL });
      expect(screen.getByText(SPEECH2TEXT_LABEL)).not.toHaveClass('fw-bold');

      await user.click(item);

      expect(cantooEditor.toggleSpeech2Text).toHaveBeenCalledTimes(1);
    });

    it('is bold when speech2textIsActive is true', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({
          speech2textIsAvailable: true,
          speech2textIsActive: true,
        }),
      );
      await user.click(getTrigger());

      expect(screen.getByText(SPEECH2TEXT_LABEL)).toHaveClass('fw-bold');
    });
  });

  describe('text2speech option', () => {
    it('always renders and calls toggleText2Speech when clicked', async () => {
      const cantooEditor = buildCantooEditor();
      const { user } = renderCantoo(cantooEditor);
      await user.click(getTrigger());

      const item = screen.getByRole('menuitem', { name: TEXT2SPEECH_LABEL });
      await user.click(item);

      expect(cantooEditor.toggleText2Speech).toHaveBeenCalledTimes(1);
    });

    it('is not bold when text2speechIsActive is false', async () => {
      const { user } = renderCantoo(buildCantooEditor());
      await user.click(getTrigger());

      expect(screen.getByText(TEXT2SPEECH_LABEL)).not.toHaveClass('fw-bold');
    });

    it('is bold when text2speechIsActive is true', async () => {
      const { user } = renderCantoo(
        buildCantooEditor({ text2speechIsActive: true }),
      );
      await user.click(getTrigger());

      expect(screen.getByText(TEXT2SPEECH_LABEL)).toHaveClass('fw-bold');
    });
  });

  describe('settings option', () => {
    it('appears and calls toogleSettings when cantooParam is not simplify', async () => {
      const cantooEditor = buildCantooEditor({ cantooParam: 'default' });
      const { user } = renderCantoo(cantooEditor);
      await user.click(getTrigger());

      const item = screen.getByRole('menuitem', { name: SETTINGS_LABEL });
      await user.click(item);

      expect(cantooEditor.toogleSettings).toHaveBeenCalledTimes(1);
    });
  });
});

import { waitFor } from '@testing-library/react';
import { renderHook, wrapper } from '~/setup';
import { useTipTapEditor } from './useTipTapEditor';

// Combines one representative sample of every extension actually wired into the hook,
// mirroring edifice-tiptap-transformer's "kitchen-sink" fixture: catches interactions
// between extensions (e.g. a StarterKit/TextStyleKit duplicate) that an isolated,
// per-extension test in packages/extensions can't see.
const KITCHEN_SINK_HTML = `
  <h1>Title</h1>
  <p>Paragraph with <strong>bold</strong> and a <a href="https://example.com">link</a>.</p>
  <p>
    <span style="background-color: yellow;">highlighted</span>
    <span style="color: red; font-family: Arial; font-size: 20px; line-height: 1.5;">styled</span>
  </p>
  <table><tbody><tr><td style="background-color: lightblue;">cell</td></tr></tbody></table>
  <p class="info">Info alert</p>
  <p><a href="/blog#/view/1/2" data-id="1" data-app-prefix="blog">Blog link</a></p>
  <img src="/workspace/document/2">
  <div class="video-wrapper"><video src="/a.mp4" controls></video></div>
  <div class="audio-wrapper"><audio src="/a.mp3"></audio></div>
  <iframe src="https://example.com/embed"></iframe>
  <div class="attachments"><a href="/workspace/document/3" data-content-type="application/pdf">file.pdf</a></div>
  <div data-information-pane data-type="warning"><p>Pane</p></div>
`;

describe('useTipTapEditor', () => {
  it('wires StarterKit/TextStyleKit without shadowing the custom heading/hyperlink extensions', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const content =
      '<h1>Title</h1><p><a href="https://example.com">link</a></p>';

    const { result } = renderHook(() => useTipTapEditor(true, content), {
      wrapper,
    });

    await waitFor(() => expect(result.current.editor).toBeTruthy());

    const json = result.current.editor!.getJSON();
    const types = JSON.stringify(json);

    // StarterKit's bundled 'heading'/'link' must stay disabled, or they'd win the
    // parse instead of CustomHeading/Hyperlink below (see useTipTapEditor.ts).
    expect(types).toContain('"customHeading"');
    expect(types).toContain('"hyperlink"');
    expect(types).not.toContain('"heading"');
    expect(types).not.toContain('"type":"link"');

    const duplicateWarning = warnSpy.mock.calls.find((args) =>
      String(args[0]).includes('Duplicate extension names'),
    );
    expect(duplicateWarning).toBeUndefined();

    warnSpy.mockRestore();
  });

  it('wires every extension in the kitchen-sink content without errors or duplicate names', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(
      () => useTipTapEditor(true, KITCHEN_SINK_HTML),
      { wrapper },
    );

    await waitFor(() => expect(result.current.editor).toBeTruthy());

    const types = JSON.stringify(result.current.editor!.getJSON());

    expect(types).toContain('"customHeading"');
    expect(types).toContain('"hyperlink"');
    expect(types).toContain('"customHighlight"');
    expect(types).toContain('"linker"');
    expect(types).toContain('"alert"');
    expect(types).toContain('"tableCell"');
    expect(types).toContain('"backgroundColor":"lightblue"');
    // Regression: v3's TextStyleKit bundles its own backgroundColor/lineHeight
    // sub-extensions (new in v3, absent in v2) - left enabled, the
    // "background-color: yellow" span above would be double-parsed into both
    // customHighlight (intended) AND a textStyle mark carrying the same
    // backgroundColor, which v2 never produced.
    expect(types).not.toContain('"backgroundColor":"yellow"');
    expect(types).not.toContain('"lineHeight"');
    expect(types).toContain('"custom-image"');
    expect(types).toContain('"video"');
    expect(types).toContain('"audio"');
    expect(types).toContain('"iframe"');
    expect(types).toContain('"attachments"');
    expect(types).toContain('"information-pane"');

    const duplicateWarning = warnSpy.mock.calls.find((args) =>
      String(args[0]).includes('Duplicate extension names'),
    );
    expect(duplicateWarning).toBeUndefined();

    warnSpy.mockRestore();
  });

  it('does not call onContentChange when the content prop changes programmatically', async () => {
    const onContentChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ content }) =>
        useTipTapEditor(true, content, undefined, undefined, onContentChange),
      { wrapper, initialProps: { content: '<p>Hello</p>' } },
    );

    await waitFor(() => expect(result.current.editor).toBeTruthy());

    // Re-render with a genuinely different `content` prop, the same way a
    // parent switching documents would - not a real user edit.
    rerender({ content: '<p>Switched document</p>' });

    await waitFor(() =>
      expect(result.current.editor!.getText()).toBe('Switched document'),
    );

    // v3's setContent emits 'update' by default (v2 didn't); useTipTapEditor
    // must keep its own programmatic sync silent, or onContentChange would
    // fire on every content-prop change, not just real user edits.
    expect(onContentChange).not.toHaveBeenCalled();
  });

  it('still calls onContentChange for a real, user-driven edit', async () => {
    const onContentChange = vi.fn();

    const { result } = renderHook(
      () =>
        useTipTapEditor(
          true,
          '<p>Hello</p>',
          undefined,
          undefined,
          onContentChange,
        ),
      { wrapper },
    );

    await waitFor(() => expect(result.current.editor).toBeTruthy());

    result.current.editor!.commands.insertContent(' world');

    expect(onContentChange).toHaveBeenCalled();
  });
});

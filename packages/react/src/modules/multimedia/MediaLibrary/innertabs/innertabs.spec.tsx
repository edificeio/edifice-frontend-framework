import { Ref, ReactNode } from 'react';

import { WorkspaceElement } from '@edifice.io/client';

import { act, render, screen } from '~/setup';

import { MediaLibraryContext } from '../MediaLibraryContext';
import { Audio } from './Audio';
import { ExternalLink } from './ExternalLink';
import { Iframe } from './Iframe';
import { InternalLink } from './InternalLink';
import { Upload } from './Upload';
import { Video } from './Video';
import { VideoEmbedder } from './VideoEmbedder';
import { Workspace } from './Workspace';

/**
 * The innertabs are thin adapters between the MediaLibrary context and one
 * child component each. Every child is replaced by a stub that records the
 * props it received, so what is under test is the wiring, not the child.
 */
const { childProps, capture, recorderSave } = vi.hoisted(() => {
  const childProps: Record<string, any> = {};
  return {
    childProps,
    capture: (name: string) => (props: any) => {
      childProps[name] = props;
      return null;
    },
    recorderSave: vi.fn(),
  };
});

vi.mock('../../Linker/InternalLinker/InternalLinker', () => ({
  InternalLinker: capture('InternalLinker'),
}));
vi.mock('../../Linker/ExternalLinker/ExternalLinker', () => ({
  ExternalLinker: capture('ExternalLinker'),
}));
vi.mock('../../Embed', () => ({ Embed: capture('Embed') }));
vi.mock('../../VideoEmbed/VideoEmbed', () => ({
  default: capture('VideoEmbed'),
}));
vi.mock('../../Workspace', () => ({ Workspace: capture('Workspace') }));
vi.mock('../../UploadFiles', () => ({ UploadFiles: capture('UploadFiles') }));
vi.mock('../../../../components/Dropzone', () => ({
  Dropzone: ({ children, ...props }: { children?: ReactNode }) => {
    childProps.Dropzone = props;
    return <>{children}</>;
  },
}));

// Both recorders are exposed through a ref, which the innertabs hand over to
// setPreSuccess — the stub must therefore honor forwardRef. The factory is
// inlined in each call: vi.mock is hoisted above every const of this file, so a
// shared helper declared here would not be initialized yet.
vi.mock('../../AudioRecorder', async () => {
  const { forwardRef, useImperativeHandle } = await import('react');
  return {
    AudioRecorder: forwardRef((props: unknown, ref: Ref<unknown>) => {
      childProps.AudioRecorder = props;
      useImperativeHandle(ref, () => ({ save: recorderSave }));
      return null;
    }),
  };
});
vi.mock('../../VideoRecorder', async () => {
  const { forwardRef, useImperativeHandle } = await import('react');
  return {
    VideoRecorder: forwardRef((props: unknown, ref: Ref<unknown>) => {
      childProps.VideoRecorder = props;
      useImperativeHandle(ref, () => ({ save: recorderSave }));
      return null;
    }),
  };
});

type Context = Parameters<typeof MediaLibraryContext.Provider>[0]['value'];

function renderTab(tab: ReactNode, context: Partial<Context> = {}) {
  const spies = {
    setResult: vi.fn(),
    setResultCounter: vi.fn(),
    setCancellable: vi.fn(),
    setPreSuccess: vi.fn(),
    setVisibleTab: vi.fn(),
    switchType: vi.fn(),
  };
  const value = {
    appCode: 'blog',
    type: 'image',
    ...spies,
    ...context,
  } as Context;

  const view = render(
    <MediaLibraryContext.Provider value={value}>
      {tab}
    </MediaLibraryContext.Provider>,
  );
  return { ...view, ...spies };
}

describe('MediaLibrary innertabs', () => {
  describe('Upload', () => {
    it.each([
      ['audio', ['audio/*']],
      ['video', ['video/*']],
      [
        'image',
        [
          'image/png',
          'image/jpeg',
          'image/webp',
          'image/gif',
          'image/avif',
          'image/heic',
        ],
      ],
      ['embedder', []],
      ['hyperlink', []],
    ] as const)('accepts the right file types for %s', (type, accepted) => {
      renderTab(<Upload />, { type });

      expect(childProps.Dropzone.accept).toEqual(accepted);
    });

    it('accepts nothing in particular when the type is unknown', () => {
      renderTab(<Upload />, { type: null });

      expect(childProps.Dropzone.accept).toEqual([]);
    });

    it('warns the user when several files can be uploaded at once', () => {
      renderTab(<Upload />, { multiple: true });

      expect(document.querySelector('.alert')).not.toBeNull();
    });

    it('stays quiet on a single-file upload', () => {
      renderTab(<Upload />, { multiple: false });

      expect(document.querySelector('.alert')).toBeNull();
    });

    it('passes the visibility down to the uploader', () => {
      renderTab(<Upload />, { visibility: 'public' });

      expect(childProps.UploadFiles.visibility).toBe('public');
    });

    it('makes the uploaded files both cancellable and successful', () => {
      const { setResult, setResultCounter, setCancellable } = renderTab(
        <Upload />,
      );
      const files = [{ _id: 'a' }, { _id: 'b' }] as WorkspaceElement[];

      childProps.UploadFiles.onFilesChange(files);

      expect(setCancellable).toHaveBeenCalledWith(files);
      expect(setResultCounter).toHaveBeenCalledWith(2);
      expect(setResult).toHaveBeenCalledWith(files);
    });

    it('clears everything when the upload list is emptied', () => {
      const { setResult, setResultCounter, setCancellable } = renderTab(
        <Upload />,
      );

      childProps.UploadFiles.onFilesChange([]);

      expect(setCancellable).toHaveBeenCalledWith([]);
      expect(setResultCounter).toHaveBeenCalledWith(undefined);
      expect(setResult).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Workspace', () => {
    it.each([
      ['image', 'img'],
      ['audio', 'audio'],
      ['video', 'video'],
    ] as const)('filters the documents on the %s role', (type, role) => {
      renderTab(<Workspace />, { type });

      expect(childProps.Workspace.roles).toBe(role);
    });

    it('keeps every role for a type that maps to no document role', () => {
      renderTab(<Workspace />, { type: 'embedder' });

      expect(childProps.Workspace.roles).toBeNull();
    });

    it('opens on the folder matching the requested visibility', () => {
      renderTab(<Workspace />, { visibility: 'protected' });

      expect(childProps.Workspace.defaultFolder).toBe('protected');
      expect(childProps.Workspace.showPublicFolder).toBe(false);
    });

    it('reveals the public folder for a public visibility', () => {
      renderTab(<Workspace />, { visibility: 'public' });

      expect(childProps.Workspace.showPublicFolder).toBe(true);
    });

    it('reports the selected documents', () => {
      const { setResult, setResultCounter } = renderTab(<Workspace />);
      const selection = [{ _id: 'a' }] as WorkspaceElement[];

      childProps.Workspace.onSelect(selection);

      expect(setResultCounter).toHaveBeenCalledWith(1);
      expect(setResult).toHaveBeenCalledWith(selection);
    });

    it('clears the result when the selection is emptied', () => {
      const { setResult, setResultCounter } = renderTab(<Workspace />);

      childProps.Workspace.onSelect([]);

      expect(setResultCounter).toHaveBeenCalledWith(0);
      expect(setResult).toHaveBeenCalledWith();
    });
  });

  describe('InternalLink', () => {
    it('hands the app context to the linker', () => {
      renderTab(<InternalLink appPrefix="blog" resourceId="resource-id" />, {
        appCode: 'timelinegenerator',
        multiple: true,
      });

      expect(childProps.InternalLinker).toMatchObject({
        appCode: 'timelinegenerator',
        defaultAppCode: 'blog',
        defaultResourceId: 'resource-id',
        multiple: true,
      });
    });

    it('reports an empty selection on mount', () => {
      const { setResult, setResultCounter } = renderTab(<InternalLink />);

      expect(setResult).toHaveBeenCalledWith({
        target: undefined,
        resources: [],
      });
      expect(setResultCounter).toHaveBeenCalledWith(undefined);
    });

    it('reports the selected resources and their count', async () => {
      const { setResult, setResultCounter } = renderTab(<InternalLink />);
      const resources = [{ assetId: 'a' }, { assetId: 'b' }];

      // The selection lands in a state, and an effect turns it into a result:
      // both have to be flushed before asserting.
      await act(async () => childProps.InternalLinker.onSelect(resources));

      expect(setResult).toHaveBeenLastCalledWith({
        target: undefined,
        resources,
      });
      expect(setResultCounter).toHaveBeenLastCalledWith(2);
    });

    it('ticks the new-tab box when the edited link already opens in one', () => {
      renderTab(<InternalLink target="_blank" />);

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('reports the new-tab target once the box is ticked', async () => {
      const { setResult, user } = renderTab(<InternalLink />);

      await user.click(screen.getByRole('checkbox'));

      expect(setResult).toHaveBeenLastCalledWith({
        target: '_blank',
        resources: [],
      });
    });
  });

  describe('ExternalLink', () => {
    it('forwards the link being edited', () => {
      const link = { url: 'https://edifice.io' };

      renderTab(<ExternalLink link={link} multiNodeSelected />);

      expect(childProps.ExternalLinker).toMatchObject({
        link,
        multiNodeSelected: true,
      });
    });

    it('assumes a single node by default', () => {
      renderTab(<ExternalLink />);

      expect(childProps.ExternalLinker.multiNodeSelected).toBe(false);
    });

    it('reports the link as it changes', () => {
      const { setResult } = renderTab(<ExternalLink />);
      const link = { url: 'https://edifice.io', target: '_blank' as const };

      childProps.ExternalLinker.onChange(link);

      expect(setResult).toHaveBeenCalledWith(link);
    });
  });

  describe('Iframe', () => {
    it('turns the paragraph wrapping the embed code into a div', () => {
      const { setResult } = renderTab(<Iframe />);

      childProps.Embed.onSuccess('<p class="x"><iframe /></p>');

      expect(setResult).toHaveBeenCalledWith('<div class="x"><iframe /></div>');
    });

    it('mismatches the tags of a paragraph that carries no attribute', () => {
      const { setResult } = renderTab(<Iframe />);

      childProps.Embed.onSuccess('<p>2</p>');

      // Known defect: the opening tag is matched by /<p /g, which requires the
      // space that only an attribute brings, while the closing tag is matched
      // by /\/p>/g unconditionally. A bare <p> therefore ends up closed by a
      // </div>. Encoded as-is — the embed codes seen in practice carry
      // attributes, so this stays latent.
      expect(setResult).toHaveBeenCalledWith('<p>2</div>');
    });

    it('leaves an embed code without paragraph untouched', () => {
      const { setResult } = renderTab(<Iframe />);

      childProps.Embed.onSuccess('<iframe src="https://edifice.io" />');

      expect(setResult).toHaveBeenCalledWith(
        '<iframe src="https://edifice.io" />',
      );
    });

    it('passes an empty result straight through', () => {
      const { setResult } = renderTab(<Iframe />);

      childProps.Embed.onSuccess(undefined);

      expect(setResult).toHaveBeenCalledWith(undefined);
    });
  });

  describe('VideoEmbedder', () => {
    it('lets the embedder switch the media library type', () => {
      const { switchType } = renderTab(<VideoEmbedder />);

      expect(childProps.VideoEmbed.switchType).toBe(switchType);
    });

    it('reports the embed code', () => {
      const { setResult } = renderTab(<VideoEmbedder />);

      childProps.VideoEmbed.onSuccess('<iframe />');

      expect(setResult).toHaveBeenCalledWith('<iframe />');
    });
  });

  describe('Audio', () => {
    it('hides the recorder’s own save action and takes over the upload', () => {
      renderTab(<Audio />, { visibility: 'protected' });

      expect(childProps.AudioRecorder).toMatchObject({
        hideSaveAction: true,
        visibility: 'protected',
      });
    });

    it('defers the upload of a fresh recording to the success button', () => {
      const { setResult, setPreSuccess } = renderTab(<Audio />);

      childProps.AudioRecorder.onRecordUpdated('blob:audio');

      expect(setResult).toHaveBeenCalledWith('blob:audio');
      expect(setPreSuccess).toHaveBeenCalled();
      expect(setPreSuccess.mock.calls[0][0]()).toBe(recorderSave);
    });

    it('clears the result when the recording is discarded', () => {
      const { setResult, setPreSuccess } = renderTab(<Audio />);

      childProps.AudioRecorder.onRecordUpdated(undefined);

      expect(setResult).toHaveBeenCalledWith();
      expect(setPreSuccess).not.toHaveBeenCalled();
    });

    it('replaces the blob URL with the uploaded document', () => {
      const { setResult } = renderTab(<Audio />);
      const document = { _id: 'audio-id' } as WorkspaceElement;

      childProps.AudioRecorder.onSaveSuccess(document);

      expect(setResult).toHaveBeenCalledWith(document);
    });

    it('keeps the current result when the upload returns nothing', () => {
      const { setResult } = renderTab(<Audio />);

      childProps.AudioRecorder.onSaveSuccess(undefined);

      expect(setResult).not.toHaveBeenCalled();
    });
  });

  describe('Video', () => {
    it('hands the app code and a caption to the recorder', () => {
      renderTab(<Video />, { appCode: 'blog' });

      expect(childProps.VideoRecorder).toMatchObject({
        appCode: 'blog',
        hideSaveAction: true,
      });
      expect(childProps.VideoRecorder.caption).toBeTruthy();
    });

    it('defers the upload of a fresh recording to the success button', () => {
      const { setResult, setPreSuccess } = renderTab(<Video />);

      childProps.VideoRecorder.onRecordUpdated('blob:video');

      expect(setResult).toHaveBeenCalledWith('blob:video');
      expect(setPreSuccess.mock.calls[0][0]()).toBe(recorderSave);
    });

    it('clears the result when the recording is discarded', () => {
      const { setResult, setPreSuccess } = renderTab(<Video />);

      childProps.VideoRecorder.onRecordUpdated(undefined);

      expect(setResult).toHaveBeenCalledWith();
      expect(setPreSuccess).not.toHaveBeenCalled();
    });

    it('logs a recording error instead of surfacing it', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderTab(<Video />);

      childProps.VideoRecorder.onError('NotAllowedError');

      expect(error).toHaveBeenCalledWith('NotAllowedError');
    });
  });
});

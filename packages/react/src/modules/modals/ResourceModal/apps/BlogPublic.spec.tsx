import { IResource } from '@edifice.io/client';
import { useForm } from 'react-hook-form';
import slugify from 'react-slugify';

import { render, screen, waitFor } from '~/setup';
import { FormInputs } from '../ResourceModal';
import BlogPublic from './BlogPublic';

// Build a minimal IResource; only the fields read by BlogPublic/useSlug matter here.
const buildResource = (overrides: Partial<IResource> = {}): IResource =>
  ({
    public: false,
    ...overrides,
  }) as IResource;

// BlogPublic is designed to run inside a real ResourceModal <form>: it needs
// working `watch`/`register`/`setValue` from react-hook-form, since useSlug
// (used internally) calls `watch('title')` and `setValue('formSlug', ...)`.
// A thin wrapper around the real `useForm()` is therefore more realistic
// than hand-rolled mocks.
function Wrapper({
  resource,
  isUpdating,
  title = 'My blog',
  appCode = 'blog',
}: {
  resource: IResource;
  isUpdating: boolean;
  title?: string;
  appCode?: string;
}) {
  const { watch, register, setValue } = useForm<FormInputs>({
    defaultValues: {
      title,
      enablePublic: isUpdating ? resource.public : false,
      formSlug: isUpdating ? resource.slug : '',
    },
  });

  return (
    <BlogPublic
      appCode={appCode}
      isUpdating={isUpdating}
      resource={resource}
      watch={watch}
      register={register}
      setValue={setValue}
    />
  );
}

describe('BlogPublic', () => {
  beforeEach(() => {
    // jsdom exposes navigator.clipboard as a getter-only property, so
    // Object.assign would throw; redefine it instead (same pattern as
    // useSlug.spec.tsx).
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn() },
      configurable: true,
      writable: true,
    });
  });

  it('reflects resource.public on the checkbox when isUpdating is true', () => {
    render(
      <Wrapper resource={buildResource({ public: true })} isUpdating={true} />,
    );

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('leaves the checkbox unchecked when isUpdating is false, regardless of resource.public', () => {
    render(
      <Wrapper resource={buildResource({ public: true })} isUpdating={false} />,
    );

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('only reveals the slug URL and copy button after toggling the checkbox on', async () => {
    const { user } = render(
      <Wrapper
        resource={buildResource({ public: false })}
        isUpdating={false}
      />,
    );

    expect(
      screen.queryByRole('button', {
        name: 'explorer.resource.editModal.access.url.button',
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('switch'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: 'explorer.resource.editModal.access.url.button',
        }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByText(new RegExp(`${window.location.origin}/blog/pub/`)),
    ).toBeInTheDocument();
  });

  it('calls navigator.clipboard.writeText when the copy URL button is clicked', async () => {
    const { user } = render(
      <Wrapper
        resource={buildResource({ public: false })}
        isUpdating={false}
        title="My blog"
      />,
    );

    await user.click(screen.getByRole('switch'));

    const copyButton = await screen.findByRole('button', {
      name: 'explorer.resource.editModal.access.url.button',
    });
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const [writtenUrl] = (
      navigator.clipboard.writeText as ReturnType<typeof vi.fn>
    ).mock.calls[0];
    expect(writtenUrl).toEqual(
      expect.stringContaining(`${window.location.origin}/blog/pub/`),
    );
    expect(writtenUrl.endsWith(`-${slugify('My blog')}`)).toBe(true);
  });

  it('disables the checkbox when resourceName (watch("title")) is falsy', () => {
    render(
      <Wrapper
        resource={buildResource({ public: false })}
        isUpdating={false}
        title=""
      />,
    );

    expect(screen.getByRole('switch')).toBeDisabled();
  });
});

import { BlogResource } from '@edifice.io/client';

import { render, screen, waitFor } from '~/setup';
import ShareBlog, { ShareBlogProps } from './ShareBlog';

const { searchResource, update } = vi.hoisted(() => ({
  searchResource: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      resource: () => ({ searchResource, update }),
    },
  };
});

// Build a minimal BlogResource; only the fields read by ShareBlog matter here.
const buildResource = (overrides: Partial<BlogResource> = {}): BlogResource =>
  ({
    'assetId': 'asset-1',
    'name': 'My blog',
    'description': 'desc',
    'public': true,
    'slug': 'my-slug',
    'thumbnail': 'thumb.png',
    'trashed': false,
    'publish-type': 'RESTRAINT',
    ...overrides,
  }) as BlogResource;

describe('ShareBlog', () => {
  beforeEach(() => {
    update.mockResolvedValue({});
  });

  it('reflects resource["publish-type"] on the radio selection once loaded', async () => {
    searchResource.mockResolvedValue(
      buildResource({ 'publish-type': 'RESTRAINT' }),
    );

    render(<ShareBlog resourceId="resource-1" />);

    await waitFor(() =>
      expect(
        screen.getByRole('radio', { name: 'explorer.validate.publication' }),
      ).toBeChecked(),
    );
    expect(
      screen.getByRole('radio', { name: 'explorer.immediat.publication' }),
    ).not.toBeChecked();
  });

  it('reflects an IMMEDIATE resource["publish-type"] on the radio selection', async () => {
    searchResource.mockResolvedValue(
      buildResource({ 'publish-type': 'IMMEDIATE' }),
    );

    render(<ShareBlog resourceId="resource-1" />);

    await waitFor(() =>
      expect(
        screen.getByRole('radio', { name: 'explorer.immediat.publication' }),
      ).toBeChecked(),
    );
    expect(
      screen.getByRole('radio', { name: 'explorer.validate.publication' }),
    ).not.toBeChecked();
  });

  it('calls odeServices resource update with the mapped payload when no updateResource mutation is provided', async () => {
    searchResource.mockResolvedValue(
      buildResource({ 'publish-type': 'RESTRAINT' }),
    );

    const { user } = render(<ShareBlog resourceId="resource-1" />);

    await waitFor(() =>
      expect(
        screen.getByRole('radio', { name: 'explorer.validate.publication' }),
      ).toBeChecked(),
    );

    await user.click(
      screen.getByRole('radio', { name: 'explorer.immediat.publication' }),
    );

    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    expect(update).toHaveBeenCalledWith({
      'description': 'desc',
      'entId': 'asset-1',
      'name': 'My blog',
      'public': true,
      'slug': 'my-slug',
      'thumbnail': 'thumb.png',
      'trashed': false,
      'publish-type': 'IMMEDIATE',
    });

    await waitFor(() =>
      expect(
        screen.getByRole('radio', { name: 'explorer.immediat.publication' }),
      ).toBeChecked(),
    );
  });

  it('calls updateResource.mutateAsync instead of odeServices when a mutation prop is provided', async () => {
    searchResource.mockResolvedValue(
      buildResource({ 'publish-type': 'RESTRAINT' }),
    );
    const mutateAsync = vi.fn().mockResolvedValue({});
    const updateResource = {
      mutateAsync,
    } as unknown as ShareBlogProps['updateResource'];

    const { user } = render(
      <ShareBlog resourceId="resource-1" updateResource={updateResource} />,
    );

    await waitFor(() =>
      expect(
        screen.getByRole('radio', { name: 'explorer.validate.publication' }),
      ).toBeChecked(),
    );

    await user.click(
      screen.getByRole('radio', { name: 'explorer.immediat.publication' }),
    );

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledWith({
      'description': 'desc',
      'entId': 'asset-1',
      'name': 'My blog',
      'public': true,
      'slug': 'my-slug',
      'thumbnail': 'thumb.png',
      'trashed': false,
      'publish-type': 'IMMEDIATE',
    });
    expect(update).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(
        screen.getByRole('radio', { name: 'explorer.immediat.publication' }),
      ).toBeChecked(),
    );
  });
});

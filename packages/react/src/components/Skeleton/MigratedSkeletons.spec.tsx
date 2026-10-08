import { render } from '~/setup';
import EditorPreviewSkeleton from '../../modules/editor/components/Editor/EditorPreviewSkeleton';
import EditorSkeleton from '../../modules/editor/components/Editor/EditorSkeleton';
import CommunitiesSkeleton from '../../modules/homepage/components/Communities/CommunitiesSkeleton';

// The skeletons below used to rely on the Bootstrap `.placeholder` class, whose
// animation cannot be turned off. They are now built on the Skeleton primitive.
describe('skeletons built on the Skeleton primitive', () => {
  it.each([
    ['EditorSkeleton (read)', <EditorSkeleton key="read" />],
    ['EditorSkeleton (edit)', <EditorSkeleton key="edit" mode="edit" />],
    ['EditorPreviewSkeleton', <EditorPreviewSkeleton key="preview" />],
    ['CommunitiesSkeleton', <CommunitiesSkeleton key="communities" />],
  ])('%s draws its blocks with .skeleton, never .placeholder', (_, ui) => {
    const { container } = render(ui);

    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    expect(container.querySelector('.placeholder')).toBeNull();
  });

  it('hides every block from assistive technologies', () => {
    const { container } = render(<EditorSkeleton mode="edit" />);

    container
      .querySelectorAll('.skeleton')
      .forEach((block) => expect(block).toHaveAttribute('aria-hidden', 'true'));
  });

  it('does not render focusable buttons for the editor toolbar', () => {
    const { container } = render(<EditorSkeleton mode="edit" />);

    expect(container.querySelector('button')).toBeNull();
  });
});

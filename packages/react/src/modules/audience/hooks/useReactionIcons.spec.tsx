import { ReactionType } from '@edifice.io/client';
import { render, renderHook } from '~/setup';
import useReactionIcons from './useReactionIcons';

const setup = () => renderHook(() => useReactionIcons()).result;

/** Every reaction icon is an SVG, told apart by its rendered markup. */
const markupOf = (icon: React.ReactNode) => {
  const { container, unmount } = render(<>{icon}</>);
  const html = container.innerHTML;
  unmount();
  return html;
};

describe('useReactionIcons', () => {
  describe('getReactionIcon', () => {
    it.each<ReactionType>([
      'REACTION_1',
      'REACTION_2',
      'REACTION_3',
      'REACTION_4',
    ])('renders a distinct icon for %s', (reactionType) => {
      const { current } = setup();

      expect(markupOf(current.getReactionIcon(reactionType))).toContain('svg');
    });

    it('renders a different icon for each reaction type', () => {
      const { current } = setup();

      const markups = (
        ['REACTION_1', 'REACTION_2', 'REACTION_3', 'REACTION_4'] as const
      ).map((type) => markupOf(current.getReactionIcon(type)));

      expect(new Set(markups).size).toBe(4);
    });

    it('renders the counter variant when asked for it', () => {
      const { current } = setup();

      expect(markupOf(current.getReactionIcon('REACTION_1', true))).not.toBe(
        markupOf(current.getReactionIcon('REACTION_1', false)),
      );
    });

    it('falls back to the generic reaction icon for an unknown type', () => {
      const { current } = setup();

      const fallback = markupOf(current.getReactionIcon());
      expect(fallback).toContain('svg');
      expect(markupOf(current.getReactionIcon(null))).toBe(fallback);
      expect(
        markupOf(current.getReactionIcon('REACTION_9' as ReactionType)),
      ).toBe(fallback);
    });

    it('ignores the counter flag on the fallback icon', () => {
      const { current } = setup();

      expect(markupOf(current.getReactionIcon(null, true))).toBe(
        markupOf(current.getReactionIcon(null, false)),
      );
    });
  });

  describe('getReactionLabel', () => {
    it.each([
      ['REACTION_1', 'audience.reaction.thanks'],
      ['REACTION_2', 'audience.reaction.great'],
      ['REACTION_3', 'audience.reaction.congrats'],
      ['REACTION_4', 'audience.reaction.interesting'],
    ] as const)('maps %s to %s', (reactionType, key) => {
      const { current } = setup();

      expect(current.getReactionLabel(reactionType)).toBe(key);
    });

    it('falls back to the default label', () => {
      const { current } = setup();

      expect(current.getReactionLabel()).toBe('audience.reaction.default');
      expect(current.getReactionLabel(null)).toBe('audience.reaction.default');
    });
  });
});

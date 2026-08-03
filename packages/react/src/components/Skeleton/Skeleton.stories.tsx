import type { Meta, StoryObj } from '@storybook/react-vite';
import Skeleton, { SkeletonAnimation, SkeletonTone } from './Skeleton';

const meta = {
  title: 'Components/Skeleton/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: {
      options: ['text', 'circle', 'pill', 'block'],
      control: { type: 'inline-radio' },
      description: 'Geometry of the block',
    },
    tone: {
      options: ['default', 'strong'],
      control: { type: 'inline-radio' },
      description: 'Grey level: grey/300 or grey/500',
    },
    animation: {
      options: ['static', 'pulse', 'shimmer'],
      control: { type: 'inline-radio' },
      description: 'Loading animation',
    },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    variant: 'text',
    tone: 'default',
    animation: 'static',
    height: 20,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Geometric placeholder standing in for a piece of content while it loads.\n\nThe primitive carries no loading logic and no children. A component declares its own skeleton variant by reusing its real layout and swapping each content slot for one of these blocks — that coupling is what keeps the placeholder free of layout shift. See `Modules/Homepage/NotificationSkeleton` for a worked example.\n\nEach block is decorative and hidden from assistive technologies (`aria-hidden`). The component assembling them owns `role="status"` and `aria-busy`, so the loading state is announced once instead of once per block.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="skeleton-showcase-group">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {};

export const Text: Story = {
  args: { variant: 'text', height: 20 },
  parameters: {
    docs: {
      description: {
        story:
          'Stands in for a line of text. Uses the `sm` radius. Give it the real line height of the text it replaces — 20 for a `body`, 18 for a `caption` — so the block occupies the same space as the loaded line.',
      },
    },
  },
};

export const Circle: Story = {
  args: { variant: 'circle', tone: 'strong', height: 32 },
  parameters: {
    docs: {
      description: {
        story:
          'Stands in for a round medium such as an avatar. The missing dimension is derived from the provided one, so sizing it by height alone is enough.',
      },
    },
  },
};

export const Pill: Story = {
  args: { variant: 'pill', width: 135, height: 28 },
  parameters: {
    docs: {
      description: {
        story:
          'Stands in for a chip or a badge. Fully rounded through the `pill` radius token.',
      },
    },
  },
};

export const Block: Story = {
  args: { variant: 'block', height: 120 },
  parameters: {
    docs: {
      description: {
        story:
          'Stands in for a media area such as a thumbnail or a cover. Shares the `sm` radius of `text` today, and exists as its own variant so media can diverge from text later without touching the callers.',
      },
    },
  },
};

const ANIMATIONS: SkeletonAnimation[] = ['static', 'pulse', 'shimmer'];
const TONES: SkeletonTone[] = ['default', 'strong'];

const CAPTIONS: Record<SkeletonAnimation, string> = {
  static: 'flat grey, the default — matches the current mockups',
  pulse: 'opacity 1 → 0.4, 1.6s',
  shimmer: 'white highlight swept left to right, 1.6s',
};

/**
 * The story meant to be shown to the designer: the three animations against
 * the two tones, on the three shapes the notification mockup actually uses.
 */
export const AnimationsAndTones: Story = {
  render: () => (
    <div className="skeleton-showcase">
      {ANIMATIONS.map((animation) => (
        <section key={animation} className="skeleton-showcase-group">
          <header className="skeleton-showcase-heading">
            <strong className="skeleton-showcase-name">{animation}</strong>
            <span className="skeleton-showcase-note">
              {CAPTIONS[animation]}
            </span>
          </header>

          {TONES.map((tone) => (
            <div key={tone} className="skeleton-showcase-row">
              <span className="skeleton-showcase-label">
                {tone === 'strong' ? 'strong · grey/500' : 'default · grey/300'}
              </span>
              <Skeleton
                variant="circle"
                tone={tone}
                animation={animation}
                className="skeleton-showcase-avatar"
              />
              <Skeleton
                variant="text"
                tone={tone}
                animation={animation}
                className="skeleton-showcase-line"
              />
              <Skeleton
                variant="pill"
                tone={tone}
                animation={animation}
                className="skeleton-showcase-chip"
              />
            </div>
          ))}
        </section>
      ))}

      <p className="skeleton-showcase-note">
        Whichever animation is chosen, it is suppressed entirely when the
        operating system reports <code>prefers-reduced-motion: reduce</code>.
        Toggle it in the OS accessibility settings to check this page.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of the three animations against the two tones. The semantics proposed for `tone` are media versus text: `strong` (grey/500) for avatars and thumbnails, `default` (grey/300) for text lines and chips. Both the animation and that semantic split are still open design questions.',
      },
    },
  },
};

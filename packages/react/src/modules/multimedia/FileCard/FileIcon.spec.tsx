import { render } from '~/setup';

import FileIcon from './FileIcon';

const icon = () => document.querySelector('.position-absolute');

describe('FileIcon', () => {
  it('falls back to a paperclip when the role carries no icon', () => {
    render(<FileIcon type="unknown" />);

    expect(icon()?.querySelector('svg')).not.toBeNull();
  });

  it('paints the color carried by the role', () => {
    render(
      <FileIcon type="pdf" roleMap={{ icon: '.PDF', color: 'bg-red-200' }} />,
    );

    expect(icon()).toHaveClass('bg-red-200');
  });

  describe('shadow', () => {
    it('lifts a component icon on a known role', () => {
      render(
        <FileIcon
          type="img"
          roleMap={{
            icon: <span data-testid="svg-icon" />,
            color: 'bg-green-200',
          }}
        />,
      );

      expect(icon()).toHaveClass('shadow');
    });

    it('leaves a textual icon flat — the extension label needs no relief', () => {
      render(
        <FileIcon type="pdf" roleMap={{ icon: '.PDF', color: 'bg-red-200' }} />,
      );

      expect(icon()).not.toHaveClass('shadow');
    });

    it('leaves the unknown role flat even with a component icon', () => {
      render(
        <FileIcon
          type="unknown"
          roleMap={{ icon: <span />, color: 'bg-gray-300' }}
        />,
      );

      expect(icon()).not.toHaveClass('shadow');
    });

    it('honors an explicit hasShadow: false', () => {
      render(
        <FileIcon
          type="img"
          roleMap={{
            icon: <span />,
            color: 'bg-green-200',
            hasShadow: false,
          }}
        />,
      );

      expect(icon()).not.toHaveClass('shadow');
    });

    it('keeps the shadow when hasShadow is left undefined', () => {
      render(
        <FileIcon
          type="img"
          roleMap={{
            icon: <span />,
            color: 'bg-green-200',
            hasShadow: undefined,
          }}
        />,
      );

      expect(icon()).toHaveClass('shadow');
    });
  });
});

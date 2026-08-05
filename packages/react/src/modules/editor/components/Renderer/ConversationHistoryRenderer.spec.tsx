import { render, screen } from '~/setup';
import ConversationHistoryRenderer from './ConversationHistoryRenderer';

// The `conversation` i18n namespace is not registered in this repo's test
// setup, so i18next falls back to returning the raw key as the translated
// string. We assert on those raw keys rather than a translated phrase.

describe('ConversationHistoryRenderer', () => {
  it('is closed by default: shows the "show" label and the content has no "show" class', () => {
    render(<ConversationHistoryRenderer />);

    expect(
      screen.getByRole('button', { name: /message\.history\.show/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /message\.history\.hide/ }),
    ).not.toBeInTheDocument();

    const content = screen.getByTestId('conversation-history-content');
    expect(content).not.toHaveClass('show');
  });

  it('toggles the label and the content class when the button is clicked', async () => {
    const { user } = render(<ConversationHistoryRenderer />);

    const button = screen.getByRole('button', {
      name: /message\.history\.show/,
    });
    const content = screen.getByTestId('conversation-history-content');

    await user.click(button);

    expect(
      screen.getByRole('button', { name: /message\.history\.hide/ }),
    ).toBeInTheDocument();
    expect(content).toHaveClass('show');

    await user.click(
      screen.getByRole('button', { name: /message\.history\.hide/ }),
    );

    expect(
      screen.getByRole('button', { name: /message\.history\.show/ }),
    ).toBeInTheDocument();
    expect(content).not.toHaveClass('show');
  });
});

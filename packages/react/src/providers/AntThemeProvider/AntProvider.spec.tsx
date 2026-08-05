import { DatePicker } from 'antd';
import { render, screen } from '~/setup';
import AntProvider from './AntProvider';

const { useEdificeClient } = vi.hoisted(() => ({
  useEdificeClient: vi.fn(),
}));

vi.mock('../EdificeClientProvider/EdificeClientProvider.hook', () => ({
  useEdificeClient,
}));

/**
 * The locale reaches the antd components through the config context, so it is
 * read back from a rendered picker rather than from the provider itself.
 */
function renderWithLocale(currentLanguage: string | undefined) {
  useEdificeClient.mockReturnValue({ currentLanguage });

  return render(
    <AntProvider>
      <DatePicker open />
    </AntProvider>,
  );
}

describe('AntProvider', () => {
  it('renders its children', () => {
    useEdificeClient.mockReturnValue({ currentLanguage: 'fr' });

    render(
      <AntProvider>
        <span>wrapped</span>
      </AntProvider>,
    );

    expect(screen.getByText('wrapped')).toBeInTheDocument();
  });

  it('uses the French locale for a French session', () => {
    renderWithLocale('fr');

    expect(
      screen.getByPlaceholderText('Sélectionner une date'),
    ).toBeInTheDocument();
  });

  it.each(['de', 'es', 'it', 'pt'])(
    'uses a non-French placeholder for the %s locale',
    (language) => {
      renderWithLocale(language);

      expect(
        screen.queryByPlaceholderText('Sélectionner une date'),
      ).not.toBeInTheDocument();
    },
  );

  it('falls back to French for an unmapped language', () => {
    renderWithLocale('nl');

    expect(
      screen.getByPlaceholderText('Sélectionner une date'),
    ).toBeInTheDocument();
  });

  it('falls back to French when the language is unknown yet', () => {
    renderWithLocale(undefined);

    expect(
      screen.getByPlaceholderText('Sélectionner une date'),
    ).toBeInTheDocument();
  });
});

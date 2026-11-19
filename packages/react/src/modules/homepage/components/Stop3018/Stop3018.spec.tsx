import { render, screen } from '~/setup';
import Stop3018 from './Stop3018';
import { Stop3018Modal } from './Stop3018Modal';

describe('Stop3018', () => {
  it('invites students to contact the 3018 and take the quiz', async () => {
    const onLinkClick = vi.fn();
    const { user } = render(
      <Stop3018
        audience="student"
        onLearnMoreClick={vi.fn()}
        onLinkClick={onLinkClick}
      />,
    );

    expect(
      screen.getByRole('heading', { name: '3018 - stop au harcèlement !' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/si vous êtes victime, témoin ou auteur/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Suis-je harcelé ?' }));
    expect(onLinkClick).toHaveBeenCalledWith('quiz');
  });

  it('shows no quiz to relatives', () => {
    render(
      <Stop3018
        audience="relative"
        onLearnMoreClick={vi.fn()}
        onLinkClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/si vous suspectez une situation de harcèlement/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Suis-je harcelé ?' }),
    ).not.toBeInTheDocument();
  });

  it('opens the modal from the full screen button and "En savoir plus"', async () => {
    const onLearnMoreClick = vi.fn();
    const onLinkClick = vi.fn();
    const { user } = render(
      <Stop3018
        audience="relative"
        onLearnMoreClick={onLearnMoreClick}
        onLinkClick={onLinkClick}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Ouvrir en plein écran' }),
    );
    await user.click(screen.getByRole('button', { name: 'En savoir plus' }));
    expect(onLearnMoreClick).toHaveBeenCalledTimes(2);
    expect(onLinkClick).not.toHaveBeenCalled();
  });
});

describe('Stop3018Modal', () => {
  it.each([
    ['student', 'FAQ conseils pour les jeunes', true],
    ['relative', 'FAQ conseils pour les parents', false],
  ] as const)(
    'gives the %s advice of their own',
    async (audience, faqLabel, hasQuiz) => {
      const onLinkClick = vi.fn();
      const { user } = render(
        <Stop3018Modal
          isOpen
          audience={audience}
          onClose={vi.fn()}
          onLinkClick={onLinkClick}
        />,
      );

      await user.click(await screen.findByRole('button', { name: faqLabel }));
      expect(onLinkClick).toHaveBeenCalledWith('faq');
      expect(
        screen.queryByRole('button', { name: 'Quiz : Suis-je harcelé ?' }) !==
          null,
      ).toBe(hasQuiz);
    },
  );

  it('links the QR code to the 3018 app for keyboard users', async () => {
    render(
      <Stop3018Modal
        isOpen
        audience="relative"
        onClose={vi.fn()}
        onLinkClick={vi.fn()}
      />,
    );

    const link = await screen.findByRole('link', {
      name: 'Télécharger l’application 3018 (nouvel onglet)',
    });
    expect(link).toHaveAttribute('href', 'https://onelink.to/55nrsk');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

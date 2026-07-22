import type { IWebApp } from '@edifice.io/client';
import { render, screen } from '~/setup';
import Badge from './Badge';

const iconHelpers = {
  getIconClass: vi.fn(() => 'color-app-demo'),
  getBackgroundLightIconClass: vi.fn(() => 'bg-light-demo'),
  getBorderIconClass: vi.fn(() => 'border-app-demo'),
};

vi.mock('../../hooks/useEdificeIcons', () => ({
  useEdificeIcons: () => iconHelpers,
}));

describe('Badge', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the default notification badge variant', () => {
    render(<Badge>Notification</Badge>);

    expect(screen.getByText('Notification')).toHaveClass(
      'badge',
      'rounded-pill',
      'badge-notification',
      'bg-info',
      'text-light',
      'border',
      'border-0',
    );
  });

  it('renders content badges with the expected background classes', () => {
    render(
      <Badge variant={{ type: 'content', level: 'warning', background: true }}>
        Content
      </Badge>,
    );

    expect(screen.getByText('Content')).toHaveClass(
      'badge',
      'rounded-pill',
      'bg-gray-200',
      'text-warning',
    );
  });

  it('renders chip badges inside the chip container', () => {
    const { container } = render(
      <Badge variant={{ type: 'chip' }}>Chip label</Badge>,
    );

    expect(screen.getByText('Chip label')).toBeInTheDocument();
    expect(container.querySelector('div')).toHaveClass(
      'd-flex',
      'fw-800',
      'align-items-center',
    );
  });

  it('renders beta badges with the default label and app color classes', () => {
    const app = { icon: 'demo' } as IWebApp;

    render(<Badge variant={{ type: 'beta', app }} />);

    expect(screen.getByText('BÊTA')).toHaveClass(
      'badge',
      'rounded-pill',
      'color-app-demo',
      'bg-light-demo',
      'border-app-demo',
    );
    expect(iconHelpers.getIconClass).toHaveBeenCalled();
    expect(iconHelpers.getBackgroundLightIconClass).toHaveBeenCalled();
    expect(iconHelpers.getBorderIconClass).toHaveBeenCalled();
  });

  it('renders profile badges with the profile class', () => {
    render(
      <Badge variant={{ type: 'user', profile: 'Teacher' as never }}>
        Teacher
      </Badge>,
    );

    expect(screen.getByText('Teacher')).toHaveClass('badge-profile-teacher');
  });
});

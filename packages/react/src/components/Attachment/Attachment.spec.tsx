import { createRef } from 'react';

import { render, screen } from '~/setup';
import Attachment from './Attachment';

describe('Attachment', () => {
  it('renders the given name and options', () => {
    render(<Attachment name="report.pdf" options={<button>Delete</button>} />);

    expect(screen.getAllByText('report.pdf')[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('falls back to a default name when none is given', () => {
    render(<Attachment options={undefined} />);

    expect(screen.getAllByText('Attachment Name')[0]).toBeInTheDocument();
  });

  it('omits the options block when options is undefined', () => {
    const { container } = render(
      <Attachment name="report.pdf" options={undefined} />,
    );

    expect(container.querySelector('.options')).not.toBeInTheDocument();
  });

  it('forwards a ref and arbitrary props to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Attachment
        ref={ref}
        name="report.pdf"
        options={undefined}
        data-testid="my-attachment"
      />,
    );

    expect(ref.current).toHaveAttribute('data-testid', 'my-attachment');
    expect(ref.current).toHaveClass('attachment');
  });
});

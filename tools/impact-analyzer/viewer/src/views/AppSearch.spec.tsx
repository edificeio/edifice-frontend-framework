import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppSearch } from './AppSearch.js';

describe('AppSearch', () => {
  it('renders every app name and calls onSelect when one is clicked', () => {
    const onSelect = vi.fn();
    render(
      <AppSearch
        appNames={['blog', 'communities']}
        selected={null}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText('blog')).toBeTruthy();
    expect(screen.getByText('communities')).toBeTruthy();

    fireEvent.click(screen.getByText('blog'));
    expect(onSelect).toHaveBeenCalledWith('blog');
  });

  it('filters the list by the search query', () => {
    render(
      <AppSearch
        appNames={['blog', 'communities']}
        selected={null}
        onSelect={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/rechercher une app/i), {
      target: { value: 'blog' },
    });

    expect(screen.getByText('blog')).toBeTruthy();
    expect(screen.queryByText('communities')).toBeNull();
  });
});

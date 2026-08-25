import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useChildren } from './useChildren';

const mocks = vi.hoisted(() => ({
  getChildren: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    directory: () => ({ getChildren: mocks.getChildren }),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useChildren', () => {
  it('merges children from every structure into a single list', async () => {
    mocks.getChildren.mockResolvedValue([
      {
        structureName: 'Structure A',
        children: [
          {
            id: '1',
            displayName: 'Ron Weasley',
            externalId: 'e1',
            classesNames: ['CE2-A'],
          },
        ],
      },
      {
        structureName: 'Structure B',
        children: [
          {
            id: '2',
            displayName: 'Ginny Weasley',
            externalId: 'e2',
            classesNames: ['CM2-C'],
          },
        ],
      },
    ]);

    const { result } = renderHook(() => useChildren('user-id', true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      {
        id: '1',
        displayName: 'Ron Weasley',
        externalId: 'e1',
        classesNames: ['CE2-A'],
      },
      {
        id: '2',
        displayName: 'Ginny Weasley',
        externalId: 'e2',
        classesNames: ['CM2-C'],
      },
    ]);
  });

  it('deduplicates a child appearing in more than one structure', async () => {
    const child = {
      id: '1',
      displayName: 'Ron Weasley',
      externalId: 'e1',
      classesNames: ['CE2-A'],
    };
    mocks.getChildren.mockResolvedValue([
      { structureName: 'Structure A', children: [child] },
      { structureName: 'Structure B', children: [child] },
    ]);

    const { result } = renderHook(() => useChildren('user-id', true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([child]);
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => useChildren('user-id', false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mocks.getChildren).not.toHaveBeenCalled();
  });
});

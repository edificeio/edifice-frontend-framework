import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProfileLinks } from './useProfileLinks';

const mocks = vi.hoisted(() => ({
  useEdificeClient: vi.fn(),
}));

vi.mock(
  '../../../../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({
    useEdificeClient: mocks.useEdificeClient,
  }),
);

describe('useProfileLinks', () => {
  beforeEach(() => {
    mocks.useEdificeClient.mockReturnValue({
      user: {
        structures: ['structure-id'],
        classes: [],
        children: {},
      },
    });
  });

  it('returns undefined for the Guest profile', () => {
    const { result } = renderHook(() => useProfileLinks('Guest'));

    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the user has no structure', () => {
    mocks.useEdificeClient.mockReturnValue({
      user: { structures: [], classes: [] },
    });

    const { result } = renderHook(() => useProfileLinks('Teacher'));

    expect(result.current).toBeUndefined();
  });

  it('returns a classes link for the Teacher profile, appending each class', () => {
    mocks.useEdificeClient.mockReturnValue({
      user: { structures: ['structure-id'], classes: ['class-1', 'class-2'] },
    });

    const { result } = renderHook(() => useProfileLinks('Teacher'));

    expect(result.current).toEqual([
      {
        text: 'Mes classes',
        url: '/userbook/annuaire#/search?filters=groups&structure=structure-id&class=class-1&class=class-2',
      },
    ]);
  });

  it('returns teachers and classes links for the Student profile', () => {
    mocks.useEdificeClient.mockReturnValue({
      user: { structures: ['structure-id'], classes: ['class-1'] },
    });

    const { result } = renderHook(() => useProfileLinks('Student'));

    expect(result.current).toEqual([
      {
        text: 'Mes enseignants',
        url: '/userbook/annuaire#/search?filters=groups&profile=Teacher',
      },
      {
        text: 'Mes classes',
        url: '/userbook/annuaire#/search?filters=groups&structure=structure-id&class=class-1',
      },
    ]);
  });

  it('returns a classes and groups link for the Personnel profile', () => {
    const { result } = renderHook(() => useProfileLinks('Personnel'));

    expect(result.current).toEqual([
      {
        text: 'Classes et groupes',
        url: '/userbook/annuaire#/search?filters=groups&structure=structure-id',
      },
    ]);
  });

  //TODO add test for Relative profile when user has children (wait API)
  // it('returns one link per child for the Relative profile', () => {
  //   mocks.useEdificeClient.mockReturnValue({
  //     user: {
  //       structures: ['structure-id'],
  //       children: {
  //         'child-id-1': { firstName: 'Ronald', lastName: 'WEASLEY' },
  //         'child-id-2': { firstName: 'Ginny', lastName: 'WEASLEY' },
  //       },
  //     },
  //   });

  //   const { result } = renderHook(() => useProfileLinks('Relative'));

  //   expect(result.current).toEqual([
  //     {
  //       text: 'La classe de Ronald',
  //       url: '/userbook/annuaire#/search?filters=groups&structure=structure-id&class=child-id-1',
  //     },
  //     {
  //       text: 'La classe de Ginny',
  //       url: '/userbook/annuaire#/search?filters=groups&structure=structure-id&class=child-id-2',
  //     },
  //   ]);
  // });
});

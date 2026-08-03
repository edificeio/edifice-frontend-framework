import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProfileLinks } from './useProfileLinks';

const mocks = vi.hoisted(() => ({
  useEdificeClient: vi.fn(),
  useChildren: vi.fn(),
}));

vi.mock(
  '../../../../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({
    useEdificeClient: mocks.useEdificeClient,
  }),
);

vi.mock('./useChildren', () => ({
  useChildren: mocks.useChildren,
}));

describe('useProfileLinks', () => {
  beforeEach(() => {
    mocks.useEdificeClient.mockReturnValue({
      user: {
        userId: 'user-id',
        structures: ['structure-id'],
        classes: [],
      },
    });
    mocks.useChildren.mockReturnValue({ data: undefined });
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

  it('returns undefined for the Relative profile when the user has no children', () => {
    mocks.useChildren.mockReturnValue({ data: [] });

    const { result } = renderHook(() => useProfileLinks('Relative'));

    expect(result.current).toBeUndefined();
    expect(mocks.useChildren).toHaveBeenCalledWith('user-id', true);
  });

  it('returns one link per child for the Relative profile', () => {
    mocks.useChildren.mockReturnValue({
      data: [
        {
          id: 'child-id-1',
          firstName: 'Ronald',
          displayName: 'Ronald WEASLEY',
          externalId: 'ext-1',
          classesNames: ['CE2-A'],
          classes: [{ id: 'class-id-1', name: 'CE2-A' }],
        },
        {
          id: 'child-id-2',
          firstName: 'Ginny',
          displayName: 'Ginny WEASLEY',
          externalId: 'ext-2',
          classesNames: ['CM1-B'],
          classes: [{ id: 'class-id-2', name: 'CM1-B' }],
        },
      ],
    });

    const { result } = renderHook(() => useProfileLinks('Relative'));

    expect(result.current).toEqual([
      {
        text: 'La classe de Ronald',
        url: '/userbook/annuaire#/search?filters=groups&structure=structure-id&class=class-id-1',
      },
      {
        text: 'La classe de Ginny',
        url: '/userbook/annuaire#/search?filters=groups&structure=structure-id&class=class-id-2',
      },
    ]);
  });

  it('does not fetch children for non-Relative profiles', () => {
    mocks.useChildren.mockReturnValue({ data: undefined });

    renderHook(() => useProfileLinks('Teacher'));

    expect(mocks.useChildren).toHaveBeenCalledWith('user-id', false);
  });
});

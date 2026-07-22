import { checkUserRight } from './check-user-rights';

const rightsMethods = vi.hoisted(() => ({
  sessionHasAtLeastOneResourceRight: vi.fn(),
  sessionHasResourceRight: vi.fn(),
  sessionHasAtLeastOneResourceRightForEachList: vi.fn(),
  sessionHasResourceRightForEachList: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    rights: () => rightsMethods,
  },
}));

describe('checkUserRight', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('checks default roles with a single right', async () => {
    rightsMethods.sessionHasResourceRight.mockImplementation(
      async (role: string) => role === 'read',
    );

    const result = await checkUserRight('read');

    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledTimes(4);
    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledWith(
      'contrib',
      ['read'],
    );
    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledWith(
      'creator',
      ['read'],
    );
    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledWith(
      'manager',
      ['read'],
    );
    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledWith('read', [
      'read',
    ]);

    expect(result).toEqual({
      creator: false,
      contrib: false,
      manager: false,
      read: true,
    });
  });

  it('supports additional roles', async () => {
    rightsMethods.sessionHasResourceRight.mockResolvedValue(true);

    const result = await checkUserRight('read', 'super-admin');

    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledTimes(5);
    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledWith(
      'super-admin',
      ['read'],
    );
    expect((result as Record<string, boolean>)['super-admin']).toBe(true);
  });

  it('checks list of rights from object input', async () => {
    rightsMethods.sessionHasResourceRight.mockResolvedValue(true);

    const result = await checkUserRight({ rights: ['read', 'contrib'] });

    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledTimes(4);
    expect(rightsMethods.sessionHasResourceRight).toHaveBeenCalledWith(
      'contrib',
      ['read', 'contrib'],
    );
    expect(result).toEqual({
      creator: true,
      contrib: true,
      manager: true,
      read: true,
    });
  });

  it('checks rights for multiple resources', async () => {
    rightsMethods.sessionHasResourceRightForEachList.mockResolvedValue(true);

    const result = await checkUserRight([
      { rights: ['read'] },
      { rights: ['read', 'contrib'] },
    ]);

    expect(
      rightsMethods.sessionHasResourceRightForEachList,
    ).toHaveBeenCalledTimes(4);
    expect(
      rightsMethods.sessionHasResourceRightForEachList,
    ).toHaveBeenCalledWith('read', [['read'], ['read', 'contrib']]);
    expect(result).toEqual({
      creator: true,
      contrib: true,
      manager: true,
      read: true,
    });
  });

  it('returns false for all roles when rights list is empty', async () => {
    const result = await checkUserRight([]);

    expect(rightsMethods.sessionHasResourceRight).not.toHaveBeenCalled();
    expect(
      rightsMethods.sessionHasResourceRightForEachList,
    ).not.toHaveBeenCalled();
    expect(result).toEqual({
      creator: false,
      contrib: false,
      manager: false,
      read: false,
    });
  });
});

import { signOutAction } from './action';

const { cookiesDeleteMock } = vi.hoisted(() => ({
  cookiesDeleteMock: vi.fn(),
}));
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    delete: cookiesDeleteMock,
  })),
}));

describe('signOutAction', () => {
  it('Cookie の "token" を削除すること', () => {
    signOutAction();

    expect(cookiesDeleteMock).toHaveBeenCalledWith('token');
  });
});

import { currentUserId, isAuthenticated } from './auth';

const { cookiesGetMock, verifyJwtMock } = vi.hoisted(() => ({
  cookiesGetMock: vi.fn(),
  verifyJwtMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: cookiesGetMock,
  })),
}));

vi.mock('./jwt', () => ({
  verifyJwt: verifyJwtMock,
}));

describe('lib/server/auth', () => {
  describe('isAuthenticated', () => {
    it('Cookie に "token" があれば true を返すこと', () => {
      cookiesGetMock.mockImplementation((key: string) => {
        if (key === 'token') return { value: 'dummy' };

        return undefined;
      });
      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('Cookie に "token" がなければ false を返すこと', () => {
      cookiesGetMock.mockImplementation((key: string) => {
        if (key === 'token') return undefined;

        return undefined;
      });
      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('currentUserId', () => {
    describe('Cookie に "token" がある場合、', () => {
      beforeEach(() => {
        cookiesGetMock.mockImplementation((key: string) => {
          if (key === 'token') return { value: 'dummy' };

          return undefined;
        });
      });

      it('verifyJwt が string の sub を返したとき、それを返すこと', () => {
        verifyJwtMock.mockReturnValue({ sub: 'sub' });
        const result = currentUserId();

        expect(result).toBe('sub');
      });

      it('verifyJwt が string の sub を返さなかったとき、null を返すこと', () => {
        verifyJwtMock.mockReturnValue({ sub: 123 });
        const result = currentUserId();

        expect(result).toBe(null);
      });
    });

    describe('Cookie に "token" がない場合、', () => {
      beforeEach(() =>
        cookiesGetMock.mockImplementation((key: string) => {
          if (key === 'token') return undefined;

          return undefined;
        }),
      );

      it('null を返すこと', () => {
        const result = currentUserId();

        expect(result).toBe(null);
      });
    });
  });
});

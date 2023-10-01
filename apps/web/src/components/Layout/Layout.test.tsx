import { Layout } from '.';
import { render } from '@testing-library/react';

const { isAuthenticatedMock } = vi.hoisted(() => ({
  isAuthenticatedMock: vi.fn(() => true),
}));
vi.mock('../../lib/server/auth/auth', () => ({
  isAuthenticated: isAuthenticatedMock,
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Layout', () => {
  it('renders unchanged', () => {
    const { asFragment } = render(<Layout>main</Layout>);

    expect(asFragment()).toMatchSnapshot();
  });
});

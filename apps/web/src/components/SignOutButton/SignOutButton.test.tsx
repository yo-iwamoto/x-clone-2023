import { SignOutButton } from '.';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { signOutActionMock, routerRefreshMock } = vi.hoisted(() => ({
  signOutActionMock: vi.fn(),
  routerRefreshMock: vi.fn(),
}));
vi.mock('./action', () => ({
  signOutAction: signOutActionMock,
}));
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: routerRefreshMock,
  })),
}));

describe('SignOutButton', () => {
  it('snapshot unchanged', () => {
    const { asFragment } = render(<SignOutButton />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('signOutAction を呼び出すこと', async () => {
    const { getByRole } = render(<SignOutButton />);

    await userEvent.click(getByRole('button', { name: 'Sign out' }));

    expect(signOutActionMock).toHaveBeenCalled();
  });

  it('サインアウト後、Router Cache が refresh されること', async () => {
    const { getByRole } = render(<SignOutButton />);

    await userEvent.click(getByRole('button', { name: 'Sign out' }));

    expect(routerRefreshMock).toHaveBeenCalled();
  });
});

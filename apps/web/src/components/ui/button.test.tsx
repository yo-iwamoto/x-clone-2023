import { Button } from './button';
import { render } from '@testing-library/react';

describe('button', () => {
  it('renders unchanged', () => {
    const { asFragment } = render(<Button />);

    expect(asFragment()).toMatchSnapshot();
  });
});

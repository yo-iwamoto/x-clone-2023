import { actionResult } from './actionResult';

describe('actionResult', () => {
  it('snapshot unchanged', () => {
    expect(actionResult).toMatchSnapshot();
  });

  it('success が true 型であること', () => {
    expectTypeOf(actionResult.success).toMatchTypeOf<true>();
  });

  it('failure が false 型であること', () => {
    expectTypeOf(actionResult.failure).toMatchTypeOf<false>();
  });
});

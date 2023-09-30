import app from '.';

it('GET /', async () => {
  const res = await app.request('/');
  expect(res.status).toBe(200);
  expect(await res.text()).toBe('Hello Hono!');
});

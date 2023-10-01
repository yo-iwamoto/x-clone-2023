import { verifyJwt } from './jwt';
import { cookies } from 'next/headers';

export function isAuthenticated() {
  return cookies().get('token') !== undefined;
}

export function currentUserId() {
  const token = cookies().get('token')?.value;
  if (token === undefined) return null;

  const { sub } = verifyJwt(token);
  if (typeof sub !== 'string') return null;

  return sub;
}

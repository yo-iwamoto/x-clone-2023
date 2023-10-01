import { verifyJwt } from './jwt';
import { prisma } from '../prisma';
import { cookies } from 'next/headers';

export function isAuthenticated() {
  return cookies().get('token') !== undefined;
}

export async function isEmailVerified() {
  const id = currentUserId();
  if (id === null) return false;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      hasEmailVerified: true,
    },
  });
  if (user === null) throw new Error('User not found');

  return user.hasEmailVerified;
}

export function currentUserId() {
  const token = cookies().get('token')?.value;
  if (token === undefined) return null;

  const { sub } = verifyJwt(token);
  if (typeof sub !== 'string') return null;

  return sub;
}

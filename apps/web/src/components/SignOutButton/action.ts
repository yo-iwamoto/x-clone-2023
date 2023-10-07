'use server';

import { cookies } from 'next/headers';

/** @package */
export async function signOutAction() {
  cookies().delete('token');
}

'use server';

import { cookies } from 'next/headers';

export async function signOutAction() {
  cookies().delete('token');
}

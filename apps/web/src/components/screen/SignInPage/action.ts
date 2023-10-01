'use server';

import { actionResult } from '@/lib/server/actionResult';
import { prisma } from '@/lib/server/prisma';
import { createJwt } from '@/lib/server/auth/jwt';
import { compare } from 'bcrypt';
import { z } from 'zod';
import { cookies } from 'next/headers';

const schema = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export async function signInAction(formData: FormData) {
  const dataObj = Object.fromEntries(formData.entries());
  const { email, password } = schema.parse(dataObj);

  const secret = await prisma.userSecret.findUnique({
    where: {
      email,
    },
    select: {
      passwordHash: true,
      user: {
        select: {
          id: true,
        },
      },
    },
  });
  if (secret === null) {
    return {
      success: actionResult.failure,
      message: 'No user found with that email',
    };
  }

  const isPasswordValid = await compare(password, secret.passwordHash);
  if (!isPasswordValid) {
    return {
      success: actionResult.failure,
      message: 'Invalid email or password',
    };
  }

  const jwt = createJwt({}, { subject: secret.user.id });
  cookies().set('token', jwt, { httpOnly: true, secure: true });
  return { success: actionResult.success };
}

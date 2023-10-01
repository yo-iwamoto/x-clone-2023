'use server';

import { actionResult } from '@/lib/server/actionResult';
import { prisma } from '@/lib/server/prisma';
import { createJwt } from '@/lib/server/auth/jwt';
import { hashPassword } from '@/lib/server/auth/password';
import { sendMail } from '@/lib/server/sendMail';
import { env } from '@/config/env';
import { z } from 'zod';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const schema = z.object({
  email: z.string().nonempty(),
  password: z.string().min(8).nonempty(),
});

export async function signUpAction(formData: FormData) {
  const dataObj = Object.fromEntries(formData.entries());
  const { email, password } = schema.parse(dataObj);

  const secret = await prisma.userSecret.findUnique({
    where: {
      email,
    },
  });
  if (secret !== null) {
    return {
      success: actionResult.failure,
      message: 'You already have an account for this email',
    };
  }

  const user = await prisma.$transaction(async ($tx) => {
    const user = await prisma.user.create({
      data: {
        displayId: generateRandomString(),
        displayName: 'Anonymous',
        userSecret: {
          create: {
            email,
            passwordHash: hashPassword(password),
          },
        },
      },
      select: {
        id: true,
      },
    });
    const tomorrow = getTommorow();
    const token = generateRandomString();
    const emailVerificationIntent = await $tx.emailVerificationIntents.create({
      data: {
        userId: user.id,
        expiresAt: tomorrow,
        token,
      },
    });
    await sendMail({
      to: email,
      subject: 'Please verify your email - x-clone-2023',
      html: `<main>
<h1 className="font-bold text-4xl">Email Verification</h1>
<p>Please verify your email by clicking the link below.</p>
<a href="${env.APP_URL}/api/auth/verify-email/${emailVerificationIntent.id}?token=${emailVerificationIntent.token}">
${env.APP_URL}/api/auth/verify-email/${emailVerificationIntent.id}?token=${emailVerificationIntent.token}
</a>
</main>`,
    });
    return user;
  });
  const jwt = createJwt({}, { subject: user.id });
  cookies().set('token', jwt);
  return { success: actionResult.success };
}

function generateRandomString() {
  return crypto
    .randomBytes(Math.ceil(32 / 2))
    .toString('hex')
    .slice(0, 32);
}

function getTommorow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

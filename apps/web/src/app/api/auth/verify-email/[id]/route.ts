import { prisma } from '@/lib/server/prisma';
import { createJwt } from '@/lib/server/auth/jwt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

type Param = {
  params: {
    id: string;
  };
};

export async function GET(
  req: NextRequest,
  { params: { id: intentId } }: Param,
) {
  const token = req.nextUrl.searchParams.get('token');
  const intent = await prisma.emailVerificationIntents.findUnique({
    where: {
      id: intentId,
    },
    select: {
      userId: true,
      expiresAt: true,
      token: true,
    },
  });
  if (intent === null) {
    return NextResponse.json({ message: 'Invalid intent' }, { status: 400 });
  }

  if (intent.token !== token) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }

  if (intent.expiresAt < new Date()) {
    return NextResponse.json({ message: 'Intent expired' }, { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: intent.userId,
    },
    data: {
      hasEmailVerified: true,
    },
  });
  const jwt = createJwt({}, { subject: intent.userId });
  cookies().set('token', jwt, { httpOnly: true, secure: true });
  return NextResponse.redirect(req.nextUrl.origin);
}

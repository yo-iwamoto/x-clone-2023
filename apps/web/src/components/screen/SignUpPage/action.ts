'use server';

import { actionResult } from '@/lib/server/actionResult';
import { prisma } from '@/lib/server/prisma';
import { createJwt } from '@/lib/server/auth/jwt';
import { hashPassword } from '@/lib/server/auth/password';
import { sendMail } from '@/lib/server/sendMail';
import { currentUserId } from '@/lib/server/auth/auth';
import { z } from 'zod';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const schema = z.object({
  email: z.string().nonempty(),
  password: z.string().min(8).nonempty(),
});

export async function signUpAction(formData: FormData) {
  // データ検証
  const dataObj = Object.fromEntries(formData.entries());
  const { email, password } = schema.parse(dataObj);

  // user_secrets を email で検索
  const secret = await prisma.userSecret.findUnique({
    where: {
      email,
    },
  });
  // すでに登録済みの場合はエラー
  if (secret !== null) {
    return {
      success: actionResult.failure,
      message: 'You already have an account for this email',
    };
  }

  const user = await prisma.$transaction(async ($tx) => {
    // users および user_secrets にレコードを作成
    const user = await $tx.user.create({
      data: {
        displayId: generateRandomString(),
        displayName: 'Anonymous',
        userSecret: {
          create: {
            email,
            // パスワードはハッシュ化; salt は hash に含まれる
            passwordHash: hashPassword(password),
          },
        },
      },
      select: {
        id: true,
      },
    });
    // verification_codes を作成
    const { code } = await $tx.verificationCode.create({
      data: {
        userId: user.id,
        // 30分で失効
        expiresAt: gen30MinutesLater(),
        code: generateVerificationCode(),
      },
    });
    // Verification code をメールで送信
    await sendMail({
      to: email,
      subject: `Verification Code: ${code} - x-clone-2023`,
      html: `<main>
<h1 className="font-bold text-4xl">Email Verification</h1>
<p>Your verification code for sign up is ${code}</p>
</main>`,
    });
    return user;
  });
  // クッキーに JWT をセット
  const jwt = createJwt({}, { subject: user.id });
  cookies().set('token', jwt);
  return { success: actionResult.success };
}

const verifyCodeActionSchema = z.object({
  code: z.string().length(6),
});

export async function verifyCodeAction(formData: FormData) {
  // データの検証
  const dataObj = Object.fromEntries(formData.entries());
  const { code } = verifyCodeActionSchema.parse(dataObj);
  // ログインしていない場合、エラー
  const userId = currentUserId();
  if (userId === null) {
    return { success: actionResult.failure, message: 'Not logged in' };
  }

  // verification_codes を userId で検索
  const records = await prisma.verificationCode.findMany({
    where: {
      userId,
    },
    select: {
      code: true,
      expiresAt: true,
    },
  });
  const matched = records.find((record) => record.code === code);
  // 一致するコードがない場合、エラー
  if (matched === undefined) {
    return {
      success: actionResult.failure,
      message: 'Verification code does not match',
    };
  }

  // 一致するが、有効期限切れの場合、エラー
  if (matched.expiresAt < new Date()) {
    return {
      success: actionResult.failure,
      message: 'Verification code has expired',
    };
  }

  // 不要になった verification_codes を削除
  await prisma.verificationCode.deleteMany({
    where: {
      userId,
    },
  });
  // users.hasEmailVerified を true に更新
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hasEmailVerified: true,
    },
  });

  return {
    success: true,
    message: 'Email verified',
  };
}

/** generate 32 characters long random string */
function generateRandomString() {
  return crypto
    .randomBytes(Math.ceil(32 / 2))
    .toString('hex')
    .slice(0, 32);
}

/** generate 30 minutes later date */
function gen30MinutesLater() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);
  return date;
}

/** generate 6 digits verification code */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

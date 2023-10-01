import { Toaster } from '@/components/ui/toaster';
import { isAuthenticated } from '@/lib/server/auth/auth';
import { SignOutButton } from '@/components/SignOutButton';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import '@/styles/global.css';

export const metadata = {
  title: 'X-Clone-2023',
  description: 'Crafted by you-5805',
} satisfies Metadata;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='ja'>
      <body>
        <header className='mx-auto flex h-20 max-w-3xl items-center justify-between px-2 py-5'>
          <Link href='/' className='text-2xl'>
            X Clone 2023
          </Link>

          {isAuthenticated() ? (
            <SignOutButton />
          ) : (
            <Link href='/sign-in' className={buttonVariants()}>
              Sign in
            </Link>
          )}
        </header>
        <main className='mx-auto max-w-3xl px-2 py-10'>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

import { SignOutButton } from '../SignOutButton';
import { buttonVariants } from '../ui/button';
import { Toaster } from '../ui/toaster';
import { isAuthenticated } from '../../lib/server/auth/auth';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
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
    </>
  );
}

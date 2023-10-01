'use client';

import { signOutAction } from './action';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = () => {
    startTransition(() => {
      signOutAction();
      router.refresh();
    });
  };

  return (
    <Button type='button' onClick={onClick} disabled={isPending}>
      Sign out
    </Button>
  );
}

'use client';

import { signInAction } from './action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SignInPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const formAction = (formData: FormData) => {
    startTransition(() => {
      (async () => {
        const result = await signInAction(formData);
        if (!result.success) {
          toast({ title: result.message });
          return;
        }

        router.push('/');
      })();
    });
  };

  return (
    <div className='grid gap-8'>
      <h1 className='text-3xl font-bold'>Sign in</h1>

      <form action={formAction} className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' name='email' required />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' name='password' required />
        </div>
        <Button type='submit' className='w-full' disabled={isPending}>
          Submit
        </Button>
      </form>

      <p className='flex gap-2'>
        <span>Don&apos;t have an account?</span>
        <Link href='/sign-up' className='text-primary hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  );
}

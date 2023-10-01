'use client';

import { signUpAction } from './action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const formAction = (formData: FormData) => {
    startTransition(() => {
      (async () => {
        const result = await signUpAction(formData);
        if (!result.success) {
          toast({ title: result.message });
          return;
        }

        toast({ title: 'Verification email sent' });
        router.push('/');
      })();
    });
  };

  return (
    <div className='grid gap-8'>
      <h1 className='text-3xl font-bold'>Sign up</h1>

      <form action={formAction} className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' name='email' required />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            name='password'
            minLength={8}
            required
          />
        </div>
        <Button type='submit' className='w-full' disabled={isPending}>
          Submit
        </Button>
      </form>

      <p className='flex gap-2'>
        <span>Already have an account?</span>
        <Link href='/sign-in' className='text-primary hover:underline'>
          Sign in
        </Link>
      </p>
    </div>
  );
}

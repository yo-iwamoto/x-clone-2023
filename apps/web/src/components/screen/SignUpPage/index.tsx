'use client';

import { signUpAction, verifyCodeAction } from './action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SignUpPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        setIsDialogOpen(true);
      })();
    });
  };

  const verificationAction = (formData: FormData) => {
    startTransition(() => {
      (async () => {
        const result = await verifyCodeAction(formData);
        if (!result.success) {
          toast({ title: result.message });
          return;
        }

        toast({ title: 'Email verified' });
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              Verification code has been sent to your email. Please check your
              inbox and enter the code below.
            </DialogDescription>
          </DialogHeader>
          <form action={verificationAction} className='grid gap-2'>
            <Label htmlFor='code'>Verification Code</Label>
            <Input id='code' type='number' name='code' minLength={8} required />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

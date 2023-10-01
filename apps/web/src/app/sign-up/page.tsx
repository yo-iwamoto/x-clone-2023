import { SignUpPage } from '@/components/screen/SignUpPage';
import { isEmailVerified } from '@/lib/server/auth/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  if (await isEmailVerified()) {
    redirect('/');
  }

  return <SignUpPage />;
}

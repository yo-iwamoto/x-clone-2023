import { SignInPage } from '@/components/screen/SignInPage';
import { isAuthenticated } from '@/lib/server/auth/auth';
import { redirect } from 'next/navigation';

export default function Page() {
  if (isAuthenticated()) {
    redirect('/');
  }

  return <SignInPage />;
}

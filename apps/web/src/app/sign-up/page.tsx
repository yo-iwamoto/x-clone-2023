import { SignUpPage } from '@/components/screen/SignUpPage';
import { isAuthenticated } from '@/lib/server/auth/auth';
import { redirect } from 'next/navigation';

export default function Page() {
  if (isAuthenticated()) {
    redirect('/');
  }

  return <SignUpPage />;
}

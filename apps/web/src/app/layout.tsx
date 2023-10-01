import { Layout } from '@/components/Layout';
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
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

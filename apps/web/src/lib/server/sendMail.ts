import { env } from '@/config/env';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

type Arguments = {
  to: string;
  subject: string;
  html: string;
};

export function sendMail(args: Arguments) {
  return resend.emails.send({
    from: 'info@yoiw.dev',
    ...args,
  });
}

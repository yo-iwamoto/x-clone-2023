import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string(),
    JWT_SECRET: z.string(),
    APP_URL: z.string(),
  },
  client: {},
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    APP_URL: process.env.APP_URL,
  },
});

import { env } from '@/config/env';
import jwt from 'jsonwebtoken';

export function createJwt(payload: object = {}, options?: jwt.SignOptions) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '1d',
    ...options,
  });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

import bcrypt from 'bcrypt';

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function compare(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

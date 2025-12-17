import * as bcrypt from 'bcryptjs';
import { UserEntity } from './model/user.entity';

export async function compareUserPassword(
  user: UserEntity,
  plainPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, user.password);
}

export async function hashUserPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

import { UserRole } from './user-role.enum';

export interface JwtUser {
  id: string;
  role: UserRole;
}

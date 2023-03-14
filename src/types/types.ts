import { User } from '../api/users/user-schema.js';

export interface LoginResponse {
  accessToken: string;
}

export type AuthRequest = Pick<User, 'email' | 'password'>;

export interface UserQueryId {
  id: string;
}

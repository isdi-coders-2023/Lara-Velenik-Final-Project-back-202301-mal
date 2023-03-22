import { User } from '../api/users/user-schema.js';

export interface LoginResponse {
  accessToken: string;
}

export type LoginRequest = Pick<User, 'email' | 'password'>;
export type RegisterRequest = Pick<
  User,
  'name' | 'surname' | 'email' | 'password'
>;

export interface UserQueryId {
  id: string;
}

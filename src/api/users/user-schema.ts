import mongoose, { Schema } from 'mongoose';

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<User>({
  name: String,
  surname: String,
  email: String,
  password: String,
});

export const UserModel = mongoose.model<User>('User', UserSchema, 'users');

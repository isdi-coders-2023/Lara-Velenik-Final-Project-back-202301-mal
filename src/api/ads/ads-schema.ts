import mongoose, { Schema } from 'mongoose';
import { User } from '../users/user-schema';

export interface Ads {
  name: string;
  surname: string;
  breed: string;
  email: string;
  phone: string;
  city: string;
  image: string;
  creator: User;
}

const AdsSchema = new Schema<Ads>({
  name: String,
  surname: String,
  breed: String,
  email: String,
  phone: String,
  city: String,
  image: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const AdsModel = mongoose.model<Ads>('Ads', AdsSchema, 'ads');

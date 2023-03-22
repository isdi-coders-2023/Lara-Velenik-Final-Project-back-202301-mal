import { Ads } from '../api/ads/ads-schema.js';

export interface UserLocalsAuthInfo {
  email: string;
}

export type AdsRequest = Omit<Ads, 'creator'>;

import { RequestHandler } from 'express';
import {
  PROFILE_BUCKET_NAME,
  supabase,
} from '../../database/supabase-clients.js';
import log from '../../logger.js';

import { AdsRequest, UserLocalsAuthInfo } from '../../types/ads-types.js';
import { CustomHTTPError } from '../../utils/custom-http-error.js';

import { UserModel } from '../users/user-schema.js';
import { Ads, AdsModel } from './ads-schema.js';

export const createAdController: RequestHandler<
  unknown,
  Ads,
  AdsRequest,
  unknown,
  UserLocalsAuthInfo
> = async (req, res, next) => {
  const { email } = res.locals;

  log.info('email ', email);

  const creatorUser = await UserModel.findOne(
    { email },
    { password: 0, __v: 0 },
  ).exec();

  log.info('creatorUser ', creatorUser);

  if (creatorUser === null) {
    return next(new CustomHTTPError(404, 'User not found'));
  }

  const newAd: Ads = { ...req.body, creator: creatorUser };

  const fileBuffer = req.file?.buffer;

  const fileName = `${email}${Date.now()}${req.file?.originalname}`;

  if (fileBuffer !== undefined) {
    const { error } = await supabase.storage
      .from(PROFILE_BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        upsert: true,
      });

    if (error === null) {
      const { data } = supabase.storage
        .from(PROFILE_BUCKET_NAME)
        .getPublicUrl(fileName);
      log.info('Public URL generated', data.publicUrl);
      newAd.image = data.publicUrl; // Add the image URL to the newAd object
    }
  }

  const dbRes = await AdsModel.create(newAd);

  log.info('Ad created', dbRes);
  if (dbRes !== null) {
    res.sendStatus(201);
  }
};

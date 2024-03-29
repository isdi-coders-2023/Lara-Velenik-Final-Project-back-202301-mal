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

const queryProjection = { __v: 0 };

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
      newAd.image = data.publicUrl;
    }
  }

  const dbRes = await AdsModel.create(newAd);

  log.info('Ad created', dbRes);
  if (dbRes !== null) {
    res.sendStatus(201);
  }
};

export const getAllAdsController: RequestHandler = async (_req, res, next) => {
  try {
    const foundAds = await AdsModel.find({}, queryProjection).exec();
    res.json({ ads: foundAds, msg: 'Ads found' });
  } catch (error) {
    next(error);
  }
};

export const getAdByIdController: RequestHandler<
  { _id: string },
  Ads | { message: string }
> = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const ad = await AdsModel.findById(_id).exec();

    if (ad === null) {
      return next(new CustomHTTPError(404, 'The ad does not exist'));
    }

    res.json(ad);
  } catch (error) {
    next(error);
  }
};

export const deleteAdController: RequestHandler<
  { _id: string },
  Ads,
  AdsRequest,
  unknown,
  UserLocalsAuthInfo
> = async (req, res, next) => {
  const { email } = res.locals;
  const { _id } = req.params;

  log.info('email ', email);

  const creatorUser = await UserModel.findOne(
    { email },
    { password: 0, __v: 0 },
  ).exec();

  if (creatorUser === null) {
    return next(new CustomHTTPError(404, 'User not found'));
  }

  const adUser = await AdsModel.findOne(
    { creator: creatorUser._id, _id },
    { password: 0, __v: 0 },
  ).exec();

  if (adUser === null) {
    return next(new CustomHTTPError(404, 'Wrong user'));
  }

  try {
    const ad = await AdsModel.findOneAndDelete({ _id }).exec();

    if (ad === null) {
      return next(new CustomHTTPError(404, 'The ad does not exist'));
    }

    res.json(ad);
  } catch (error) {
    next(error);
  }
};

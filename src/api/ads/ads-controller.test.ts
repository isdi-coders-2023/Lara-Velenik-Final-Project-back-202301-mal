import { Request, Response } from 'express';
// Import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
import { Ads, AdsModel } from './ads-schema.js';
import { AdsRequest, UserLocalsAuthInfo } from '../../types/ads-types.js';
import { createAdController } from './ads-controller.js';
import { UserModel } from '../users/user-schema.js';
import { CustomHTTPError } from '../../utils/custom-http-error.js';
// Import { CustomHTTPError } from '../../utils/custom-http-error.js';

jest.mock('@supabase/supabase-js', () => {
  const data = {
    publicUrl: 'https://example.com/photo.webp',
  };
  return {
    createClient: jest.fn().mockImplementation(() => ({
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({
            error: null,
            data: {
              ...data,
            },
          }),
          getPublicUrl: jest.fn().mockReturnValue({
            error: null,
            data: {
              ...data,
            },
          }),
        }),
      },
    })),
  };
});

describe('Given a createAdController to create an ad', () => {
  const mockResponse = {
    json: jest.fn(),
    sendStatus: jest.fn().mockReturnThis(),
    locals: { email: 'thais@gmail.com', id: 'mockId' },
  } as Partial<
    Response<Ads | { message: string }, UserLocalsAuthInfo & { id: string }>
  >;

  const next = jest.fn();

  const ad = {
    name: 'mockName',
    surname: 'mockSurname',
    breed: 'mockBreed',
    email: 'mockEmail',
    phone: '611000000',
    city: 'mockCity',
    image: 'https://example.com/photo.webp',
  };

  AdsModel.create = jest.fn().mockResolvedValue(ad);
  UserModel.findOne = jest.fn().mockResolvedValue(ad);

  test('when the user tries to create an ad with an image, it should return a 201 status', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(1),
    }));

    const validMockRequest = {
      body: {
        name: 'Thais',
        surname: 'Jacob',
        breed: 'Bengalí',
        email: 'thais@gmail.com',
        phone: '666010101',
        city: 'Málaga',
      },
      file: {
        buffer: Buffer.from('mockBuffer'),
        originalname: 'mockOriginalname',
      },
    } as Partial<Request>;

    await createAdController(
      validMockRequest as Request<
        unknown,
        Ads,
        AdsRequest,
        unknown,
        UserLocalsAuthInfo
      >,
      mockResponse as Response<Ads | { message: string }, UserLocalsAuthInfo>,
      next,
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(201);
  });

  test('when it tries to search for a creator user and does not find one, then it gives a 404 error', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));

    const validMockRequest = {
      body: {
        name: 'Thais',
        surname: 'Jacob',
        breed: 'Bengalí',
        email: 'thais@gmail.com',
        phone: '666010101',
        city: 'Málaga',
      },
      file: {
        buffer: Buffer.from('mockBuffer'),
        originalname: 'mockOriginalname',
      },
    } as Partial<Request>;

    await createAdController(
      validMockRequest as Request<
        unknown,
        Ads,
        AdsRequest,
        unknown,
        UserLocalsAuthInfo
      >,
      mockResponse as Response<Ads | { message: string }, UserLocalsAuthInfo>,
      next,
    );

    expect(next).toHaveBeenCalledWith(
      new CustomHTTPError(404, 'User not found'),
    );
  });
});

// Test('when the user tries to create an ad without an image, then it should pass on an error', async () => {
//   const invalidMockRequest = {
//     body: {
//       name: 'mockName',
//       surname: 'mockSurname',
//       breed: 'mockBreed',
//       email: 'mockEmail',
//       phone: '611000000',
//       city: 'mockCity',
//     },
//     file: {
//       buffer: undefined,
//       originalname: 'mockOriginalname',
//     },
//   } as unknown as Partial<Request>;

//   await createAdController(
//     invalidMockRequest as Request<
//       unknown,
//       Ads,
//       AdsRequest,
//       unknown,
//       UserLocalsAuthInfo
//     >,
//     mockResponse as Response<
//       Ads | { message: string },
//       UserLocalsAuthInfo & Locals
//     >,
//     next,
//   );

//   expect(next).toHaveBeenCalled();
// });
